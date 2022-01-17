interface DataListAction<DataType>{
  add(item:DataType,index:Number):void,
  remove(index:Number):void,
  update(index:Number,new_item:DataType):void,
  select(index:Number):void,
  unselect(index:Number):void,
  cursorMove(old_index:Number,new_index:Number):void
}