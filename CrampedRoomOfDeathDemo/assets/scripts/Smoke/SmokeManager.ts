import { _decorator } from 'cc';
import { EntityManager } from '../../Base/EntityManager';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, EVENT_TYPE, PARAMS_NAME_ENUM } from '../../Enums';
import { IEntity } from '../../Levels';
import EventManager from '../../Runtime/EventManager';
import { SmokeStateMachine } from './SmokeStateMachine';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';

const { ccclass, property } = _decorator;

@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
	async init(params: IEntity) {
		this.node.active = false;
		this.fsm = this.addComponent(SmokeStateMachine);
		await this.fsm.init();
		super.init(params);
		this.registerEvents();
	}

	registerEvents() {
		EventManager.Instance.on(EVENT_TYPE.PLAYER_MOVE, this.show, this);
	}

	protected onDestroy(): void {
		// 移除事件监听
		EventManager.Instance.off(EVENT_TYPE.PLAYER_MOVE, this.show);
	}

	show(x: number, y: number, direction: DIRECTION_ENUM) {
		if (!this.node.active) {
			this.node.active = true;
		}
		this.x = x;
		this.y = y;
		this.node.setPosition((this.x - 1.5) * TILE_WIDTH, -(this.y - 1.5) * TILE_HEIGHT);
		this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[direction]);
	}
}
