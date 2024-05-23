import { _decorator, error } from 'cc';
import { ENTITY_STATE_ENUM, EVENT_TYPE } from '../../../Enums';
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine';
import EventManager from '../../../Runtime/EventManager';
import DataManager from '../../../Runtime/DataManager';
import { EnemyManager } from '../../../Base/EnemyManager';
import { IEntity } from '../../../Levels';
const { ccclass, property } = _decorator;

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
	async init(params: IEntity) {
		this.fsm = this.addComponent(WoodenSkeletonStateMachine);
		await this.fsm.init();
		super.init(params);
	}

	onAttack() {
		if (!DataManager.Instance.player) {
			error('未获取到玩家数据');
			return;
		}
		if (this.isDead) return;
		const { x: playerX, y: playerY, isDead } = DataManager.Instance.player;
		if (isDead) return;
		const distance = Math.abs(this.x - playerX) + Math.abs(this.y - playerY);
		if (distance <= 1) {
			this.state = ENTITY_STATE_ENUM.ATTACK;
			EventManager.Instance.emit(EVENT_TYPE.ENEMY_ATTACK, ENTITY_STATE_ENUM.DEATH);
		}
	}
}
