import { _decorator, Component, math } from 'cc';
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
		DataManager.Instance.tileInfo = [];

		for (let i = 0; i < mapInfo.length; i++) {
			DataManager.Instance.tileInfo[i] = [];

			const column = mapInfo[i];
			for (let j = 0; j < column.length; j++) {
				const item = column[j];
				if (item.src === null || item.type === null) continue;

				// 创建Tile

				// 增加图片随机性
				let num = item.src;
				if ((num === 1 || num === 5 || num === 9) && Math.random() > 0.8) {
					// 每种 tile 有四张图
					num = math.randomRangeInt(num, num + 4);
				}

				const imgSrc = `tile (${num})`;

				const tile = createUINode(this.node, item.type as string);
				const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0];

				const tileManager = tile.addComponent(TileManager);
				tileManager.init(item.type, spriteFrame, i, j);
				DataManager.Instance.tileInfo[i][j] = tileManager;
			}
		}
	}
}
