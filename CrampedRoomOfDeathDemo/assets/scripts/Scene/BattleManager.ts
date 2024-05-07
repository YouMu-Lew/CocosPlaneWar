import { _decorator, Component, error, Node, Widget } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../Utils';
import levels, { ILevel } from "../../Levels";
import  DataManager  from '../../Runtime/DataManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
	level:ILevel = null;
	stage:Node = null;

	start() {
		this.initStage();
		this.initLevel();
	}

	initStage () {
		this.stage = createUINode();
		this.stage.setParent(this.node);
	}

	initLevel(){
		const level = levels[`level${1}`];
		if(!level)
			error("获取 level info 失败");

		this.level = level;
		DataManager.Instance.mapInfo = this.level.mapInfo;
		DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0;
		DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0;

		this.generateTileMap();
	}

	generateTileMap() {
		const tileMap = createUINode();
		tileMap.setParent(this.stage);

		// const widget = tileMap.addComponent(Widget);
		// widget.isAlignHorizontalCenter = true;
		// widget.isAlignVerticalCenter = true;

		// widget.horizontalCenter = 0;
		// widget.verticalCenter = 0;

		const tileMapManager = tileMap.addComponent(TileMapManager);
		tileMapManager.init();

		this.adpatPos();
	}

	adpatPos () {
		// TODO 是否可以用 widget 实现
		const { mapRowCount, mapColumnCount } = DataManager.Instance;
		const disX = mapRowCount * TILE_WIDTH / 2;
		const disY = mapColumnCount * TILE_HEIGHT / 2 + 50;
		this.stage.setPosition(-disX, disY);
	}

}
