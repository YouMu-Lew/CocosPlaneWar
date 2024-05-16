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
	private isMoving: boolean = false;

	async init() {
		this.fsm = this.addComponent(PlayerStateMachine);
		await this.fsm.init();
		super.init({
			x: 2,
			y: 8,
			type: ENTITY_TYPE_ENUM.PLAYER,
			state: ENTITY_STATE_ENUM.IDLE,
			direction: DIRECTION_ENUM.TOP,
		});

		this.targetX = this.x;
		this.targetY = this.y;

		this.registerEvents();
	}

	registerEvents() {
		EventManager.Instance.on(EVENT_TYPE.PLAYER_CONTROL, this.inputHandle, this);
	}

	update(): void {
		if (!this.isMoving && (this.x != this.targetX || this.y != this.targetY)) this.isMoving = true;
		if (this.isMoving) {
			this.updateXY();
		}
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
		if (this.x === this.targetX && this.y === this.targetY) {
			this.isMoving = false;
			EventManager.Instance.emit(EVENT_TYPE.PLAYER_MOVE_END);
		}
	}

	inputHandle(inputDirection: CONTROLLER_EVENT) {
		if (this.canMove(inputDirection)) {
			this.move(inputDirection);
			return;
		} else {
			// be blocked
			switch (inputDirection) {
				case CONTROLLER_EVENT.TOP:
					this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
					break;
				case CONTROLLER_EVENT.BOTTOM:
					this.state = ENTITY_STATE_ENUM.BLOCKBACK;
					break;
				case CONTROLLER_EVENT.LEFT:
					this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
					break;
				case CONTROLLER_EVENT.RIGHT:
					this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
					break;
				case CONTROLLER_EVENT.TURNLEFT:
					this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
					break;
				case CONTROLLER_EVENT.TURNRIGHT:
					this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
					break;
			}
		}
	}

	canMove(inputDirection: CONTROLLER_EVENT): boolean {
		const tileInfo = DataManager.Instance.tileInfo;
		// 用 targetXY 确定 xy 防止在移动过程中 xy 为小数
		const { targetX: x, targetY: y, direction } = this;
		let weaponX: number, weaponY: number;

		// 确定武器所在位置
		switch (direction) {
			case DIRECTION_ENUM.TOP:
				// 人物朝向向上
				weaponX = x;
				weaponY = y - 1;
				break;
			case DIRECTION_ENUM.BOTTOM:
				// 人物朝向向下
				weaponX = x;
				weaponY = y + 1;
				break;
			case DIRECTION_ENUM.LEFT:
				// 人物朝向向左
				weaponX = x - 1;
				weaponY = y;
				break;
			case DIRECTION_ENUM.RIGHT:
				// 人物朝向向右
				weaponX = x + 1;
				weaponY = y;
				break;
		}

		if (inputDirection === CONTROLLER_EVENT.TURNLEFT || inputDirection === CONTROLLER_EVENT.TURNRIGHT) {
			// 转向
			let checkList = [
				[x, y],
				[weaponX, weaponY],
			];
			if (inputDirection === CONTROLLER_EVENT.TURNLEFT) {
				// 左转
				switch (direction) {
					case DIRECTION_ENUM.TOP:
						checkList[0][0]--;
						checkList[1][0]--;
						break;
					case DIRECTION_ENUM.BOTTOM:
						checkList[0][0]++;
						checkList[1][0]++;
						break;
					case DIRECTION_ENUM.LEFT:
						checkList[0][1]++;
						checkList[1][1]++;
						break;
					case DIRECTION_ENUM.RIGHT:
						checkList[0][1]--;
						checkList[1][1]--;
						break;
				}
			} else {
				// 右转
				switch (direction) {
					case DIRECTION_ENUM.TOP:
						checkList[0][0]++;
						checkList[1][0]++;
						break;
					case DIRECTION_ENUM.BOTTOM:
						checkList[0][0]--;
						checkList[1][0]--;
						break;
					case DIRECTION_ENUM.LEFT:
						checkList[0][1]--;
						checkList[1][1]--;
						break;
					case DIRECTION_ENUM.RIGHT:
						checkList[0][1]++;
						checkList[1][1]++;
						break;
				}
			}
			return (
				tileInfo[checkList[0][0]][checkList[0][1]].turnable &&
				tileInfo[checkList[1][0]][checkList[1][1]].turnable
			);
		} else {
			// 移动
			let checkMovePos = [x, y];
			let checkTurnPos = [weaponX, weaponY];
			if (inputDirection === CONTROLLER_EVENT.TOP) {
				checkMovePos[1]--;
				checkTurnPos[1]--;
			} else if (inputDirection === CONTROLLER_EVENT.BOTTOM) {
				checkMovePos[1]++;
				checkTurnPos[1]++;
			} else if (inputDirection === CONTROLLER_EVENT.LEFT) {
				checkMovePos[0]--;
				checkTurnPos[0]--;
			} else if (inputDirection === CONTROLLER_EVENT.RIGHT) {
				checkMovePos[0]++;
				checkTurnPos[0]++;
			}
			return (
				tileInfo[checkMovePos[0]][checkMovePos[1]].moveable &&
				tileInfo[checkTurnPos[0]][checkTurnPos[1]].turnable
			);
		}

		return false;
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
			case CONTROLLER_EVENT.TURNRIGHT:
				switch (this.direction) {
					case DIRECTION_ENUM.TOP:
						this.direction = DIRECTION_ENUM.RIGHT;
						break;
					case DIRECTION_ENUM.RIGHT:
						this.direction = DIRECTION_ENUM.BOTTOM;
						break;
					case DIRECTION_ENUM.BOTTOM:
						this.direction = DIRECTION_ENUM.LEFT;
						break;
					case DIRECTION_ENUM.LEFT:
						this.direction = DIRECTION_ENUM.TOP;
						break;
				}
				this.state = ENTITY_STATE_ENUM.TURNRIGHT;
				break;
		}
	}
}
