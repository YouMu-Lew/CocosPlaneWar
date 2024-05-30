import { getInitParamsNumber, StateMachine } from '../../Base/StateMachine';
import { _decorator, Animation } from 'cc';
import { ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKES_COUNT_ENUM } from '../../Enums';
import SpikeOneSubStateMachine from './SpikeOneSubStateMachine';
import { SpikeManager } from './SpikeManager';

const { ccclass, property } = _decorator;

const SpikeOneURL = 'texture/spikes/spikesone';

@ccclass('SpikeStateMachine')
export class SpikeStateMachine extends StateMachine {
	async init() {
		this.animationComponent = this.addComponent(Animation);

		this.initParams();
		this.initStateMachines();
		this.initAnimationEvents();

		// 使用 Promise 封装，确保所有资源加载完成之后才推出 init 方法
		await Promise.all(this.waitingList);
	}

	initParams() {
		this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber());
		this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber());
	}

	initStateMachines() {
		this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKE_ONE, new SpikeOneSubStateMachine(this, SpikeOneURL));
	}

	initAnimationEvents() {
		this.animationComponent.on(Animation.EventType.FINISHED, () => {
			if (
				this.params.get(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT) ===
				this.params.get(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
			) {
				this.getComponent(SpikeManager).count = 0;
			}
		});
	}

	run() {
		switch (this.currentState) {
			case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_ONE):
				this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_ONE);
				break;
			default:
				this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_ONE);
				break;
		}
	}
}
