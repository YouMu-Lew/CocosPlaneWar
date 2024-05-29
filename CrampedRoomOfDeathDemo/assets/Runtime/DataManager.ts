import { EnemyManager } from '../Base/EnemyManager';
import Singleton from '../Base/SingleTon';
import { ITile } from '../Levels';
import { BurstManager } from '../scripts/Burst/BurstManager';
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
	enemies: EnemyManager[] = [];
	bursts: BurstManager[] = [];

	reset() {
		this.mapInfo = [];
		this.tileInfo = [];
		this.mapRowCount = 0;
		this.mapColumnCount = 0;
		this.player = null;
		this.enemies = [];
		this.bursts = [];
	}
}
