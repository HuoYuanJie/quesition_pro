import { _decorator, Component, Node, Button, Tween, tween, Vec3, NodeEventType, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('AnimationButton')
export class AnimationButton extends Component {

    
    private buttonClickCall: (t: Touch) => void = null;

    start() {
        this.node.on(NodeEventType.TOUCH_START,this.onButtonPress.bind(this));
        this.node.on(NodeEventType.TOUCH_END,this.onButtonEnd.bind(this));
        this.node.on(NodeEventType.TOUCH_CANCEL,this.onButtonEnd.bind(this));
    }

    onDestroy() {
        this.node.off(NodeEventType.TOUCH_START,this.onButtonPress.bind(this));
        this.node.off(NodeEventType.TOUCH_END,this.onButtonEnd.bind(this));
        this.node.off(NodeEventType.TOUCH_CANCEL,this.onButtonEnd.bind(this));
    }

    public addButtonEvent(onceClickHandler: (t: Touch) => void){
        this.buttonClickCall = onceClickHandler;
    }
    

    public onShowButton(){
        let node = this.node.getChildByName("icon");
        this.node.active = true;
        node.scale = new Vec3(0.1, 0.1, 1);
        let ani_time = 0.2;
        Tween.stopAllByTarget(node);
        tween(node)
            .to(ani_time, {scale: new Vec3(1.0, 1.0, 1.0)})
            .sequence(
                tween().to(ani_time / 4, {angle:3}, {easing: "backInOut"}),
                tween().to(ani_time / 4, {angle:-3}, {easing: "backInOut"}),
                tween().to(ani_time / 4, {angle:0}, {easing: "backInOut"})

            )
            .call(()=>{
                this.addButtonNormalAnimation();
            })
            .start();
    }

/** 添加按钮常态效果 */
private addButtonNormalAnimation(){
    let node = this.node.getChildByName("icon");
    Tween.stopAllByTarget(node);
    this.node.active = true;
    let old_scale = node.scale;
    let ani_time = 0.4;
    let change_num = 0.04;
    tween(node)
        .repeatForever(tween()
            .to(ani_time, {scale: new Vec3(old_scale.x - change_num, old_scale.y + change_num, 1)})
            .to(ani_time, {scale: new Vec3(old_scale.x + change_num, old_scale.y - change_num, 1)}))
        .start();
}

private addButtonToPressAnimation(){
    let node = this.node.getChildByName("icon");
    node.scale = new Vec3(1.0, 1.0, 1.0);
    Tween.stopAllByTarget(node);
    tween(node)
        .to(0.1, {scale: new Vec3(0.7, 0.7, 1)})
        .call(()=>{
            this.addButtonNormalAnimation();
        })
        .start();
}

    private addButtonPressToEndAnimation(){
        let node = this.node.getChildByName("icon");
        Tween.stopAllByTarget(node);
        tween(node)
            .to(0.1, {scale: new Vec3(1.0, 1.0, 1)})
            .call(()=>{
                this.addButtonNormalAnimation();
            })
            .start();
    }

    private onButtonPress(){
        let node = this.node.getChildByName("icon");
        let sp = node.getComponent(Sprite)
        sp.color = new Color(100, 100, 100, 255);
        this.addButtonToPressAnimation();
    }

    private onButtonEnd(event){
        let node = this.node.getChildByName("icon");
        let sp = node.getComponent(Sprite)
        sp.color = new Color(255, 255, 255, 255);
        this.addButtonPressToEndAnimation();
        if(this.buttonClickCall){
            this.buttonClickCall(event);
        }
        console.log("button clicked");
    }
}