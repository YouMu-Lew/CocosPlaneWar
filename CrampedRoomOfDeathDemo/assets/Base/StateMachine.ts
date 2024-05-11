import { _decorator, Component, Animation, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE } from '../Enums';
import State from './State';
const { ccclass, property } = _decorator;

type ParamsValueType = boolean | number;

interface IParamsValue {
	type: FSM_PARAMS_TYPE;
	value: ParamsValueType;
}

export const getInitParamsTrigger = () => {
	return {
		type: FSM_PARAMS_TYPE.TRIGGER,
		value: false,
	};
};

export const getInitParamsNumber = () => {
	return {
		type: FSM_PARAMS_TYPE.NUMBER,
		value: 0,
	};
};

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
	private _currentState: State = null;

	params: Map<string, IParamsValue> = new Map();
	stateMachines: Map<string, State> = new Map();

	animationComponent: Animation;

	waitingList: Array<Promise<SpriteFrame[]>> = [];

	getParams(paramsName: string) {
		if (this.params.has(paramsName)) {
			return this.params.get(paramsName);
		}
	}

	setParams(paramsName: string, value: ParamsValueType) {
		if (this.params.has(paramsName)) {
			this.params.get(paramsName).value = value;
			this.run();
			this.resetTriggers();
		}
	}

	get currentState() {
		return this._currentState;
	}

	set currentState(newState: State) {
		this._currentState = newState;
		this._currentState.run();
	}

	resetTriggers() {
		for (const [, v] of this.params) {
			if (v.type === FSM_PARAMS_TYPE.TRIGGER) {
				v.value = false;
			}
		}
	}

	abstract init(): void;
	abstract run(): void;
}
