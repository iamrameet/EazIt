class Component<ElementType>{
  id: String;
  element: ElementType;
  constructor(id:String,element:ElementType){
    this.id=id;
    this.element=element;
  }
}

class MyComponent extends Component<HTMLAnchorElement>{
  constructor(id: String){
    const element=DOM.create("a");
    super(id, element);
  }
}

const c1=new Component("c1",DOM.create("p"));
c1.element;
const c2=new MyComponent("c2");
c2.element;