import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyControl extends cc.Component {
    isDead:boolean = false;

    @property
    enemySpeed:number = 300;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    update (dt) {
        if(this.isDead == false)
            this.node.y -= this.enemySpeed * dt;

        if(this.node.y < -700)
            this.node.destroy();
    }

    onDestroy(): void {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    }

    //碰撞检测回调函数
    onCollisionEnter(other:cc.Collider,self){
        console.log(other.tag + " on collision enter " + self.tag);

        if(other.tag == 0)//Player
            other.getComponent(Player).die();
        if(other.tag == 1)//Bullet
            other.destroy();
        this.isDead = true;
        this.die();
    }

    die(){
        this.node.destroy();
    }
}
