import { _decorator, AnimationClip, Animation } from 'cc';
import { STATE_TYPE } from '../../Enums';
import State from '../../Base/State';
import { StateMachine, getInitParamsTrigger } from '../../Base/StateMachine';
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
	}

	initStateMachines() {
		this.stateMachines.set(
			STATE_TYPE.IDLE,
			new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop),
		);
		this.stateMachines.set(STATE_TYPE.TURNLEFT, new State(this, 'texture/player/turnleft/left'));
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
				break;
			default:
				this.currentState = this.stateMachines.get(STATE_TYPE.IDLE);
		}
	}
}
