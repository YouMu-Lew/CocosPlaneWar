import { _decorator, AnimationClip, Animation } from 'cc';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../../Enums';
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from '../../../Base/StateMachine';
import DirectionSubStateMachine from '../../../Base/DirectionStateMachine';
import { EntityManager } from '../../../Base/EntityManager';
const { ccclass, property } = _decorator;

const IDLE_URL = 'texture/woodenskeleton/idle';
const ATTACK_URL = 'texture/woodenskeleton/attack';
const DEATH_URL = 'texture/woodenskeleton/death';

@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {
	async init() {
		this.animationComponent = this.addComponent(Animation);

		this.initParams();
		this.initStateMachines();
		this.initAnimationEvents();

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
		this.stateMachines.set(
			PARAMS_NAME_ENUM.IDLE,
			new DirectionSubStateMachine(this, IDLE_URL, AnimationClip.WrapMode.Loop),
		);
		this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new DirectionSubStateMachine(this, ATTACK_URL));
		this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DirectionSubStateMachine(this, DEATH_URL));
	}

	initAnimationEvents() {
		this.animationComponent.on(Animation.EventType.FINISHED, () => {
			const name = this.animationComponent.defaultClip.name;
			if (!name.includes('idle') && !name.includes('death')) {
				this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE;
			}
		});
	}
}
