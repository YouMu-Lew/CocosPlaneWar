import { _decorator, Animation, animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager';
import { CONTROLLER_EVENT, EVENT_TYPE, STATE_TYPE } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
	x: number = 0;
	y: number = 0;
	targetX: number = 0;
	targetY: number = 0;
	private fsm: PlayerStateMachine;

	private speed: number = 0.1;

	async init() {
		const sprite = this.addComponent(Sprite);
		sprite.sizeMode = Sprite.SizeMode.CUSTOM;

		this.getComponent(UITransform).setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

		this.fsm = this.addComponent(PlayerStateMachine);
		await this.fsm.init();
		this.fsm.setParams(STATE_TYPE.IDLE, true);

		this.registerEvents();
	}

	registerEvents() {
		EventManager.Instance.on(EVENT_TYPE.PLAYER_CONTROL, this.move, this);
	}

	protected update(dt: number): void {
		this.updatePos();
	}

	updatePos() {
		this.updateXY();
		this.node.setPosition((this.x - 1.5) * TILE_WIDTH, -(this.y - 1.5) * TILE_HEIGHT);
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
	}

	move(inputDirection: CONTROLLER_EVENT) {
		switch (inputDirection) {
			case CONTROLLER_EVENT.UP:
				this.targetY--;
				break;
			case CONTROLLER_EVENT.DOWN:
				this.targetY++;
				break;
			case CONTROLLER_EVENT.LEFT:
				this.targetX--;
				break;
			case CONTROLLER_EVENT.RIGHT:
				this.targetX++;
				break;
			case CONTROLLER_EVENT.TURNLEFT:
				this.fsm.setParams(STATE_TYPE.TURNLEFT, true);
				break;
		}
	}
}
