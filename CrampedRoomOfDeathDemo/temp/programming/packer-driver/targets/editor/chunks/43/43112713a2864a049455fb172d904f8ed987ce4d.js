System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, level1, _crd, levels;

  function _reportPossibleCrUseOfTILE_TYPE_ENUM(extras) {
    _reporterNs.report("TILE_TYPE_ENUM", "../Enums", _context.meta, extras);
  }

  function _reportPossibleCrUseOflevel(extras) {
    _reporterNs.report("level1", "./level01", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      level1 = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3838dqWFvFFSZCTql9D3KX7", "index", undefined);

      ;
      ; //TODO Record是啥

      levels = {
        level1: _crd && level1 === void 0 ? (_reportPossibleCrUseOflevel({
          error: Error()
        }), level1) : level1
      };
      /**
       * 统一导入关卡的入口
       */

      _export("default", levels);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=43112713a2864a049455fb172d904f8ed987ce4d.js.map