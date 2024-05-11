import { _decorator, AnimationClip, Component, Node, Animation, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE, STATE_TYPE } from '../../Enums';
import State from '../../Base/State';
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

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends Component {
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
		}
	}

	get currentState() {
		return this._currentState;
	}

	set currentState(newState: State) {
		this._currentState = newState;
		this._currentState.run();
	}

	async init() {
		this.animationComponent = this.addComponent(Animation);

		this.initParams();
		this.initStateMachines();

		// 使用 Promise 封装，确保所有资源加载完成之后才推出 init 方法
		await Promise.all(this.waitingList);
	}

	initParams() {
		this.params.set(STATE_TYPE.IDLE, getInitParamsTrigger());
		this.params.set(STATE_TYPE.TURNLEFT, getInitParamsTrigger());
	}

	initStateMachines() {
		this.stateMachines.set(
			STATE_TYPE.IDLE,
			new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop),
		);
		this.stateMachines.set(STATE_TYPE.TURNLEFT, new State(this, 'texture/player/turnleft/left'));
	}

	run() {
		switch (this.currentState) {
			case this.stateMachines.get(STATE_TYPE.TURNLEFT):
			case this.stateMachines.get(STATE_TYPE.IDLE):
				if (this.params.get(STATE_TYPE.TURNLEFT).value) {
					this.currentState = this.stateMachines.get(STATE_TYPE.TURNLEFT);
				} else if (this.params.get(STATE_TYPE.IDLE).value) {
					this.currentState = this.stateMachines.get(STATE_TYPE.IDLE);
				}
			default:
				this.currentState = this.stateMachines.get(STATE_TYPE.IDLE);
		}
	}
}
