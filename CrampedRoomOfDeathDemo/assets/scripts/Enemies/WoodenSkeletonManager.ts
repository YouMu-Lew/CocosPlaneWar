import { _decorator } from 'cc';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_TYPE } from '../../Enums';
import { EntityManager } from '../../Base/EntityManager';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';
const { ccclass, property } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
	async init() {
		this.fsm = this.addComponent(WoodenSkeletonStateMachine);
		await this.fsm.init();
		super.init({
			x: 7,
			y: 7,
			type: ENTITY_TYPE_ENUM.ENEMY,
			state: ENTITY_STATE_ENUM.IDLE,
			direction: DIRECTION_ENUM.TOP,
		});
		this.registerEvents();
		this.onChangeDirection(true);
	}

	registerEvents() {
		EventManager.Instance.on(EVENT_TYPE.PLAYER_BORN, this.onChangeDirection, this);
		EventManager.Instance.on(EVENT_TYPE.PLAYER_MOVE_END, this.onChangeDirection, this);
	}

	// 参数 isInit 确保在第一次加载时，执行改变朝向算法
	onChangeDirection(isInit: boolean = false) {
		if (!DataManager.Instance.player) return;
		const { x: playerX, y: playerY } = DataManager.Instance.player;

		const disX = playerX - this.x;
		// 锚点为 (0,1) 所以 disY 需要取负值
		const disY = this.y - playerY;

		const absDisX = Math.abs(disX);
		const absDisY = Math.abs(disY);

		console.log(disX, disY, absDisX, absDisY);

		// 位于对角线时，不改变朝向
		if (absDisX === absDisY && !isInit) return;

		if (disX >= 0 && disY >= 0) {
			// 第一象限
			this.direction = absDisX > absDisY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.TOP;
		} else if (disX >= 0 && disY <= 0) {
			// 第四象限
			this.direction = absDisX > absDisY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM;
		} else if (disX <= 0 && disY >= 0) {
			// 第二象限
			this.direction = absDisX > absDisY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.TOP;
		} else if (disX <= 0 && disY <= 0) {
			// 第三象限
			this.direction = absDisX > absDisY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM;
		}
	}
}
