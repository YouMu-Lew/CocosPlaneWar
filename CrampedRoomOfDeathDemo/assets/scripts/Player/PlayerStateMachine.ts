import { _decorator, AnimationClip, Animation } from 'cc';
import { STATE_TYPE } from '../../Enums';
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import TrunLeftSubStateMachine from './TurnLeftSubStateMachine';
import IdleSubStateMachine from './TurnLeftSubStateMachine copy';
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
		this.params.set(STATE_TYPE.IDLE, getInitParamsTrigger());
		this.params.set(STATE_TYPE.TURNLEFT, getInitParamsTrigger());
		this.params.set(STATE_TYPE.DIRECTION, getInitParamsNumber());
	}

	initStateMachines() {
		this.stateMachines.set(STATE_TYPE.IDLE, new IdleSubStateMachine(this));
		this.stateMachines.set(STATE_TYPE.TURNLEFT, new TrunLeftSubStateMachine(this));
	}

	initAnimationEvents() {
		this.animationComponent.on(Animation.EventType.FINISHED, () => {
			const name = this.animationComponent.defaultClip.name;
			const whiteList = ['turn'];
			if (!name.includes('idle')) {
				this.setParams(STATE_TYPE.IDLE, true);
			}
		});
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
				else{
					this.currentState = this.currentState;
				}
				break;
			default:
				this.currentState = this.stateMachines.get(STATE_TYPE.IDLE);
		}
	}
}
