import { _decorator, Component, error, Node, Widget } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../Utils';
import levels, { ILevel } from '../../Levels';
import DataManager from '../../Runtime/DataManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { ENTITY_TYPE_ENUM, EVENT_TYPE } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../Enemies/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';

const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
	level: ILevel = null;
	stage: Node = null;
	player: Node = null;

	onLoad(): void {
		EventManager.Instance.on(EVENT_TYPE.NEXT_LEVEL, this.nextLevel, this);
		EventManager.Instance.on(EVENT_TYPE.ENEMY_DEATH, this.onEntityDeath, this);
	}

	protected onDestroy(): void {
		EventManager.Instance.off(EVENT_TYPE.NEXT_LEVEL, this.nextLevel);
		EventManager.Instance.off(EVENT_TYPE.ENEMY_DEATH, this.onEntityDeath);
	}

	start() {
		this.initStage();
		this.initLevel();
	}

	initStage() {
		this.stage = createUINode();
		this.stage.setParent(this.node);
	}

	initLevel() {
		const level = levels[`level${DataManager.Instance.levelIndex}`];
		if (!level) error('获取 level info 失败');

		this.clearLevel();

		this.level = level;
		DataManager.Instance.mapInfo = this.level.mapInfo;
		DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0;
		DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0;

		this.generateTileMap();
		this.generateEnemies();
		this.generatePlayer();
		this.generateDoor();
	}

	async generateTileMap() {
		const tileMap = createUINode();
		tileMap.setParent(this.stage);

		const tileMapManager = tileMap.addComponent(TileMapManager);
		await tileMapManager.init();

		this.adpatPos();
	}

	async generatePlayer() {
		this.player = createUINode(this.stage);
		// 让 player 在渲染时显示在最前面
		this.player.setSiblingIndex(100);
		const playerManager = this.player.addComponent(PlayerManager);
		await playerManager.init();
		DataManager.Instance.player = playerManager;
		EventManager.Instance.emit(EVENT_TYPE.PLAYER_BORN, true);
	}

	async generateEnemies() {
		const enemy = createUINode(this.stage);
		const woodenSkeletonManager = enemy.addComponent(WoodenSkeletonManager);
		await woodenSkeletonManager.init();
		DataManager.Instance.enemies.push(woodenSkeletonManager);
	}

	async generateDoor() {
		const door = createUINode(this.stage);
		const doorManager = door.addComponent(DoorManager);
		await doorManager.init();
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

	onEntityDeath(type: ENTITY_TYPE_ENUM, id: string) {
		if (type === ENTITY_TYPE_ENUM.ENEMY) {
			DataManager.Instance.enemies = DataManager.Instance.enemies.filter(enemy => enemy.id !== id);
			if (DataManager.Instance.enemies.length === 0) {
				// 延时执行
				setTimeout(() => {
					EventManager.Instance.emit(EVENT_TYPE.LEVEL_CLEARED);
				}, 1000);
			}
		}
	}
}
