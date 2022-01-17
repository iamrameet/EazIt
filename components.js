/// <reference path="C:/Users/r.a.m/Desktop/Workplace/chat-app/client/scripts/listener.js"/>
/// <reference path="C:/Users/r.a.m/Desktop/Workplace/chat-app/client/scripts/dom.js"/>
/// <reference path="C:/Users/r.a.m/Desktop/Workplace/chat-app/client/scripts/ui-handler.js"/>

/** @extends {UIHandler.Component<HTMLDivElement>} */
class Container extends UIHandler.Component{
  /**
   * Creates a Container UI Component
   * @param {String} id Component's ID */
  constructor(id){
    const element=DOM.create("div",{
      class:"container"
    });
    super(id,element);
  }
}

/** @extends {UIHandler.Component<HTMLButtonElement>} */
class Button extends UIHandler.Component{
  /**
   * Creates a Button UI Component
   * @param {String} id Component's ID
   * @param {DOMAttributes} attributes
   * @param {DOMEvents} events */
  constructor(id,attributes={},events={}){
    const element=DOM.create("button",attributes,{},events);
    super(id,element);
  }
}

const b=new Button("b1",{
  value:"submit"
},{
  click(event){
    console.log(b.id,"clicked");
  }
});

const ui=new UIHandler();
ui.addComponent(b);