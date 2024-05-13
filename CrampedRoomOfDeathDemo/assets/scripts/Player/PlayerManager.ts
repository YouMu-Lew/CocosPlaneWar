import { _decorator } from 'cc';
import { CONTROLLER_EVENT, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_TYPE } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import DataManager from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
	targetX: number = 0;
	targetY: number = 0;

	// fsm: PlayerStateMachine;

	private readonly speed: number = 0.1;

	async init() {
		this.fsm = this.addComponent(PlayerStateMachine);
		await this.fsm.init();
		super.init({
			x: 0,
			y: 0,
			type: ENTITY_TYPE_ENUM.PLAYER,
			state: ENTITY_STATE_ENUM.IDLE,
			direction: DIRECTION_ENUM.TOP,
		});

		this.registerEvents();
	}

	registerEvents() {
		EventManager.Instance.on(EVENT_TYPE.PLAYER_CONTROL, this.move, this);
	}

	update(): void {
		this.updateXY();
		super.update();
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
		console.log(DataManager.Instance.tileInfo);
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
