import * as PIXI from "pixi.js";
import { Live2DModel } from "../libs/pixi-live2d/cubism4.es.js";

console.log("PixiJS version:", PIXI.VERSION);

// Hiển thị ảnh bàn phím
const keyImage = document.getElementById("key-image");

function showKeyImage(key) {
  const keyMap = {
    "a": "KeyA.png",
    "d": "KeyD.png",
    "e": "KeyE.png",
    "q": "KeyQ.png",
    "r": "KeyR.png",
    "w": "KeyW.png",
    " ": "Space.png",
    "1": "Num1.png",
    "2": "Num2.png",
    "3": "Num3.png",
    "4": "Num4.png",
    "5": "Num5.png",
    "6": "Num6.png",
    "7": "Num7.png",
  };

  const filename = keyMap[key.toLowerCase()];
  if (filename) {
   keyImage.src = `/live2d/bangocat-model/resources/left-keys/${filename}`;
    keyImage.style.display = "block";
    setTimeout(() => {
      keyImage.style.display = "none";
    }, 1500);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const app = new PIXI.Application({
    view: document.getElementById("live2d-canvas"),
    backgroundAlpha: 0,
    antialias: true,
    autoStart: true,
    width: 800,
    height: 800,
  });

  const model = await Live2DModel.from("/live2d/bangocat-model/cat.model3.json", {
    autoUpdate: true,
    ticker: app.ticker,
  });

  model.scale.set(0.3);
  model.position.set(400, 600);
  model.anchor.set(0.5, 1);
  model.eventMode = "dynamic";11
  model.interactive = true;
  model.cursor = "pointer";

  app.stage.addChild(model);

  // Di chuyển chuột → focus mắt
  model.on("pointermove", (e) => {
    const x = e.global.x / app.renderer.width;
    const y = e.global.y / app.renderer.height;
    model.focus?.(x, y);
  });

  // Click chuột → chạy motion ngẫu nhiên
  model.on("pointerdown", () => {
    model.internalModel.motionManager.startRandomMotion("CAT_motion", 1);
  });

  // Bàn phím → biểu cảm, motion, ảnh bàn phím
  document.addEventListener("keydown", (e) => {
    showKeyImage(e.key);

    switch (e.key) {
      case "1":
        model.internalModel.expressionManager.setExpression("exp_1.exp3.json");
        break;
      case "2":
        model.internalModel.expressionManager.setExpression("live2d_expression1.exp3.json");
        model.internalModel.coreModel.setPartOpacity("Part8", 1);
        break;
      case "3":
        model.internalModel.expressionManager.setExpression("live2d_expression2.exp3.json");
        model.internalModel.coreModel.setPartOpacity("Part10", 1);
        break;
      case "4":
        model.internalModel.motionManager.startMotion("CAT_motion", 0, "live2d_motion1.motion3.json");
        break;
      case "5":
        model.internalModel.motionManager.startMotion("CAT_motion", 1, "live2d_motion2.motion3.json");
        break;
      case "0":
        model.internalModel.expressionManager.setExpression("live2d_expression0.exp3.json");
        model.internalModel.coreModel.setPartOpacity("Part8", 0);
        model.internalModel.coreModel.setPartOpacity("Part10", 0);
        break;
    }
  });
});