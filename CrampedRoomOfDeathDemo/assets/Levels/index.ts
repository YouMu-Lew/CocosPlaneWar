import { TILE_TYPE_ENUM } from '../Enums';
import level1 from './level01';
import level2 from './level02';

export interface ITile {
	src: number | null;
	type: TILE_TYPE_ENUM | null;
}

export interface ILevel {
	mapInfo: Array<Array<ITile>>;
}

//TODO Record是啥
const levels: Record<string, ILevel> = {
	level1,
	level2,
};

/**
 * 统一导入关卡的入口
 */
export default levels;
