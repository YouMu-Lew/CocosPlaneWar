import { Layers, Node, UITransform } from 'cc';

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
export const randomIntByRange = (min: number, max: number): number => {
	// (cc.) math.randomRangeInt(min.max);
	return Math.floor(min + (max - min) * Math.random());
};
