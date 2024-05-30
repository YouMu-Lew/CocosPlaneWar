import { _decorator, Component, Sprite, UITransform } from 'cc';
import { StateMachine } from '../../Base/StateMachine';
import {
	ENTITY_STATE_ENUM,
	ENTITY_TYPE_ENUM,
	EVENT_TYPE,
	PARAMS_NAME_ENUM,
	SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from '../../Enums';
import { IEntity, ISpike } from '../../Levels';
import { TILE_WIDTH, TILE_HEIGHT } from '../Tile/TileManager';
import { ENTITY_ID_Len } from '../../Base/EntityManager';
import { randomNumStrByLen } from '../Utils';
import { SpikeStateMachine } from './SpikeStateMachine';
import EventManager from '../../Runtime/EventManager';

const { ccclass, property } = _decorator;

@ccclass('SpikeManager')
export class SpikeManager extends Component {
	x: number = 0;
	y: number = 0;

	fsm: StateMachine;

	public readonly id = randomNumStrByLen(ENTITY_ID_Len);
	private _count: number = 0;
	private _totalCount: number = 0;
	public type: ENTITY_TYPE_ENUM;

	onAttack(...params): void {}

	get count() {
		return this._count;
	}

	set count(newCount: number) {
		this._count = newCount;
		this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, newCount);
	}

	get totalCount() {
		return this._totalCount;
	}

	set totalCount(newCount: number) {
		this._totalCount = newCount;
		this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, newCount);
	}

	async init(params: ISpike) {
		const sprite = this.addComponent(Sprite);
		sprite.sizeMode = Sprite.SizeMode.CUSTOM;
		const transform = this.getComponent(UITransform);
		transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

		this.fsm = this.addComponent(SpikeStateMachine);
		await this.fsm.init();

		this.x = params.x;
		this.y = params.y;
		this.type = params.type;
		this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type];
		this.count = params.count;

		this.node.setPosition((this.x - 1.5) * TILE_WIDTH, -(this.y - 1.5) * TILE_HEIGHT);

		this.registerEvents();
	}

	registerEvents() {
		EventManager.Instance.on(EVENT_TYPE.PLAYER_MOVE_END, this.onPlayerMoveEnd, this);
	}

	onPlayerMoveEnd(...params) {
		this.count = this.count + 1 > this.totalCount ? 0 : this.count + 1;
	}
}
