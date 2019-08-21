import "./main.html";
import { Legos } from "../both/collection";
const BOX_SIZE = 0.5;
const COLORS = ["0.2,0.2,0.2", "0.5,0.5,0.5", "0.7,0.7,0.7", "0.9,0.9,0.9"];
let colorIndex = 0;

Template.x3d.helpers({
  boxesCount: function () {
    return Legos.find().count();
  },
  legos: function () {
    return Legos.find();
  }
});

Template.x3d.events({
  "mouseup #surface,.lego-block": function (event, templateInstance) {
    templateInstance.mouseDown = false;
    if (templateInstance.mouseMoved)
      return;

    templateInstance.mouseMoved = false;

    if(event.button === 2){
      Meteor.call("removeLego", event.target.id);
      return;
    }

    const onPlane = event.currentTarget.dataset.type === "plane";
    addLego(event, onPlane);
  },
  "mousedown transform": function (event, templateInstance) {
    templateInstance.mouseDown = true;
  },
  "mousemove transform": function (event, templateInstance) {    
    if(templateInstance.mouseDown){
      templateInstance.mouseMoved = true;
      return;
    }

    templateInstance.mouseMoved = false;
  }
});

function addLego(event, onPlane){
  let coordinates, color = COLORS[colorIndex];

  if(onPlane){
    coordinates = event.hitPnt.map( point => point.toFixed(1));
    coordinates[2] = 0.0;
  }else{
    const boxTransform = event.currentTarget.parentNode.parentNode;

    let [wx, wy, wz] = boxTransform.getAttribute("translation").split(",").map( point => Number.parseFloat( Number.parseFloat(point).toFixed(1) ));

    let [x, y, z] = event.hitPnt.map(point => Number.parseFloat( point.toFixed(1)) );

    //adjust x,y,z positions to align with the clicked blocked
    if(z < wz){
      z = wz;
    }else if( z > wz ){
      z = wz + BOX_SIZE;
    }

    if(wx < x){
      x = wx + BOX_SIZE;
    }else if( wx > x ){
      x = wx - BOX_SIZE;
    }

    if(wy < y){
      y = wy + BOX_SIZE;
    }else if( wy > y ){
      y = wy - BOX_SIZE;
    }

    coordinates = [x.toFixed(1), y.toFixed(1), z.toFixed(1)];
  }  

  coordinates = coordinates.join(",");
  const opts = { coordinates, color };
  colorIndex += 1;

  if (colorIndex === COLORS.length) {
    colorIndex = 0;
  }

  Meteor.call("addLego", opts );
}