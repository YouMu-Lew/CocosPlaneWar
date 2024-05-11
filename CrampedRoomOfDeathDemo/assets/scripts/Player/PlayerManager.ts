import { _decorator, Sprite, UITransform } from 'cc';
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
import { EntityManager } from '../../Base/EntityManager';
import { StateMachine } from '../../Base/StateMachine';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
	targetX: number = 0;
	targetY: number = 0;

	// fsm: PlayerStateMachine;

	private readonly speed: number = 0.1;

	async init() {
		this.fsm = this.addComponent(PlayerStateMachine);
		super.fsm.init();
		await this.fsm.init();
		this.state = ENTITY_STATE_ENUM.IDLE;

		this.registerEvents();
		this.state;
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
