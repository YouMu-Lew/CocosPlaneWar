import { EnemyManager } from '../Base/EnemyManager';
import Singleton from '../Base/SingleTon';
import { ITile } from '../Levels';
import { BurstManager } from '../scripts/Burst/BurstManager';
import { DoorManager } from '../scripts/Door/DoorManager';
import { PlayerManager } from '../scripts/Player/PlayerManager';
import { SpikeManager } from '../scripts/Spike/SpikeManager';
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
	door: DoorManager = null;
	enemies: EnemyManager[] = [];
	bursts: BurstManager[] = [];
	spikes: SpikeManager[] = [];

	reset() {
		this.mapInfo = [];
		this.tileInfo = [];
		this.mapRowCount = 0;
		this.mapColumnCount = 0;
		this.player = null;
		this.door = null;
		this.enemies = [];
		this.bursts = [];
		this.spikes = [];
	}
}
