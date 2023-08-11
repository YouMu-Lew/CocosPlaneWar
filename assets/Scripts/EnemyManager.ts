const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyManager extends cc.Component {

    @property(cc.Prefab)
    fabEnemy : cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.destroyAllChildren();
        this.node.setPosition(-200,360);

        // 每隔1秒生成一个敌人
        this.schedule(()=>{
            let enemy:cc.Node = cc.instantiate(this.fabEnemy);
            enemy.setParent(this.node);
            enemy.setPosition(Math.random() * 400,0);
        },1);

    }

    // update (dt) {}
}
