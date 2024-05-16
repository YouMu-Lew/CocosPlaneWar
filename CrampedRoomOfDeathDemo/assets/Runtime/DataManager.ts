import Singleton from '../Base/SingleTon';
import { ITile } from '../Levels';
import { WoodenSkeletonManager } from '../scripts/Enemies/WoodenSkeletonManager';
import { PlayerManager } from '../scripts/Player/PlayerManager';
import { TileManager } from '../scripts/Tile/TileManager';

/**
 * 泛型单例模式
 */
export default class DataManager extends Singleton {
	static get Instance() {
		return super.getInstance<DataManager>();
	}

	mapInfo: Array<Array<ITile>> = [];
	tileInfo: Array<Array<TileManager>> = [];
	mapRowCount: number = 0;
	mapColumnCount: number = 0;
	levelIndex: number = 1;
	player: PlayerManager = null;
	enemies: WoodenSkeletonManager[] = [];

	reset() {
		this.mapInfo = [];
		this.tileInfo = [];
		this.mapRowCount = 0;
		this.mapColumnCount = 0;
		this.player = null;
		this.enemies = [];
	}
}
