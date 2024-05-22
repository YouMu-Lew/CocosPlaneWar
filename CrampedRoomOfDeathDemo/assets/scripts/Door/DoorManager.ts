import { _decorator, error } from 'cc';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_TYPE } from '../../Enums';
import { EntityManager } from '../../Base/EntityManager';
import { DoorStateMachine } from './DoorStateMachine';
import EventManager from '../../Runtime/EventManager';

const { ccclass, property } = _decorator;

@ccclass('DoorManager')
export class DoorManager extends EntityManager {
	async init() {
		this.fsm = this.addComponent(DoorStateMachine);
		await this.fsm.init();
		super.init({
			x: 7,
			y: 8,
			type: ENTITY_TYPE_ENUM.DOOR,
			state: ENTITY_STATE_ENUM.IDLE,
			direction: DIRECTION_ENUM.TOP,
		});
		this.registerEvents();
	}

	registerEvents() {
		EventManager.Instance.on(EVENT_TYPE.LEVEL_CLEARED, this.onOpen, this);
	}

	protected onDestroy(): void {
		// 移除事件监听
		EventManager.Instance.off(EVENT_TYPE.LEVEL_CLEARED, this.onOpen);
	}

	onOpen() {
		this.death();
	}

	death(): void {
		this.isDead = true;
		this.state = ENTITY_STATE_ENUM.DEATH;

		this.scheduleOnce(() => {
			this.node.destroy();
		}, 1);
	}
}
