import { _decorator, Component } from 'cc';
import { createUINode } from '../Utils';
import { TileManager } from './TileManager';
import DataManager from '../../Runtime/DataManager';
import ResourceManager from '../../Runtime/ResourceManager';
const { ccclass, property } = _decorator;

@ccclass('TileMapManager')
export class TileMapManager extends Component {
	async init() {
		const spriteFrames = await ResourceManager.Instance.loadDir('texture/tile/tile');
		// console.log(spriteFrames);

		const { mapInfo } = DataManager.Instance;

		for (let i = 0; i < mapInfo.length; i++) {
			const column = mapInfo[i];
			for (let j = 0; j < column.length; j++) {
				const item = column[j];
				if (item.src === null || item.type === null) continue;

				// 创建Tile
				const tile = createUINode();
				const imgSrc = `tile (${item.src})`;
				const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0];

				const tileManager = tile.addComponent(TileManager);
				tileManager.init(spriteFrame, i, j);

				tile.setParent(this.node);
			}
		}
	}
}
