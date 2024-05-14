import { _decorator, Animation, AnimationClip, SpriteFrame } from 'cc';
import State from './State';
import { StateMachine } from './StateMachine';

export abstract class SubStateMachine {
	private _currentState: State | SubStateMachine = null;

	constructor(
		public fsm: StateMachine,
		public baseURL: string = '',
		public wrapMode = AnimationClip.WrapMode.Normal,
	) {}

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
