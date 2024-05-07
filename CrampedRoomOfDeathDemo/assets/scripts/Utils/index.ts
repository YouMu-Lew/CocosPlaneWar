import { Layers, Node, UITransform } from 'cc';

export const createUINode = (name: string = ''): Node => {
	const node = new Node(name);

	const transform = node.addComponent(UITransform);
	transform.setAnchorPoint(0, 1);

	node.layer = Layers.Enum.UI_2D;

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
