import { _decorator, Component, error, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../Utils';
import levels, { IEntity, ILevel } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { ENEMY_TYPE_ENUM, ENTITY_TYPE_ENUM, EVENT_TYPE } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../Enemies/WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../Enemies/IronSkeleton/IronSkeletonManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikeManager } from '../Spike/SpikeManager';
import { EnemyManager } from '../../Base/EnemyManager';

const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
	level: ILevel = null;
	stage: Node = null;
	player: Node = null;

	onLoad(): void {
		EventManager.Instance.on(EVENT_TYPE.NEXT_LEVEL, this.nextLevel, this);
		EventManager.Instance.on(EVENT_TYPE.ENTITY_DEATH, this.onEntityDeath, this);
		EventManager.Instance.on(EVENT_TYPE.PLAYER_MOVE_END, this.checkWin, this);
	}

	protected onDestroy(): void {
		EventManager.Instance.off(EVENT_TYPE.NEXT_LEVEL, this.nextLevel);
		EventManager.Instance.off(EVENT_TYPE.ENTITY_DEATH, this.onEntityDeath);
		EventManager.Instance.off(EVENT_TYPE.PLAYER_MOVE_END, this.checkWin);
	}

	start() {
		// 手动设置当前关卡
		// DataManager.Instance.levelIndex = 2;
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
		const promise: Promise<void>[] = [];
		this.level.bursts.forEach(burst => {
			const burstNode = createUINode(this.stage, 'Burst');
			const burstManager = burstNode.addComponent(BurstManager);
			promise.push(burstManager.init(burst));
			DataManager.Instance.bursts.push(burstManager);
		});
		await Promise.all(promise);
	}

	async generateSpikes() {
		const promise: Promise<void>[] = [];
		this.level.spikes.forEach(spike => {
			const spikeNode = createUINode(this.stage, 'Spike');
			const spikeManager = spikeNode.addComponent(SpikeManager);
			promise.push(spikeManager.init(spike));
			DataManager.Instance.spikes.push(spikeManager);
		});
		await Promise.all(promise);
	}

	async generatePlayer() {
		this.player = createUINode(this.stage, 'Player');
		const playerManager = this.player.addComponent(PlayerManager);
		await playerManager.init(this.level.player);
		DataManager.Instance.player = playerManager;
		EventManager.Instance.emit(EVENT_TYPE.PLAYER_BORN, true);
	}

	async generateEnemies() {
		const promise: Promise<void>[] = [];
		this.level.enemies.forEach(enemy => {
			promise.push(this.generateEnemy(enemy));
		});
		await Promise.all(promise);
	}

	async generateEnemy(enemyInfo: IEntity) {
		let enemy: Node = null;
		let enemyManager: EnemyManager = null;
		switch (enemyInfo.enemyType) {
			case ENEMY_TYPE_ENUM.WOODEN_SKELETON:
				enemy = createUINode(this.stage, 'WoodenSkeleton');
				enemyManager = enemy.addComponent(WoodenSkeletonManager);
				break;
			case ENEMY_TYPE_ENUM.IRON_SKELETON:
				enemy = createUINode(this.stage, 'IronSkeleton');
				enemyManager = enemy.addComponent(IronSkeletonManager);
				break;
			default:
				break;
		}
		await enemyManager.init(enemyInfo);
		DataManager.Instance.enemies.push(enemyManager);
		DataManager.Instance.tileInfo[enemyManager.x][enemyManager.y].moveable = false;
		DataManager.Instance.tileInfo[enemyManager.x][enemyManager.y].turnable = false;
	}

	async generateDoor() {
		const door = createUINode(this.stage, 'Door');
		const doorManager = door.addComponent(DoorManager);
		await doorManager.init(this.level.door);
		DataManager.Instance.door = doorManager;
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

	checkWin() {
	    const {x: playerX, y: playerY} = DataManager.Instance.player;
		const {x: doorX, y: doorY} = DataManager.Instance.door;
		if (playerX === doorX && playerY === doorY) {
		    EventManager.Instance.emit(EVENT_TYPE.NEXT_LEVEL);
		}
	}
}
