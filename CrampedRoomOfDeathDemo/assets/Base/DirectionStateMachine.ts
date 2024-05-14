import { DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { SubStateMachine } from './SubStateMachine';

export default class DirectionSubStateMachine extends SubStateMachine {
	run() {
		// 获取当前方向并切换至相应状态
		const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION).value;
		this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number]);
	}
}
