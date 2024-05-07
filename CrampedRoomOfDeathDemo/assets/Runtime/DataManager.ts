import Singleton from "../Base/SingleTon";
import { ITile } from "../Levels";

/**
 * 泛型单例模式
 */
export default class DataManager extends Singleton{
  static get Instance(){
    return super.getInstance<DataManager>();
  }

  mapInfo:Array<Array<ITile>>;
  mapRowCount:number;
  mapColumnCount:number;
}
