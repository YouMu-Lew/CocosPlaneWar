import { ITile } from "../Levels";

class DataManager{
  mapInfo:Array<Array<ITile>>;
  mapRowCount:number;
  mapColumnCount:number;
}

// 单例模式
export const DataManagerInstance = new DataManager();
