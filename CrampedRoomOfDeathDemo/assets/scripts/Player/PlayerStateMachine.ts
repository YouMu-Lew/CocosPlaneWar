import { _decorator, AnimationClip, Animation } from 'cc';
import { PARAMS_NAME_ENUM } from '../../Enums';
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import TrunLeftSubStateMachine from './TurnLeftSubStateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
const { ccclass, property } = _decorator;

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
	async init() {
		this.animationComponent = this.addComponent(Animation);

		this.initParams();
		this.initStateMachines();
		this.initAnimationEvents();

		// 使用 Promise 封装，确保所有资源加载完成之后才推出 init 方法
		await Promise.all(this.waitingList);
	}

	initParams() {
		this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());
	}

	initStateMachines() {
		this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this));
		this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TrunLeftSubStateMachine(this));
	}

	initAnimationEvents() {
		this.animationComponent.on(Animation.EventType.FINISHED, () => {
			const name = this.animationComponent.defaultClip.name;
			const whiteList = ['turn'];
			if (!name.includes('idle')) {
				this.setParams(PARAMS_NAME_ENUM.IDLE, true);
			}
		});
	}

	run() {
		switch (this.currentState) {
			case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
			case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
				if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
					this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT);
				} else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
					this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
				} else {
					// 确保 set 被触发
					this.currentState = this.currentState;
				}
				break;
			default:
				this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
		}
	}
}
