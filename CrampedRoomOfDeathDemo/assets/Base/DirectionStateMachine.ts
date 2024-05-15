import { AnimationClip } from 'cc';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { PlayerStateMachine } from '../scripts/Player/PlayerStateMachine';
import State from './State';
import { SubStateMachine } from './SubStateMachine';

export default class DirectionSubStateMachine extends SubStateMachine {
	constructor(
		fsm: PlayerStateMachine,
		url: string,
		wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
	) {
		super(fsm, url, wrapMode);
		this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${this.baseURL}/top`, this.wrapMode));
		this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${this.baseURL}/left`, this.wrapMode));
		this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${this.baseURL}/bottom`, this.wrapMode));
		this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${this.baseURL}/right`, this.wrapMode));
	}

	run() {
		// 获取当前方向并切换至相应状态
		const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION).value;
		this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number]);
	}
}
