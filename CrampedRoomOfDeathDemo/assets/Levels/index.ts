import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from '../Enums';
import level1 from './level01';
import level2 from './level02';

export interface ITile {
	src: number | null; // 瓦片图片类型
	type: TILE_TYPE_ENUM | null;
}

export interface ILevel {
	mapInfo: Array<Array<ITile>>;
}

export interface IEntity {
	x: number;
	y: number;
	type: ENTITY_TYPE_ENUM;
	state: ENTITY_STATE_ENUM;
	direction: DIRECTION_ENUM;
}

export interface ISpike {
	x: number;
	y: number;
	type: ENTITY_TYPE_ENUM;
	count: number;
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
