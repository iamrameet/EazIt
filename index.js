
/** @type {DataList<Number>} */
const list=new DataList();
const group=new DataGroup();

const ol=DOM.create("ol",{
  tabindex:0,
  autofocus:true
},{},{
  keydown(event){
    switch(event.key){
      case "ArrowUp":
        list.pointer--;
        break;
      case "ArrowDown":
        list.pointer++;
        break;
    }
  }
});
document.body.appendChild(ol);

list.on("add",(data,index)=>{
  const li=DOM.create("li",{
    tabindex:0,
    text:`[${index}] : ${data}`,
    index
  },{
    listStyle:"none",
    userSelect:"none",
    width:"240px",
    padding:"0.5em"
  },{
    click(event){
      const selected=list.isSelected(parseInt(li.getAttribute("index")));
      if(!event.shiftKey)
        list.clear();
      if(!selected)
        list.select(parseInt(li.getAttribute("index")));
    },
    dblclick(){
      list.remove(parseInt(li.getAttribute("index")));
    },
    focus(){
      list.pointer=parseInt(li.getAttribute("index"));
    },
    keyup(event){
      if(event.code==="NumpadEnter" || event.code==="Enter" || event.code==="Space")
        list.select(parseInt(li.getAttribute("index")));
    }
  });
  if(ol.children.length===0 || index<=0)
    ol.appendChild(li);
  else
    ol.children[index-1].after(li);
}).on("remove",index=>{
  ol.children[index].remove();
}).on("update",(index,item)=>{
  DOM.attr(ol.children[index],{
    text:`[${index}] : ${item}`,
    index
  });
}).on("select",index=>{
  ol.children[index].style.color="red";
}).on("unselect",index=>{
  ol.children[index].style.color="black";
}).on("pointerMove",(newIndex,oldIndex)=>{
  if(newIndex>=0)
    ol.children[newIndex].focus();
});

[10,259,65,4,548,718,71,583,19,2].forEach(number=>{
  list.add(number);
});

list.sort((a,b)=>b-a);
list.filter(value=>value>4);