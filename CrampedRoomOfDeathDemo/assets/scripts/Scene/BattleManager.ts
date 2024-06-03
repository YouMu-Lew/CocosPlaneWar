import { _decorator, Component, error, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../Utils';
import levels, { ILevel, ISpike } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_TYPE } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../Enemies/WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../Enemies/IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikeManager } from '../Spike/SpikeManager';

const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
	level: ILevel = null;
	stage: Node = null;
	player: Node = null;

	onLoad(): void {
		EventManager.Instance.on(EVENT_TYPE.NEXT_LEVEL, this.nextLevel, this);
		EventManager.Instance.on(EVENT_TYPE.ENTITY_DEATH, this.onEntityDeath, this);
	}

	protected onDestroy(): void {
		EventManager.Instance.off(EVENT_TYPE.NEXT_LEVEL, this.nextLevel);
		EventManager.Instance.off(EVENT_TYPE.ENTITY_DEATH, this.onEntityDeath);
	}

	start() {
		this.initStage();
		this.initLevel();
	}

	initStage() {
		this.stage = createUINode();
		this.stage.setParent(this.node);
	}

	async initLevel() {
		const level = levels[`level${DataManager.Instance.levelIndex}`];
		if (!level) error('获取 level info 失败');

		this.clearLevel();

		this.level = level;
		DataManager.Instance.mapInfo = this.level.mapInfo;
		DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0;
		DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0;

		await this.generateTileMap();
		await this.generateBursts();
		await this.generateSpikes();
		await this.generateEnemies();
		await this.generatePlayer();
		await this.generateDoor();
	}

	async generateTileMap() {
		const tileMap = createUINode();
		tileMap.setParent(this.stage);

		const tileMapManager = tileMap.addComponent(TileMapManager);
		await tileMapManager.init();

		this.adpatPos();
	}

	async generateBursts() {
		const burst = createUINode(this.stage, 'Burst');
		const burstManager = burst.addComponent(BurstManager);
		await burstManager.init({
			x: 2,
			y: 5,
			type: ENTITY_TYPE_ENUM.BURST,
			state: ENTITY_STATE_ENUM.IDLE,
			direction: DIRECTION_ENUM.TOP,
		});
		DataManager.Instance.bursts.push(burstManager);
	}

	async generateSpikes() {
		await this.generateSpike({
			x: 1,
			y: 6,
			type: ENTITY_TYPE_ENUM.SPIKE_ONE,
			count: 0,
		});
		await this.generateSpike({
			x: 2,
			y: 6,
			type: ENTITY_TYPE_ENUM.SPIKE_TWO,
			count: 0,
		});
		await this.generateSpike({
			x: 3,
			y: 6,
			type: ENTITY_TYPE_ENUM.SPIKE_THREE,
			count: 0,
		});
		await this.generateSpike({
			x: 1,
			y: 7,
			type: ENTITY_TYPE_ENUM.SPIKE_FOUR,
			count: 0,
		});
	}

	async generateSpike(params: ISpike) {
		const spike = createUINode(this.stage, 'Spike');
		const spikeManager = spike.addComponent(SpikeManager);
		await spikeManager.init(params);
		DataManager.Instance.spikes.push(spikeManager);
	}

	async generatePlayer() {
		this.player = createUINode(this.stage, 'Player');
		const playerManager = this.player.addComponent(PlayerManager);
		await playerManager.init({
			x: 2,
			y: 8,
			type: ENTITY_TYPE_ENUM.PLAYER,
			state: ENTITY_STATE_ENUM.IDLE,
			direction: DIRECTION_ENUM.TOP,
		});
		DataManager.Instance.player = playerManager;
		EventManager.Instance.emit(EVENT_TYPE.PLAYER_BORN, true);
	}

	async generateEnemies() {
		const enemy = createUINode(this.stage, 'WoodenSkeleton');
		const woodenSkeletonManager = enemy.addComponent(WoodenSkeletonManager);
		await woodenSkeletonManager.init({
			x: 2,
			y: 4,
			type: ENTITY_TYPE_ENUM.ENEMY,
			state: ENTITY_STATE_ENUM.IDLE,
			direction: DIRECTION_ENUM.TOP,
		});
		DataManager.Instance.enemies.push(woodenSkeletonManager);
		DataManager.Instance.tileInfo[woodenSkeletonManager.x][woodenSkeletonManager.y].moveable = false;
		DataManager.Instance.tileInfo[woodenSkeletonManager.x][woodenSkeletonManager.y].turnable = false;

		const enemy1 = createUINode(this.stage, 'IronSkeleton');
		const ironSkeletonManager = enemy1.addComponent(IronSkeletonManager);
		await ironSkeletonManager.init({
			x: 7,
			y: 6,
			type: ENTITY_TYPE_ENUM.ENEMY,
			state: ENTITY_STATE_ENUM.IDLE,
			direction: DIRECTION_ENUM.TOP,
		});
		DataManager.Instance.enemies.push(ironSkeletonManager);
		DataManager.Instance.tileInfo[ironSkeletonManager.x][ironSkeletonManager.y].moveable = false;
		DataManager.Instance.tileInfo[ironSkeletonManager.x][ironSkeletonManager.y].turnable = false;
	}

	async generateDoor() {
		const door = createUINode(this.stage, 'Door');
		const doorManager = door.addComponent(DoorManager);
		await doorManager.init({
			x: 7,
			y: 8,
			type: ENTITY_TYPE_ENUM.DOOR,
			state: ENTITY_STATE_ENUM.IDLE,
			direction: DIRECTION_ENUM.TOP,
		});
		DataManager.Instance.tileInfo[doorManager.x][doorManager.y].moveable = false;
		DataManager.Instance.tileInfo[doorManager.x][doorManager.y].turnable = false;
	}

	nextLevel() {
		DataManager.Instance.levelIndex++;
		this.initLevel();
	}

	clearLevel() {
		this.stage.destroyAllChildren();
		DataManager.Instance.reset();
	}

	adpatPos() {
		// TODO 是否可以用 widget 实现
		const { mapRowCount, mapColumnCount } = DataManager.Instance;
		const disX = (mapRowCount * TILE_WIDTH) / 2;
		const disY = (mapColumnCount * TILE_HEIGHT) / 2 + 50;
		this.stage.setPosition(-disX, disY);
	}

	onEntityDeath(x: number, y: number, type: ENTITY_TYPE_ENUM, id: string) {
		switch (type) {
			case ENTITY_TYPE_ENUM.PLAYER:
				break;
			case ENTITY_TYPE_ENUM.ENEMY:
				DataManager.Instance.enemies = DataManager.Instance.enemies.filter(enemy => enemy.id !== id);
				if (DataManager.Instance.enemies.length === 0) {
					// 延时执行
					setTimeout(() => {
						EventManager.Instance.emit(EVENT_TYPE.LEVEL_CLEARED);
					}, 1000);
				}
				break;
			case ENTITY_TYPE_ENUM.DOOR:
				break;
			default:
		}
		DataManager.Instance.tileInfo[x][y].moveable = true;
		DataManager.Instance.tileInfo[x][y].turnable = true;
	}
}
