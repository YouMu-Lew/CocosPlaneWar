import { _decorator, AnimationClip, Animation } from 'cc';
import { PARAMS_NAME_ENUM } from '../../Enums';
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import DirectionSubStateMachine from '../../Base/DirectionStateMachine';
const { ccclass, property } = _decorator;

const IDLE_URL = 'texture/player/idle';
const TURNLEFT_URL = 'texture/player/turnleft';
const TURNRIGHT_URL = 'texture/player/turnright';
const BLOCKBACK_URL = 'texture/player/blockback';
const BLOCKFRONT_URL = 'texture/player/blockfront';
const BLOCKLEFT_URL = 'texture/player/blockleft';
const BLOCKRIGHT_URL = 'texture/player/blockright';
const BLOCKTURNLEFT_URL = 'texture/player/blockturnleft';
const BLOCKTURNRIGHT_URL = 'texture/player/blockturnright';

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
		this.params.set(PARAMS_NAME_ENUM.TURNRIGHT, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.BLOCKBACK, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());
	}

	initStateMachines() {
		this.stateMachines.set(
			PARAMS_NAME_ENUM.IDLE,
			new DirectionSubStateMachine(this, IDLE_URL, AnimationClip.WrapMode.Loop),
		);
		this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new DirectionSubStateMachine(this, TURNLEFT_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT, new DirectionSubStateMachine(this, TURNRIGHT_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKBACK, new DirectionSubStateMachine(this, BLOCKBACK_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT, new DirectionSubStateMachine(this, BLOCKFRONT_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKLEFT, new DirectionSubStateMachine(this, BLOCKLEFT_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKRIGHT, new DirectionSubStateMachine(this, BLOCKRIGHT_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new DirectionSubStateMachine(this, BLOCKTURNLEFT_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, new DirectionSubStateMachine(this, BLOCKTURNRIGHT_URL));
	}

	initAnimationEvents() {
		this.animationComponent.on(Animation.EventType.FINISHED, () => {
			const name = this.animationComponent.defaultClip.name;
			//const whiteList = ['turn'];
			if (!name.includes('idle')) {
				this.setParams(PARAMS_NAME_ENUM.IDLE, true);
			}
		});
	}

	run() {
		/*
		switch (this.currentState) {
			case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
			case this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT):
			case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
				if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
					this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT);
				} else if (this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value) {
					this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT);
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
		*/

		if (this.currentState === this.stateMachines.get(PARAMS_NAME_ENUM.DIRECTION)) {
			this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
		} else {
			if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
				this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT);
			} else if (this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value) {
				this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT);
			} else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
				this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
			} else if (this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value) {
				this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK);
			} else if (this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value) {
				this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT);
			} else if (this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value) {
				this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT);
			} else if (this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value) {
				this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT);
			} else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value) {
				this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT);
			} else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value) {
				this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT);
			} else {
				// 确保 set 被触发
				this.currentState = this.currentState;
			}
		}
	}
}
