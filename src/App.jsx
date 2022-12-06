import React, { useState } from 'react';
import './App.css'
import { fabric } from 'fabric';
import { useEffect } from 'react';
import 'fabric-history';

function App() {
  const [canvas, setCanvas] = useState(null);

  let test = "https://www.humanesociety.org/sites/default/files/styles/1240x698/public/2022-10/dog-583007.jpg?h=c6dbd090&itok=uY9_vnXo";
  let backImg = new Image();
  backImg.src = test;

  const initCanvas = () => {
    return new fabric.Canvas('canvas', {
      height: 800,
      width: 800,
      backgroundColor: "whitesmoke",
      backgroundImage: new fabric.Image(backImg)
    });
  }

  let deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
  let img = new Image();
  img.src = deleteIcon;

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = "blue";
  fabric.Object.prototype.cornerStyle = "circle";

  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: 16,
    cursorStyle: "pointer",
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 24,
  });

  function deleteObject (eventData, transform) {
    let target = transform.target;
    let canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  }

  function renderIcon (ctx, left, top, styleOverride, fabricObject) {
    let size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  const add = () => {
    let rect = new fabric.Rect({
      left: 100,
      top: 50,
      fill: "yellow",
      width: 200,
      height: 100,
      objectCaching: false,
      stroke: "lightgreen",
      strokeWidth: 4,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
  }

  /* 이미지 업로드 기능이 되는지 테스트 정도
  주소가 동적이지는 않다. */
  const upLoad = () => {
    return new fabric.Image.fromURL('https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg', image => {
      image.scale(0.75);
      canvas.add(image);
      canvas.renderAll();
    });
  }

  /* 이미지 업로드가 되도록 작성됨
  주소와 결과 모두가 동적이다. */
  const handleImage = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      new fabric.Image.fromURL(reader.result, image => {
        image.scale(0.75);
				canvas.add(image);
				canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  }

  /* 테스트 용 useEffect */
  useEffect(() => {
    if(canvas != null) {
      add();
    }
  }, [canvas]);

  return (
    <div className="App">
      <button onClick={() => {add()}}>add</button>
      <button onClick={() => {upLoad()}}>upload?</button>

      {/* 이전 단계로, 했던 단계로에 해당하는 버튼들 */}
      <button onClick={() => {canvas.undo()}}>undo</button>
      <button onClick={() => {canvas.redo()}}>redo</button>

      {/* input type=file accept="image/*" 으로 파일을 받도록 했고
      onChange 이벤트로 연결하기 */}
      <input id="filereader" type="file" accept="image/*" onChange={(event) => {handleImage(event)}} />
      <canvas id='canvas'></canvas>
    </div>
  )
}

export default App
