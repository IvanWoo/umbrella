import type { Maybe, Nullable, NumOrString } from "@thi.ng/api";
import {
	BIGINT_ARRAY_CTORS,
	BIT_SHIFTS,
	TYPEDARRAY_CTORS,
	type BigType,
	type Type,
} from "@thi.ng/api/typedarray";
import { isString } from "@thi.ng/checks/is-string";
import { unsupported } from "@thi.ng/errors/unsupported";
import type {
	CodeGenOpts,
	CodeGenOptsBase,
	Enum,
	Field,
	ICodeGen,
	Struct,
	TypeColl,
	Union,
	WasmPrim,
	WasmTarget,
} from "./api.js";
import { classifyField } from "./internal/classify.js";
import {
	ensureLines,
	ensureStringArray,
	enumName,
	injectBody,
	isEnum,
	isFuncPointer,
	isNumeric,
	isOpaque,
	isPointer,
	isStringSlice,
	isWasmPrim,
	isWasmString,
	prefixLines,
	usesStrings,
	withIndentation,
} from "./internal/utils.js";
import { fieldType as zigFieldType } from "./zig.js";

interface AugmentedField {
	field: Field;
	type: string;
	decl: Nullable<string>;
	getter: Nullable<string[]>;
	setter: Nullable<string[]>;
}

/**
 * TypeScript code generator options.
 */
export interface TSOpts extends CodeGenOptsBase {
	/**
	 * Indentation string
	 *
	 * @defaultValue "\t"
	 */
	indent: string;
}

/**
 * TypeScript code generator. Call with options and then pass to
 * {@link generateTypes} (see its docs for further usage).
 *
 * @remarks
 * This codegen generates interface and enum definitions for a {@link TypeColl}
 * given to {@link generateTypes}. For structs it will also generate memory
 * mapped wrappers with fully typed accessors.
 *
 * @param opts
 */
export const TYPESCRIPT = (opts: Partial<TSOpts> = {}) => {
	const { indent = "\t" } = opts;
	const SCOPES: [RegExp, RegExp] = [/\{$/, /(?<!\{.*)\}\)?[;,]?$/];

	const gen: ICodeGen = {
		id: "ts",

		pre: (coll, globalOpts) => {
			const str = __stringImpl(globalOpts);
			const res = [
				"// @ts-ignore possibly includes unused imports",
				`import { defType, Pointer, ${str}, type IWasmMemoryAccess, type MemorySlice, type MemoryView, type WasmTypeBase } from "@thi.ng/wasm-api";`,
			];
			if (
				Object.values(coll).some(
					(t) => t.type === "struct" || t.type === "union"
				)
			) {
				const bits = globalOpts.target.bits;
				res.push(
					"// @ts-ignore",
					`import { __array, __instanceArray, __slice${bits}, __primslice${bits} } from "@thi.ng/wasm-api/memory";`
				);
			}
			if (usesStrings(coll)) {
				res.push(
					"",
					"// @ts-ignore possibly unused",
					`const __str = (mem: IWasmMemoryAccess, base: number, isConst = true) => new ${str}(mem, base, isConst);`
				);
			}
			if (opts.pre) res.push("", ...ensureStringArray(opts.pre));
			return res.join("\n");
		},

		post: () =>
			opts.post
				? isString(opts.post)
					? opts.post
					: opts.post.join("\n")
				: "",

		doc: (doc, acc, opts) => {
			acc.push("/**", ...prefixLines(" * ", doc, opts.lineWidth), " */");
		},

		ext: (e, _, acc) => {
			acc.push(
				`// external type: ${e.name} (size: ${e.size}, align: ${e.align})\n`
			);
		},

		enum: (e, _, acc, opts) => {
			const res: string[] = [];
			res.push(`export enum ${e.name} {`);
			for (let v of e.values) {
				let line: string;
				if (!isString(v)) {
					v.doc && gen.doc(v.doc, res, opts);
					line = enumName(opts, v.name);
					if (v.value != null) line += ` = ${v.value}`;
				} else {
					line = enumName(opts, v);
				}
				res.push(line + ",");
			}
			res.push("}", "");
			acc.push(...withIndentation(res, indent, ...SCOPES));
		},

		struct: (struct, coll, acc, opts) => {
			const strType = __stringImpl(opts);
			const fields = <AugmentedField[]>(
				struct.fields
					.map((f) => __generateField(f, coll, opts))
					.filter((f) => !!f && (f.getter || f.setter))
			);

			const lines: string[] = [];
			lines.push(
				`export interface ${struct.name} extends WasmTypeBase {`
			);
			for (let f of fields) {
				const doc = __docType(f.field, struct, coll, opts);
				doc && gen.doc(doc, lines, opts);
				const decl = `${f.field.name}: ${f.type};`;
				lines.push((!f.setter ? `readonly ` : "") + decl);
			}
			injectBody(lines, struct.body?.ts, "decl");
			lines.push("}", "");

			const pointerDecls = fields
				.filter((f) => isPointer(f.field.tag) && f.field.len !== 0)
				.map((f) => {
					return `$${f.field.name}: ${f.type}`;
				});
			const stringDecls = fields
				.filter(
					(f) =>
						isWasmString(f.field.type) &&
						!["array", "ptr", "slice"].includes(f.field.tag!)
				)
				.map((f) => `$${f.field.name}: ${strType}`);

			// type implementation
			lines.push(
				"// @ts-ignore possibly unused args",
				`export const $${struct.name} = defType<${struct.name}>(${struct.__align}, ${struct.__size}, (mem, base) => {`,
				...(pointerDecls.length
					? [`let ${pointerDecls.join(", ")};`]
					: []),
				...(stringDecls.length
					? [`let ${stringDecls.join(", ")};`]
					: []),
				`return {`
			);

			for (let f of fields) {
				if (!f) continue;
				if (f.getter) {
					lines.push(
						`get ${f.field.name}(): ${f.type} {`,
						...f.getter,
						"},"
					);
				}
				if (f.setter) {
					lines.push(
						`set ${f.field.name}(x: ${f.type}) {`,
						...f.setter,
						"},"
					);
				}
			}
			injectBody(lines, struct.body?.ts);
			lines.push("};", "});", "");
			acc.push(...withIndentation(lines, indent, ...SCOPES));
		},

		union: (type, coll, acc, opts) => {
			gen.struct(<any>type, coll, acc, opts);
		},

		// nothing to emit directly
		funcptr: () => {},
	};
	return gen;
};

/** @internal */
const __stringImpl = (opts: CodeGenOpts) =>
	isStringSlice(opts.stringType) ? "WasmStringSlice" : "WasmStringPtr";

/** @internal */
const __shift = (type: string) => BIT_SHIFTS[<WasmPrim>type];

/** @internal */
const __addr = (offset: number) => (offset > 0 ? `(base + ${offset})` : "base");

/** @internal */
const __addrShift = (offset: number, shift: string) => {
	const bits = __shift(shift);
	return __addr(offset) + (bits ? " >>> " + bits : "");
};

/** @internal */
const __ptr = (target: WasmTarget, offset: number) =>
	`mem.${target.usize}[${__addrShift(offset, target.usize)}]`;

/** @internal */
const __ptrBody = (
	type: string,
	name: string,
	offset: number,
	body: string[]
) => [
	`return $${name} || ($${name} = new ${type}(mem, ${__addr(offset)},`,
	...body,
	`));`,
];

/** @internal */
const __mem = (type: string, offset: number) =>
	`mem.${type}[${__addrShift(offset!, type)}]`;

/** @internal */
const __mapStringArray = (
	target: WasmTarget,
	name: string,
	type: "WasmStringSlice" | "WasmStringPtr",
	len: NumOrString,
	isConst: boolean,
	isLocal = false
) => [
	isLocal ? `const $${name}: ${type}[] = [];` : `$${name} = [];`,
	`for(let i = 0; i < ${len}; i++) $${name}.push(__str(mem, addr + i * ${
		target.sizeBytes * (type === "WasmStringSlice" ? 2 : 1)
	}${isConst ? "" : ", false"}));`,
	`return $${name};`,
];

/** @internal */
const __primArray = (type: string, len: NumOrString, offset: number) => [
	`const addr = ${__addrShift(offset, type)};`,
	`return mem.${type}.subarray(addr, addr + ${len});`,
];

/** @internal */
const __arrayType = (type: string) =>
	isNumeric(type)
		? TYPEDARRAY_CTORS[<Type>type].name
		: BIGINT_ARRAY_CTORS[<BigType>type].name;

/** @internal */
const __docType = (
	f: Field,
	parent: Struct | Union,
	coll: TypeColl,
	opts: CodeGenOpts
) => {
	const doc = [...ensureLines(f.doc || [])];
	if (isPointer(f.tag) && f.len === 0) {
		const typeInfo = `Multi pointer: \`${
			zigFieldType(f, parent, coll, opts).type
		}\``;
		const remarks = "Only the pointer's target address can be accessed";
		if (doc.length) {
			doc.push("", "@remarks", typeInfo, remarks);
		} else {
			doc.push(typeInfo, "", "@remarks", remarks);
		}
	} else if (isWasmPrim(f.type)) {
		if (doc.length) doc.push("", "@remarks");
		doc.push(`Zig type: \`${zigFieldType(f, parent, coll, opts).type}\``);
	}
	return doc.length ? doc : undefined;
};

/** @internal */
const __generateField = (
	field: Field,
	coll: TypeColl,
	opts: CodeGenOpts
): Maybe<AugmentedField> => {
	if (field.skip) return;
	if (isFuncPointer(field.type, coll) || isOpaque(field.type)) {
		field = { ...field, type: opts.target.usize };
	}
	const { classifier, isConst } = classifyField(field, coll);
	const name = field.name;
	const offset = field.__offset!;
	const strType = __stringImpl(opts);
	const isPrim = isWasmPrim(field.type);
	const $isEnum = isEnum(field.type, coll);
	let type = field.type;
	let decl: Nullable<string>;
	let getter: Nullable<string[]>;
	let setter: Nullable<string[]>;
	let ptrType: string;
	let tag: string;
	switch (classifier) {
		case "str":
			type = strType;
			getter = [
				`return $${name} || ($${name} = __str(mem, ${__addr(offset)}${
					isConst ? "" : ", false"
				}));`,
			];
			break;
		case "strPtr":
			type = `Pointer<${strType}>`;
			decl = `let $${name}: ${type} | null = null;`;
			getter = __ptrBody(type, name, offset, [
				`(addr) => __str(mem, addr, ${isConst})`,
			]);
			break;
		case "strPtrFixed":
			type = `Pointer<${strType}[]>`;
			getter = __ptrBody(type, name, offset, [
				`(addr) => {`,
				...__mapStringArray(
					opts.target,
					"buf",
					strType,
					field.len!,
					isConst,
					true
				),
				"}",
			]);
			break;
		case "strArray":
			type = `${strType}[]`;
			getter = [
				`const addr = ${__addr(offset)};`,
				...__mapStringArray(
					opts.target,
					name,
					strType,
					field.len!,
					isConst,
					true
				),
			];
			break;
		case "strSlice":
			type = `${strType}[]`;
			getter = [
				`const addr = ${__ptr(opts.target, offset)};`,
				`const len = ${__ptr(
					opts.target,
					offset + opts.target.sizeBytes
				)};`,
				...__mapStringArray(
					opts.target,
					name,
					strType,
					"len",
					isConst,
					true
				),
			];
			break;
		case "ptr":
			if (isPrim) {
				ptrType = `Pointer<number>`;
				getter = __ptrBody(ptrType, name, offset, [
					`(addr) => mem.${type}[addr >>> ${__shift(type)}]`,
				]);
			} else {
				ptrType = `Pointer<${type}>`;
				getter = __ptrBody(ptrType, name, offset, [
					`(addr) => $${type}(mem).instance(addr)`,
				]);
			}
			type = ptrType;
			decl = `let $${name}: ${ptrType} | null = null;`;
			break;
		case "enumPtr":
			tag = (<Enum>coll[type]).tag;
			type = `Pointer<${type}>`;
			getter = __ptrBody(type, name, offset, [
				`(addr) => mem.${tag}[addr >>> ${__shift(tag)}]`,
			]);
			break;
		case "ptrFixed":
			if (isPrim) {
				ptrType = `Pointer<${__arrayType(type)}>`;
				getter = __ptrBody(ptrType, name, offset, [
					`(addr) => mem.${type}.subarray(addr, addr + ${field.len})`,
				]);
			} else {
				ptrType = `Pointer<${type}[]>`;
				getter = __ptrBody(ptrType, name, offset, [
					`(addr) => __array(mem, $${field.type}, addr, ${field.len})`,
				]);
			}
			type = ptrType;
			break;
		case "enumPtrFixed":
			tag = (<Enum>coll[type]).tag;
			type = `Pointer<${__arrayType(tag)}>`;
			getter = __ptrBody(type, name, offset, [
				`(addr) => mem.${tag}.subarray(addr, addr + ${field.len})`,
			]);
			break;
		case "array":
		case "vec":
			if (isPrim) {
				getter = [...__primArray(type, field.len!, offset)];
				type = __arrayType(type);
			} else {
				type += "[]";
				getter = [
					`return __array(mem, $${field.type}, ${__addr(offset)}, ${
						field.len
					});`,
				];
			}
			break;
		case "enumArray":
			tag = (<Enum>coll[type]).tag;
			type = __arrayType(tag);
			getter = [...__primArray(tag, field.len!, offset)];
			break;
		case "slice":
		case "enumSlice":
			if (isPrim) {
				getter = [
					`return __primslice${
						opts.target.bits
					}(mem, mem.${type}, ${__addr(offset)}, ${__shift(type)});`,
				];
				type = __arrayType(type);
			} else if ($isEnum) {
				tag = (<Enum>coll[type]).tag;
				getter = [
					`return __primslice${
						opts.target.bits
					}(mem, mem.${tag}, ${__addr(offset)}, ${__shift(tag)});`,
				];
				type = __arrayType(tag);
			} else {
				type += "[]";
				getter = [
					`return __slice${opts.target.bits}(mem, $${
						field.type
					}, ${__addr(offset)});`,
				];
			}
			break;
		case "single":
			if (isPrim) {
				getter = [`return ${__mem(type, offset)};`];
				setter = [`${__mem(type, offset)} = x;`];
				type = isNumeric(type) ? "number" : "bigint";
			} else {
				getter = [`return $${type}(mem).instance(${__addr(offset)});`];
				setter = [`mem.u8.set(x.__bytes, ${__addr(offset)});`];
			}
			break;
		case "enum": {
			getter = [`return ${__mem((<Enum>coll[type]).tag, offset)};`];
			setter = [`${__mem((<Enum>coll[type]).tag, offset)} = x;`];
			break;
		}
		case "ptrMulti":
		case "enumPtrMulti":
		case "strPtrMulti":
			// impossible to map memory of undefined length so only return
			// pointer's target addr (same as `opaquePtr`)
			type = "number";
			getter = [`return ${__ptr(opts.target, offset)};`];
			setter = [`${__ptr(opts.target, offset)} = x;`];
			break;
		case "pad":
			// skip codegen for padding fields and multi pointers since
			return;
		default:
			unsupported(`TODO: ${classifier} - please report as issue`);
	}
	return {
		field,
		type,
		decl,
		getter: field.getter !== false ? getter : undefined,
		setter: field.setter !== false ? setter : undefined,
	};
};
