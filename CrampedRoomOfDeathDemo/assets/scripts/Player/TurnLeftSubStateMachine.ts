import State from '../../Base/State';
import { SubStateMachine } from '../../Base/SubStateMachine';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { PlayerStateMachine } from './PlayerStateMachine';

const BASE_URL = 'texture/player/turnleft/';

export default class TrunLeftSubStateMachine extends SubStateMachine {
	constructor(fsm: PlayerStateMachine) {
		super(fsm);
		this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}top`));
		this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}left`));
		this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}bottom`));
		this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}right`));
	}

	run() {
		const dir = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION).value;
		this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[dir as number]);
	}
}
