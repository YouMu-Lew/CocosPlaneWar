const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.setPosition(0,-270)
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.node.setPosition(event.getLocationX()-240,event.getLocationY()-320);
        });
    }

    // update (dt) {}
}
