import { _decorator, Component, Node } from 'cc';
import EventManager from '../../Runtime/EventManager';
import { EVENT_TYPE } from '../../Enums';
const { ccclass, property } = _decorator;

@ccclass('ControllerManager')
export class ControllerManager extends Component {
	handleCtrl() {
		EventManager.Instance.emit(EVENT_TYPE.NEXT_LEVEL);
	}
}
