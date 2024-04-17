import { _decorator, Component, Node, Button, Tween, tween, Vec3, NodeEventType, Sprite, Color, Label, EditBox, Layout, instantiate, SpriteFrame, resources } from 'cc';
import { AnimationButton } from './AnimationButton';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
     @property({ type: Button, displayName: "动画按钮" })
     ani_button: Button = null;

     @property({ type: Button, displayName: "显示动画按钮" })
     show_button: Button = null;

     @property({ type: Button, displayName: "计算数组和" })
     arr_button: Button = null;

     @property({ type: Label, displayName: "计算数组和结果" })
     lb_arr_res: Label = null;

     @property({ type: EditBox, displayName: "X概率" })
     edit_x: EditBox = null;

     @property({ type: EditBox, displayName: "Y概率" })
     edit_y: EditBox = null;

     @property({ type: Layout, displayName: "矩阵跟节点" })
     layout: Layout = null;

     @property({ type: Node, displayName: "模板节点" })
     sp_temp: Node = null;

     @property({ type: Button, displayName: "矩阵生成按钮" })
     btn_create: Button = null;

     private animation_button: AnimationButton;

     private _mapPic: Map<string, SpriteFrame> = new Map<string, SpriteFrame>();

     private item_img: Array<string> = [
          "bean_blue",
          "bean_green",
          "bean_orange",
          "bean_pink",
          "bean_purple",
     ]

     private item_pro: Array<number> = [20, 20, 20, 20, 20];

     start() {
          this.sp_temp.active = false;
          this.ani_button.node.active = false;
          this.animation_button = this.ani_button.node.addComponent(AnimationButton);
          this.animation_button.addButtonEvent(()=>{
               console.log("=======================按钮点击=====================");
          });
          this.addBtnEvent(this.show_button, "onShowButton");
          this.addBtnEvent(this.arr_button, "onClickArrButton");
          this.addBtnEvent(this.btn_create, "onClickCraeteButton");
     }

     private onShowButton(){
          this.animation_button.onShowButton();
     }


      public addBtnEvent(_btn: Button,  _handler: string, _customEventData: string = "") {
           if (_btn == null) {
               return;
           }
           var clickEventHandler = new Component.EventHandler();
           clickEventHandler.target = this.node;
           clickEventHandler.component = "Main"; 
           clickEventHandler.handler = _handler; 
           clickEventHandler.customEventData = _customEventData;
           _btn.clickEvents.length = 0; 
           _btn.clickEvents.push(clickEventHandler);
     }

     private onClickArrButton(){
        let res = this.checkArrAdd();
        this.lb_arr_res.string = `数组计算结果：${res}`;
     }

  /**
   * 时间复杂度：O(n)
   * @returns 
   */
     private checkArrAdd(){
        let arr_1 = [10, 40, 5, 280];
        let arr_2 = [234, 5, 2, 148, 23];
        let temp_map: Map<number, boolean> = new Map();
        let num = 42;
        for (let index = 0, len = arr_1.length; index < len; index++) {
             let item = arr_1[index];
             temp_map.set(num - item, true);
        }
        for (let index = 0, len = arr_2.length; index < len; index++) {
             let item2 = arr_2[index];
             if(temp_map.get(item2)){
                  return true;
             }
        }
        return false;
     }

     private onClickCraeteButton(){
        let x = this.edit_x.string;
        let y = this.edit_y.string;
        if(!x || x==""){
             console.log("概率X输入错误");
             return;
        }
        if(!y || y==""){
             console.log("概率X输入错误");
             return;
        }
        this.createItemArr();

     }

     private createItemArr(){
          let arr_res: Array<Array<number>> = new Array();
          this.layout.node.removeAllChildren();
          //插入第一个
          for (let m = 0; m < 10; m++) {
               if(!arr_res[m]){
                    arr_res.push(new Array())
               }
               for (let n = 0; n < 10; n++) {
                    let pro_arr = this.getItemProArr(arr_res, m, n);
                    let color_index = this.getColorIndex(pro_arr);
                    arr_res[m].push(color_index);
                    let item = instantiate(this.sp_temp);
                    this.loadPic(`${this.item_img[color_index]}/spriteFrame`, item.getComponent(Sprite));
                    item.active = true;
                    item.parent = this.layout.node;
               }
          }
          this.layout.updateLayout();
     }

     private getColorIndex(pro_arr: Array<number>): number{
          let index = Math.floor(Math.random() * 100);
          let res = 0;
          let all_add = 0;
          for (let i = 0; i < pro_arr.length; i++) {
               let pre_num = pro_arr[i - 1] || 0;
               all_add = pre_num + all_add;
               let max_num = all_add + pro_arr[i];
               if(index <= max_num){
                    res = i;
                    break;
               }
          }
          return res;
     }

     private getItemProArr(arr_cur: Array<Array<number>>, index_x: number, index_y: number){
          if(index_x == 0 && index_y == 0){
               return this.item_pro;
          }
          let x = Number(this.edit_x.string);
          let y = Number(this.edit_y.string);
          let arr: Array<number> = new Array();
          let cur_pro = 0;
          let condition_1 = arr_cur[index_x] && arr_cur[index_x][index_y - 1] != null ? arr_cur[index_x][index_y - 1] : null;
          let condition_2 = arr_cur[index_x -1] && arr_cur[index_x -1][index_y] != null ? arr_cur[index_x -1][index_y] : null;
          if(condition_1 != null){
               arr[arr_cur[index_x][index_y - 1]] = this.item_pro[arr_cur[index_x][index_y - 1]] + x;
               cur_pro += arr[arr_cur[index_x][index_y - 1]];
          }
          if(condition_2 != null){
               arr[arr_cur[index_x -1][index_y]] = this.item_pro[arr_cur[index_x -1][index_y]] + x;
               cur_pro += arr[arr_cur[index_x -1][index_y]];
          }
          if(condition_1 != null && condition_2 != null){
               arr[arr_cur[index_x -1][index_y]] = this.item_pro[arr_cur[index_x -1][index_y]] + y;
               cur_pro += arr[arr_cur[index_x -1][index_y]];
          }
          if(cur_pro >= 100){
               cur_pro = 90;
          }
          let other_pro = (100 - cur_pro) / 4;
          for (let index = 0; index < this.item_pro.length; index++) {
               if(!arr[index]){
                    arr[index] = other_pro;
               }
          }
          return arr;
     }

     private loadPic(_url: string, sp: Sprite = null) {
          if (this._mapPic.has(_url)) {
               if (sp != null) {
                    sp.spriteFrame = this._mapPic.get(_url);
               }
          } else {
               let self = this;
               resources.load(
                    _url,
                    SpriteFrame,
                    null,
                    (err, res) => {
                         if (err) {
                              console.log("资源找不到", _url);
                              return;
                         }
                         self._mapPic.set(_url, res);
                         if (sp != null) {
                              sp.spriteFrame = res;
                         }
                    }
                );
          }
      }
}