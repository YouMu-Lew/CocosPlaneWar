import { _decorator, error } from 'cc';
import { EntityManager } from './EntityManager';
import DataManager from '../Runtime/DataManager';
import { DIRECTION_ENUM, EVENT_TYPE } from '../Enums';
import EventManager from '../Runtime/EventManager';
import { IEntity } from '../Levels';

const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {
	async init(params: IEntity) {
		super.init(params);
		this.registerEvents();
		this.onChangeDirection(true);
	}

	registerEvents() {
		EventManager.Instance.on(EVENT_TYPE.PLAYER_BORN, this.onChangeDirection, this);
		EventManager.Instance.on(EVENT_TYPE.PLAYER_MOVE_END, this.onChangeDirection, this);
		EventManager.Instance.on(EVENT_TYPE.PLAYER_MOVE_END, this.onAttack, this);
		EventManager.Instance.on(EVENT_TYPE.PLAYER_ATTACK, this.onBeHit, this);
	}

	unregisterEvents() {
		EventManager.Instance.off(EVENT_TYPE.PLAYER_BORN, this.onChangeDirection);
		EventManager.Instance.off(EVENT_TYPE.PLAYER_MOVE_END, this.onChangeDirection);
		EventManager.Instance.off(EVENT_TYPE.PLAYER_MOVE_END, this.onAttack);
		EventManager.Instance.off(EVENT_TYPE.PLAYER_ATTACK, this.onBeHit);
	}

	// 参数 isInit 确保在第一次加载时，执行改变朝向算法
	onChangeDirection(isInit: boolean = false) {
		if (!DataManager.Instance.player || this.isDead) return;
		const { x: playerX, y: playerY } = DataManager.Instance.player;

		const disX = playerX - this.x;
		// 锚点为 (0,1) 所以 disY 需要取负值
		const disY = this.y - playerY;

		const absDisX = Math.abs(disX);
		const absDisY = Math.abs(disY);

		// 位于对角线时，不改变朝向
		if (absDisX === absDisY && !isInit) return;
		let targetDirection: DIRECTION_ENUM = this.direction;

		if (disX >= 0 && disY >= 0) {
			// 第一象限
			targetDirection = absDisX > absDisY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.TOP;
		} else if (disX >= 0 && disY <= 0) {
			// 第四象限
			targetDirection = absDisX > absDisY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM;
		} else if (disX <= 0 && disY >= 0) {
			// 第二象限
			targetDirection = absDisX > absDisY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.TOP;
		} else if (disX <= 0 && disY <= 0) {
			// 第三象限
			targetDirection = absDisX > absDisY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM;
		}
		// 只在朝向需要变化时设置，避免出现动画一直重置
		if (targetDirection != this.direction) {
			this.direction = targetDirection;
		}
	}

	onAttack(...params) {}

	onBeHit(id: string) {
		if (this.isDead) return;
		if (this.id !== id) return;
		this.death();
	}
}
