const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property(cc.Prefab)
    bulletFab:cc.Prefab = null;
    @property
    shootInterval:number = 0.5;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.setPosition(0,-270);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.node.setPosition(event.getLocationX()-240,event.getLocationY()-320);
        });

        // 加载子弹音效
        let bulletPlayer : cc.AudioSource = this.getComponent(cc.AudioSource);
        cc.loader.loadRes("shootSound", cc.AudioClip,(err,clip)=>{
            bulletPlayer.clip = clip;
            bulletPlayer.volume = 0.3;
            bulletPlayer.loop = false;
        });

        // 生成子弹
        this.schedule(()=>{
            let bullet = cc.instantiate(this.bulletFab);
            bullet.setParent(this.node.parent);
            bullet.setPosition(this.node.x,this.node.y + 25);
            //console.log("生成子弹");
            bulletPlayer.play();
        },this.shootInterval);
    }

    // update (dt) {}
    
    onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.node.setPosition(event.getLocationX()-240,event.getLocationY()-320);
        });
    }
    
    die(){
        this.node.destroy();
    }
}
