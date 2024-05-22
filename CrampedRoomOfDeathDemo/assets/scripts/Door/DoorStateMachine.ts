import { _decorator, Animation } from 'cc';
import { DIRECTION_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { StateMachine, getInitParamsTrigger } from '../../Base/StateMachine';
import State from '../../Base/State';
import { EntityManager } from '../../Base/EntityManager';
const { ccclass, property } = _decorator;

const IDLE_URL = 'texture/door/idle';
const DEATH_URL = 'texture/door/death';

@ccclass('DoorStateMachine')
export class DoorStateMachine extends StateMachine {
	async init() {
		this.animationComponent = this.addComponent(Animation);

		this.initParams();
		this.initStateMachines();

		// 使用 Promise 封装，确保所有资源加载完成之后才推出 init 方法
		await Promise.all(this.waitingList);
	}

	initParams() {
		this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger());
	}

	initStateMachines() {
		this.stateMachines.set(DIRECTION_ENUM.TOP, new State(this, `${IDLE_URL}/top`));
		this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(this, `${IDLE_URL}/top`));
		this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(this, `${IDLE_URL}/left`));
		this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(this, `${IDLE_URL}/left`));
		this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new State(this, DEATH_URL));
	}

	run() {
		if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
			this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH);
		} else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
			this.currentState = this.stateMachines.get(this.getComponent(EntityManager).direction);
		} else this.currentState = this.currentState;
	}
}
