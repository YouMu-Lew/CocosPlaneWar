import { DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { SubStateMachine } from './SubStateMachine';

export default class DirectionSubStateMachine extends SubStateMachine {
	run() {
		const dir = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION).value;
		this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[dir as number]);
	}
}
