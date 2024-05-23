import { _decorator, error } from 'cc';
import { ENTITY_STATE_ENUM, EVENT_TYPE } from '../../Enums';
import { EntityManager } from '../../Base/EntityManager';
import { DoorStateMachine } from './DoorStateMachine';
import EventManager from '../../Runtime/EventManager';
import { IEntity } from '../../Levels';

const { ccclass, property } = _decorator;

@ccclass('DoorManager')
export class DoorManager extends EntityManager {
	async init(params: IEntity) {
		this.fsm = this.addComponent(DoorStateMachine);
		await this.fsm.init();
		super.init(params);
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
}
