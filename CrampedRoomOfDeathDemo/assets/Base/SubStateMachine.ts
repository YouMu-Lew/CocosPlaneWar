import { _decorator, Animation, SpriteFrame } from 'cc';
import State from './State';
import { StateMachine } from './StateMachine';

export abstract class SubStateMachine {
	private _currentState: State | SubStateMachine = null;

	constructor(public fsm: StateMachine) {}

	stateMachines: Map<string, State> = new Map();

	get currentState() {
		return this._currentState;
	}

	set currentState(newState: State | SubStateMachine) {
		this._currentState = newState;
		this._currentState.run();
	}

	abstract run(): void;
}
