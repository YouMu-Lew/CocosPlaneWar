import { Layers, Node, SpriteFrame, UITransform } from 'cc';

/**
 * 统一创建 Node 的接口
 * @param name
 * @returns 返回 cc.Node 类型节点
 */
export const createUINode = (parent: Node | null = null, name: string = ''): Node => {
	const node = new Node(name);

	const transform = node.addComponent(UITransform);
	transform.setAnchorPoint(0, 1);

	node.layer = Layers.Enum.UI_2D;

	node.setParent(parent);

	return node;
};

/**
 * @param min
 * @param max
 * @returns a pseudorandom integer between [min, max).
 */
// (cc.) math.randomRangeInt(min.max);
export const randomIntByRange = (min: number, max: number): number => Math.floor(min + (max - min) * Math.random());

const reg = /\((\d+)\)/;

const getNumberWithinString = (str: string) => parseInt(str.match(reg)[1]);

export const sortSpriteFrames = (spriteFrames: SpriteFrame[]) =>
	spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name));

/**
 * @param len 字符串长度
 * @returns 返回指定长度的随机数字字符串
 */
export const randomNumStrByLen = (len: number) =>
	Array.from({ length: len }).reduce<string>((total, item) => total + Math.floor(Math.random() * 10), '');
