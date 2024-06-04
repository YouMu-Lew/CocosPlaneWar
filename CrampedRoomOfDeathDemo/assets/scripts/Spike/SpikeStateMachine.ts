import { getInitParamsNumber, StateMachine } from '../../Base/StateMachine';
import { _decorator, Animation, error } from 'cc';
import { ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { SpikeManager } from './SpikeManager';
import SpikeSubStateMachine from './SpikeSubStateMachine';

const { ccclass, property } = _decorator;

const SpikeOneURL = 'texture/spikes/spikesone';
const SpikeTwoURL = 'texture/spikes/spikestwo';
const SpikeThreeURL = 'texture/spikes/spikesthree';
const SpikeFourURL = 'texture/spikes/spikesfour';

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
		this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKE_ONE, new SpikeSubStateMachine(this, SpikeOneURL));
		this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKE_TWO, new SpikeSubStateMachine(this, SpikeTwoURL));
		this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKE_THREE, new SpikeSubStateMachine(this, SpikeThreeURL));
		this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKE_FOUR, new SpikeSubStateMachine(this, SpikeFourURL));
	}

	initAnimationEvents() {
		this.animationComponent.on(Animation.EventType.FINISHED, () => {
			if (
				this.params.get(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT).value ===
				this.params.get(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT).value
			) {
				// this.getComponent(SpikeManager).count = 0;
				this.getComponent(SpikeManager).countBackZero();
			}
		});
	}

	run() {
		let targetState = this.currentState;
		switch (this.params.get(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT).value) {
			case 2:
				targetState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_ONE);
				break;
			case 3:
				targetState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_TWO);
				break;
			case 4:
				targetState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_THREE);
				break;
			case 5:
				targetState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_FOUR);
				break;
			default:
				// 报错，未配置的 State
				error('SpikeStateMachine: 未配置的 State');
				break;
		}
		this.currentState = targetState;
	}
}
