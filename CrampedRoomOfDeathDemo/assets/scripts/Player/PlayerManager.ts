import { _decorator, Component, Sprite, UITransform } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import {
	CONTROLLER_EVENT,
	DIRECTION_ENUM,
	DIRECTION_ORDER_ENUM,
	ENTITY_STATE_ENUM,
	EVENT_TYPE,
	PARAMS_NAME_ENUM,
} from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
	x: number = 0;
	y: number = 0;
	targetX: number = 0;
	targetY: number = 0;
	private fsm: PlayerStateMachine;

	private speed: number = 0.1;

	private _state: ENTITY_STATE_ENUM = ENTITY_STATE_ENUM.IDLE;
	private _direction: DIRECTION_ENUM = DIRECTION_ENUM.TOP;

	get state() {
		return this._state;
	}

	set state(newState: ENTITY_STATE_ENUM) {
		this._state = newState;
		this.fsm.setParams(newState, true);
	}

	get direction() {
		return this._direction;
	}

	set direction(newDirection: DIRECTION_ENUM) {
		this._direction = newDirection;
		this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[newDirection]);
	}

	async init() {
		const sprite = this.addComponent(Sprite);
		sprite.sizeMode = Sprite.SizeMode.CUSTOM;

		this.getComponent(UITransform).setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

		this.fsm = this.addComponent(PlayerStateMachine);
		await this.fsm.init();
		this.state = ENTITY_STATE_ENUM.IDLE;

		this.registerEvents();
	}

	registerEvents() {
		EventManager.Instance.on(EVENT_TYPE.PLAYER_CONTROL, this.move, this);
	}

	protected update(dt: number): void {
		this.updatePos();
	}

	updatePos() {
		this.updateXY();
		this.node.setPosition((this.x - 1.5) * TILE_WIDTH, -(this.y - 1.5) * TILE_HEIGHT);
	}

	updateXY() {
		if (Math.abs(this.x - this.targetX) <= this.speed) this.x = this.targetX;
		else {
			if (this.x > this.targetX) this.x -= this.speed;
			if (this.x < this.targetX) this.x += this.speed;
		}
		if (Math.abs(this.y - this.targetY) <= this.speed) this.y = this.targetY;
		else {
			if (this.y > this.targetY) this.y -= this.speed;
			if (this.y < this.targetY) this.y += this.speed;
		}
	}

	move(inputDirection: CONTROLLER_EVENT) {
		switch (inputDirection) {
			case CONTROLLER_EVENT.TOP:
				this.targetY--;
				break;
			case CONTROLLER_EVENT.BOTTOM:
				this.targetY++;
				break;
			case CONTROLLER_EVENT.LEFT:
				this.targetX--;
				break;
			case CONTROLLER_EVENT.RIGHT:
				this.targetX++;
				break;
			case CONTROLLER_EVENT.TURNLEFT:
				switch (this.direction) {
					case DIRECTION_ENUM.TOP:
						this.direction = DIRECTION_ENUM.LEFT;
						break;
					case DIRECTION_ENUM.LEFT:
						this.direction = DIRECTION_ENUM.BOTTOM;
						break;
					case DIRECTION_ENUM.BOTTOM:
						this.direction = DIRECTION_ENUM.RIGHT;
						break;
					case DIRECTION_ENUM.RIGHT:
						this.direction = DIRECTION_ENUM.TOP;
						break;
				}
				this.state = ENTITY_STATE_ENUM.TURNLEFT;
				break;
		}
	}
}
