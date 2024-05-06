System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform, levels, _dec, _class, _crd, ccclass, property, TILE_WIDTH, TILE_HEIGHT, TileMapManager;

  function _reportPossibleCrUseOflevels(extras) {
    _reporterNs.report("levels", "../../Levels", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Layers = _cc.Layers;
      Node = _cc.Node;
      resources = _cc.resources;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      levels = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a5861lWFXdOjKAfP5FezZoH", "TileMapManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'ForwardFlow', 'Layers', 'Node', 'resources', 'Sprite', 'SpriteFrame', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TILE_WIDTH", TILE_WIDTH = 55);

      _export("TILE_HEIGHT", TILE_HEIGHT = 55);

      _export("TileMapManager", TileMapManager = (_dec = ccclass('TileMapManager'), _dec(_class = class TileMapManager extends Component {
        async init() {
          const {
            mapInfo
          } = (_crd && levels === void 0 ? (_reportPossibleCrUseOflevels({
            error: Error()
          }), levels) : levels)[`level${1}`];
          const spriteFrames = await this.loadRes();
          console.log(spriteFrames);

          for (let i = 0; i < mapInfo.length; i++) {
            const column = mapInfo[i];

            for (let j = 0; j < column.length; j++) {
              const item = column[j];
              if (item.src === null || item.type === null) continue; // 创建Tile

              const tile = new Node();
              const sprite = tile.addComponent(Sprite);
              const imgSrc = `tile (${item.src})`;
              sprite.spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0];
              const transform = tile.addComponent(UITransform);
              transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);
              tile.layer = Layers.Enum.UI_2D;
              tile.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
              tile.setParent(this.node);
            }
          }
        }
        /**
         * 官方为回调函数写法，不太好写，封装为 Promise
         */


        loadRes() {
          return new Promise((resolve, reject) => {
            resources.loadDir("texture/tile/tile", SpriteFrame, function (err, assets) {
              if (err) {
                reject(err);
                return;
              }

              resolve(assets);
            });
          });
        }

        start() {}

        update(deltaTime) {}

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9aad67e5e704de425cda3c296507eb1b9eeccf64.js.map