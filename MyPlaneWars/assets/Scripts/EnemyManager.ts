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

        // 每隔0.5秒概率生成一个敌人
        this.schedule(()=>{
            if(Math.random() > 0.6)
                return;
            let enemy:cc.Node = cc.instantiate(this.fabEnemy);
            enemy.setParent(this.node);
            enemy.setPosition(Math.random() * 400,0);
        },0.5);
    }

    // update (dt) {}
}
