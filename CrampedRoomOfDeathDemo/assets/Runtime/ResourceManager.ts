import { SpriteFrame, resources, spriteAssembler } from 'cc';
import Singleton from '../Base/SingleTon';

export default class ResourceManager extends Singleton {
	static get Instance() {
		return super.getInstance<ResourceManager>();
	}

	/**
	 * 官方为回调函数写法，不太好写，封装为 Promise
	 * 动态批量加载 path 目录下所有图片
	 */
	loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
		return new Promise<SpriteFrame[]>((resolve, reject) => {
			resources.loadDir(path, type, function (err, assets) {
				if (err) {
					reject(err);
					return;
				}
				resolve(assets);
			});
		});
	}
}
