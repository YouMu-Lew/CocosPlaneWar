import Singleton from '../Base/SingleTon';

/**
 * 新加上下文参数 ctx 以确保函数的正确调用
 * ps：具体原因不知，up主说是 js “神奇”的函数调用可能会导致的 bug
 */
interface IItem {
	func: Function;
	ctx: unknown;
}

export default class EventManager extends Singleton {
	static get Instance() {
		return super.getInstance<EventManager>();
	}

	private eventDic: Map<string, Array<IItem>> = new Map();

	on(eventName: string, func: Function, ctx?: unknown) {
		if (this.eventDic.has(eventName)) {
			this.eventDic.get(eventName).push({ func, ctx });
		} else {
			this.eventDic.set(eventName, [{ func, ctx }]);
		}
	}

	off(eventName: string, func: Function) {
		if (this.eventDic.has(eventName)) {
			const index = this.eventDic.get(eventName).findIndex(v => v.func === func);
			index > -1 && this.eventDic.get(eventName).splice(index, 1);
		}
	}

	emit(eventName: string, ...params: unknown[]) {
		if (this.eventDic.has(eventName)) {
			this.eventDic.get(eventName).forEach(({ func, ctx }) => {
				ctx ? func.apply(ctx, params) : func(...params);
			});
		}
	}

	clear() {
		this.eventDic.clear();
	}
}
