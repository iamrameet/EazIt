/// <reference path="data-manager.d.ts"/>
/// <reference path="C:/Users/r.a.m/Desktop/Workplace/chat-app/client/scripts/listener.js"/>
/// <reference path="C:/Users/r.a.m/Desktop/Workplace/chat-app/client/scripts/dom.js"/>

/** @template DataType */
class DataList{
  /** @type {DataType[]} */
  #list=[];
  /** @type {Number[]} */
  #selected=[];
  /** @type {[oldIndex:Number,item:DataType][]} */
  #filteredOut=[];
  #pointer=-1;
  canUndo=true;
  /** @type {[undo:function,redo:function][]} */
  #history=[];
  /** @type {[undo:function,redo:function][]} */
  #undoHistory=[];
  #listener=new Listeners(["add","remove","update","select","unselect","pointerMove"]);
  constructor(){}
  get pointer(){
    return this.#pointer;
  }
  set pointer(index){
    if(index>=this.#list.length)
      index=0;
    else if(index<0)
      index=this.#list.length-1;
    if(index>=-1 && index<this.#list.length){
      const oldIndex=this.#pointer;
      this.#pointer=index;
      this.#listener.trigger("pointerMove",index,oldIndex);
    }
  }
  /** @param {Number} index */
  get(index){
    return this.#list[index];
  }
  /** @param {(value: DataType, index: number, obj: DataType[])} predicate */
  has(predicate){
    return this.#list.findIndex(predicate) > -1;
  }
  /** @param {DataType} item */
  add(item,index=-1,canUndo=this.canUndo){
    if(index>=0)
      this.#list.splice(index,0,item);
    else
      index=this.#list.push(item)-1;
    this.#listener.trigger("add",item,index);
    if(canUndo){
      this.#history.push([
        ()=>this.remove(index,false),
        ()=>this.add(item,index,false)
      ]);
    }
    for(let i=index;i<this.#list.length;i++){
      this.update(i,this.#list[i]);
    }
  }
  /** @param {Number} index */
  remove(index,canUndo=this.canUndo){
    if(index>=0 && index<this.#list.length){
      const item=this.#list.splice(index,1)[0];
      this.unselect(index);
      this.#listener.trigger("remove",index);
      if(canUndo){
        this.#history.push([
          ()=>this.add(item,index,false),
          ()=>this.remove(index,false)
        ]);
      }
      for(let i=index;i<this.#list.length;i++){
        this.update(i,this.#list[i]);
      }
    }
  }
  update(index,item){
    if(index>=0 && index<this.#list.length){
      const oldItem=this.#list[index];
      this.#list[index]=item;
      this.unselect(index);
      this.#listener.trigger("update",index,item);
      // this.#history.push([
      //   ()=>this.update(index,oldItem),
      //   ()=>this.update(index,item)
      // ]);
    }
  }
  /** @param {Number} index */
  select(index){
    if(this.#list[index]){
      if(!this.#selected.includes(index)){
        this.#selected.push(index);
        this.#listener.trigger("select",index);
      }
      this.pointer=index;
    }
  }
  selectNext(clear=true){
    if(clear)
      this.clear();
    if(this.#pointer+1>this.#list.length-1)
      this.select(0);
    else
      this.select(this.#pointer+1);
  }
  selectPrev(clear=true){
    if(clear)
      this.clear();
    if(this.#pointer-1<0)
      this.select(this.#list.length-1);
    else
      this.select(this.#pointer-1);
  }
  /** @param {Number} index */
  unselect(index){
    if(this.#selected.includes(index)){
      this.#selected.splice(index,1);
      this.#listener.trigger("unselect",index);
    }
  }
  undo(){
    const actions=this.#history.pop();
    if(actions[0]){
      actions[0]();
      this.#undoHistory.push(actions);
    }
  }
  redo(){
    const actions=this.#undoHistory.pop();
    if(actions[1]){
      actions[1]();
      this.#history.push(actions);
    }
  }
  /** @param {Number} index */
  isSelected(index){
    return this.#selected.includes(index);
  }
  clear(){
    this.#selected.splice(0,this.#selected.length).forEach(index=>{
      this.#listener.trigger("unselect",index);
    });
  }
  /** @param {(item: DataType, index: number) DataType} predicate */
  filter(predicate){
    this.clearFiltered();
    let index=0;
    while(index<this.#list.length){
      const item=this.#list[index];
      if(!predicate(item,index)){
        this.#filteredOut.push([index,item]);
        this.remove(index);
      }else{
        index++;
      }
    }
  }
  clearFiltered(){
    this.#filteredOut.splice(0,this.#filteredOut.length).forEach(([index,item])=>{
      this.add(item,index);
    });
  }
  /** @param {(a: DataType, b: DataType) number} compareFn */
  sort(compareFn=(a,b)=>b-a){
    for(let i=0;i<this.#list.length-1;i++){
      for(let j=i+1;j<this.#list.length;j++){
        const a=this.#list[i];
        const b=this.#list[j];
        const compareValue=compareFn(a,b);
        if(compareValue<0){
          this.update(j,a);
          this.update(i,b);
        }
      }
    }
  }
  /** @type {<K extends keyof DataListAction>(type:K,action:DataListAction<DataType>[K])=>this} */
  on(type,action){
    this.#listener.on(type,action);
    return this;
  }
}

/** @template DataType */
class DataGroup{
  /** @type {Map<string, DataType>} */
  #group=new Map();
  /** @type {String} */
  #selected=null;
  #listener=new Listeners(["add","remove","select","unselect"]);
  add(id,data){
    this.#group.set(id,data);
    this.#listener.trigger("add",id,data);
  }
  remove(id){
    if(this.#group.delete(id))
      this.#listener.trigger("remove",id);
  }
  get(id){
    return this.#group.get(id);
  }
  has(id){
    return this.#group.has(id);
  }
  select(id){
    if(this.#group.has(id)){
      this.unselect(id);
      this.#selected=id;
      this.#listener.trigger("unselect",id);
    }
  }
  unselect(){
    const id=this.#selected;
    this.#selected=null;
    this.#listener.trigger("unselect",id);
  }
  on(type,action){
    this.#listener.on(type,action);
  }
}