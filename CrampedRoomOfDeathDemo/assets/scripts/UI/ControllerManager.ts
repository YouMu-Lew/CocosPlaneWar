import { _decorator, Button, Component, Event, EventHandler, Node } from 'cc';
import EventManager from '../../Runtime/EventManager';
import { CONTROLLER_EVENT, EVENT_TYPE } from '../../Enums';
const { ccclass, property } = _decorator;

@ccclass('ControllerManager')
export class ControllerManager extends Component {
	protected onLoad(): void {
		this.bindClickEvents();
	}

	bindClickEvents() {
		this.node.children.forEach(item => {
			const clickEventHandler = new EventHandler();
			clickEventHandler.target = this.node;
			clickEventHandler.component = 'ControllerManager';
			clickEventHandler.handler = 'handleCtrl';
			clickEventHandler.customEventData = item.name.split('_', 2)[1].toUpperCase();
			item.getComponent(Button).clickEvents.push(clickEventHandler);
		});
	}

	handleCtrl(evt: Event, type: string) {
		EventManager.Instance.emit(EVENT_TYPE.PLAYER_CONTROL, type as CONTROLLER_EVENT);
	}
}
