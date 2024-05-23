import { _decorator, AnimationClip, Animation } from 'cc';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import DirectionSubStateMachine from '../../Base/DirectionStateMachine';
import { EntityManager } from '../../Base/EntityManager';
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
const ATTACK_URL = 'texture/player/attack';
const DEATH_URL = 'texture/player/death';
const AIRDEATH_URL = 'texture/player/airdeath';

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
		this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger());
		this.params.set(PARAMS_NAME_ENUM.AIRDEATH, getInitParamsTrigger());

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
		this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new DirectionSubStateMachine(this, ATTACK_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DirectionSubStateMachine(this, DEATH_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH, new DirectionSubStateMachine(this, AIRDEATH_URL));
	}

	initAnimationEvents() {
		this.animationComponent.on(Animation.EventType.FINISHED, () => {
			const name = this.animationComponent.defaultClip.name;
			//const whiteList = ['turn'];
			if (!name.includes('idle') && !name.includes('death')) {
				this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE;
			}
		});
	}
}
