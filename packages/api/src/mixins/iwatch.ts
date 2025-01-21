// SPDX-License-Identifier: Apache-2.0
import { mixin } from "../mixin.js";
import type { IObjectOf } from "../object.js";
import type { IWatch, Watch } from "../watch.js";

interface _IWatch extends IWatch<any> {
	_watches: IObjectOf<Watch<any>>;
}

export const IWatchMixin = mixin(<IWatch<any>>{
	addWatch(this: _IWatch, id: string, fn: Watch<any>) {
		this._watches = this._watches || {};
		if (this._watches[id]) {
			return false;
		}
		this._watches[id] = fn;
		return true;
	},

	removeWatch(this: _IWatch, id: string) {
		if (!this._watches) return;
		if (this._watches[id]) {
			delete this._watches[id];
			return true;
		}
		return false;
	},

	notifyWatches(this: _IWatch, oldState: any, newState: any) {
		if (!this._watches) return;
		const w = this._watches;
		for (let id in w) {
			w[id](id, oldState, newState);
		}
	},
});
