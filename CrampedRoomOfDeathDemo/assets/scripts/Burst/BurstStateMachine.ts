import { _decorator, Animation } from 'cc';
import State from '../../Base/State';
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import { PARAMS_NAME_ENUM } from '../../Enums';

const { ccclass, property } = _decorator;

const IDLE_URL = 'texture/burst/idle/idle';
const ATTACK_URL = 'texture/burst/attack';
const DEATH_URL = 'texture/burst/death';

@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {
	async init() {
		this.animationComponent = this.addComponent(Animation);

		this.initParams();
		this.initStateMachines();

		// 使用 Promise 封装，确保所有资源加载完成之后才推出 init 方法
		await Promise.all(this.waitingList);
	}

	initParams() {
		this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());
		this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger());
	}

	initStateMachines() {
		this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, IDLE_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new State(this, ATTACK_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new State(this, DEATH_URL));
	}
}
