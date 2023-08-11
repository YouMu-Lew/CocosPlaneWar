const {ccclass, property} = cc._decorator;

@ccclass
export default class BgControl extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property(cc.Node)
    bg1:cc.Node = null;
    @property(cc.Node)
    bg2:cc.Node = null;
    start () {
        this.node.setPosition(0,0);
        this.bg1.setPosition(0,0);
        this.bg2.setPosition(0,651);
    }

    update (dt) {
        /*
        this.bg1.y -= 50 * dt;
        this.bg2.y -= 50 * dt;
        if(this.bg1.y < -650)
            this.bg1.y += 651 * 2;
        if(this.bg2.y < -650)
            this.bg2.y += 651 * 2;
        */
       for(let bg of this.node.children){
            bg.y -= 50 * dt;
            if(bg.y < -650)
                bg.y += 651 * 2;
       }
    }
}
