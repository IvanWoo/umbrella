import { selectDefinedKeysObj } from "@thi.ng/object-utils";

export const normalizePackage = (pkg: any) => {
	pkg.type = "module";
	!pkg.engines && (pkg.engines = { node: ">=18" });
	delete pkg.main;
	delete pkg["umd:main"];

	cleanupFiles(pkg);

	return selectDefinedKeysObj(pkg, [
		"name",
		"version",
		"description",
		"type",
		"module",
		"typings",
		"bin",
		"sideEffects",
		"repository",
		"homepage",
		"funding",
		"author",
		"contributors",
		"license",
		"scripts",
		"dependencies",
		"devDependencies",
		"peerDependencies",
		"peerDependenciesMeta",
		"keywords",
		"publishConfig",
		"browser",
		"engines",
		"files",
		"exports",
		"thi.ng",
	]);
};

const cleanupFiles = (pkg: any) => {
	pkg.files = (<string[]>pkg.files).filter((x) => !["lib"].includes(x));
};
