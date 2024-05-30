import { AnimationClip } from 'cc';
import State from '../../Base/State';
import { StateMachine } from '../../Base/StateMachine';
import { SubStateMachine } from '../../Base/SubStateMachine';
import { PARAMS_NAME_ENUM, SPIKES_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from '../../Enums';

export default class SpikeOneSubStateMachine extends SubStateMachine {
	constructor(fsm: StateMachine, url: string, wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal) {
		super(fsm, url, wrapMode);
		this.stateMachines.set(SPIKES_COUNT_ENUM.ZERO, new State(fsm, `${this.baseURL}/zero`, this.wrapMode));
		this.stateMachines.set(SPIKES_COUNT_ENUM.ONE, new State(fsm, `${this.baseURL}/one`, this.wrapMode));
		this.stateMachines.set(SPIKES_COUNT_ENUM.TWO, new State(fsm, `${this.baseURL}/two`, this.wrapMode));
	}

	run() {
		// 获取当前方向并切换至相应状态
		const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT).value;
		this.currentState = this.stateMachines.get(SPIKES_COUNT_MAP_NUMBER_ENUM[value as number]);
	}
}
