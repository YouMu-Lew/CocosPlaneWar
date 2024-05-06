import { Layers, Node, UITransform } from "cc";

export const createUINode = (name:string = ''):Node => {
  const node = new Node(name);

  const transform = node.addComponent(UITransform);
  transform.setAnchorPoint

  node.layer = Layers.Enum.UI_2D;

  return node;
}
