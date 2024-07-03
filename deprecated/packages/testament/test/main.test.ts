import { NULL_LOGGER } from "@thi.ng/logger";
import { group, test, type TestResult } from "@thi.ng/testament";
import * as assert from "assert";

let retryResult = 0;

group(
	"testament",
	{
		async: ({ done, setTimeout, clearTimeout }) => {
			let val = true;
			const id = setTimeout(() => (val = false), 10);
			setTimeout(() => {
				assert.ok(val);
				done();
			}, 20);
			clearTimeout(id);
		},

		timeout: ({ done, setTimeout }) => {
			let res: TestResult;
			test("fail", ({}) => {}, {
				timeOut: 5,
				logger: NULL_LOGGER,
			})().then((x) => (res = x));
			setTimeout(() => {
				assert.strictEqual(res.title, "fail");
				assert.ok(!!res.error);
				assert.strictEqual(res.error.message, "timeout");
				done();
			}, 10);
		},

		retry: () => {
			retryResult++;
			assert.strictEqual(retryResult, 3);
		},
	},
	{
		timeOut: 30,
		maxTrials: 3,
	}
);

let state = 0;

group(
	"testament lifecycle",
	{
		basic: ({ logger, done }) => {
			assert.ok(logger);
			assert.strictEqual(state, 110);
			state++;
			done();
		},
	},
	{
		before: ({ logger }) => {
			assert.ok(logger);
			state = 100;
		},
		beforeEach: ({ logger }) => {
			assert.ok(logger);
			state += 10;
		},
		afterEach: ({ logger }) => {
			assert.ok(logger);
			assert.strictEqual(state, 111);
		},
		after: ({ logger }) => {
			assert.ok(logger);
			state += 1000;
			assert.strictEqual(state, 1111);
		},
	}
);
