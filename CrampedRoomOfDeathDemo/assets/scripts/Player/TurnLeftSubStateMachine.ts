import DirectionSubStateMachine from '../../Base/DirectionStateMachine';
import State from '../../Base/State';
import { DIRECTION_ENUM } from '../../Enums';
import { PlayerStateMachine } from './PlayerStateMachine';

const BASE_URL = 'texture/player/turnleft';

export default class TrunLeftSubStateMachine extends DirectionSubStateMachine {
	constructor(fsm: PlayerStateMachine) {
		super(fsm);
		this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`));
		this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`));
		this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`));
		this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`));
	}
}
