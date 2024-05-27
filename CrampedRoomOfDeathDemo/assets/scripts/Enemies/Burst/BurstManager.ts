import { UITransform, _decorator, error } from 'cc';
import { ENTITY_STATE_ENUM, EVENT_TYPE } from '../../../Enums';
import DataManager from '../../../Runtime/DataManager';
import { EnemyManager } from '../../../Base/EnemyManager';
import { IEntity } from '../../../Levels';
import { BurstStateMachine } from './BurstStateMachine';
import { TILE_HEIGHT, TILE_WIDTH } from '../../Tile/TileManager';
import EventManager from '../../../Runtime/EventManager';
const { ccclass, property } = _decorator;

@ccclass('BurstManager')
export class BurstManager extends EnemyManager {
	async init(params: IEntity) {
		this.fsm = this.addComponent(BurstStateMachine);
		await this.fsm.init();
		super.init(params);

		this.getComponent(UITransform).setContentSize(TILE_WIDTH, TILE_HEIGHT);
	}

	onAttack() {
		if (!DataManager.Instance.player) {
			error('未获取到玩家数据');
			return;
		}
		if (this.isDead) return;
		const { x: playerX, y: playerY, isDead } = DataManager.Instance.player;
		if (isDead) return;

		if (playerX === this.x && playerY === this.y) {
			if (this.state === ENTITY_STATE_ENUM.IDLE) this.state = ENTITY_STATE_ENUM.ATTACK;
			else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
				this.state = ENTITY_STATE_ENUM.DEATH;
				EventManager.Instance.emit(EVENT_TYPE.ENEMY_ATTACK, ENTITY_STATE_ENUM.AIRDEATH);
			}
		}
	}

	updatePos() {
		this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT);
	}
}
