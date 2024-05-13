import { _decorator, Component, Sprite, SpriteFrame, UITransform } from 'cc';
import { TILE_TYPE_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass('TileManager')
export class TileManager extends Component {
	type: TILE_TYPE_ENUM;
	moveable: boolean;
	turnable: boolean;

	init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
		this.type = type;
		switch (this.type) {
			case TILE_TYPE_ENUM.WALL_LEFT_TOP:
			case TILE_TYPE_ENUM.WALL_LEFT_BOTTOM:
			case TILE_TYPE_ENUM.WALL_RIGHT_TOP:
			case TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM:
			case TILE_TYPE_ENUM.WALL_COLUMN:
			case TILE_TYPE_ENUM.WALL_ROW:
				this.moveable = false;
				this.turnable = false;
				break;
			case TILE_TYPE_ENUM.CLIFF_LEFT:
			case TILE_TYPE_ENUM.CLIFF_CENTER:
			case TILE_TYPE_ENUM.CLIFF_RIGHT:
				this.moveable = false;
				this.turnable = true;
				break;
			case TILE_TYPE_ENUM.FLOOR:
				this.moveable = true;
				this.turnable = true;
				break;
		}

		// 创建Tile
		const sprite = this.node.addComponent(Sprite);
		sprite.spriteFrame = spriteFrame;

		const transform = this.node.getComponent(UITransform);
		transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);

		this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
	}
}
