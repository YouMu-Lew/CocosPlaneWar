const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletControl extends cc.Component {

    @property
    bulletSpeed : number = 200;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }

    update (dt) {
        this.node.y += this.bulletSpeed * dt;
    }
}
