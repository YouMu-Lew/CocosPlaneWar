import { TILE_TYPE_ENUM } from "../Enums";
import level1 from "./level01";

export interface ITile{
  src: number | null  ,
  type: TILE_TYPE_ENUM | null,
}

export interface ILevel{
  mapInfo:Array<Array<ITile>>
}

const levels:Record<string,ILevel> = {
  level1,
}

/**
 * 统一导入关卡的入口
 */
export default levels;
