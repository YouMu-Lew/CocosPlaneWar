System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform, levels, _dec, _class, _crd, ccclass, property, TILE_WIDTH, TILE_HEIGHT, TileMapManager;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
        init() {
          var _this = this;

          return _asyncToGenerator(function* () {
            var {
              mapInfo
            } = (_crd && levels === void 0 ? (_reportPossibleCrUseOflevels({
              error: Error()
            }), levels) : levels)["level" + 1];
            var spriteFrames = yield _this.loadRes();
            console.log(spriteFrames);

            for (var i = 0; i < mapInfo.length; i++) {
              var column = mapInfo[i];

              var _loop = function* _loop() {
                var item = column[j];
                if (item.src === null || item.type === null) return 1; // continue
                // 创建Tile

                var tile = new Node();
                var sprite = tile.addComponent(Sprite);
                var imgSrc = "tile (" + item.src + ")";
                sprite.spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0];
                var transform = tile.addComponent(UITransform);
                transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);
                tile.layer = Layers.Enum.UI_2D;
                tile.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
                tile.setParent(_this.node);
              };

              for (var j = 0; j < column.length; j++) {
                if (yield* _loop()) continue;
              }
            }
          })();
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