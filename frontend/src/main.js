import * as PIXI from "pixi.js";
import { Live2DModel } from "../libs/pixi-live2d/cubism4.es.js";

console.log("PixiJS version:", PIXI.VERSION);

const keyImage = document.getElementById("key-image");
const keyImageContainer = document.getElementById("key-image-container");

function showKeyImage(key) {
  const keyMap = {
    "a": "KeyA.png", "d": "KeyD.png", "e": "KeyE.png", "q": "KeyQ.png",
    "r": "KeyR.png", "w": "KeyW.png", " ": "Space.png",
    "1": "Num1.png", "2": "Num2.png", "3": "Num3.png",
    "4": "Num4.png", "5": "Num5.png", "6": "Num6.png", "7": "Num7.png",
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

  app.ticker.start();

  const background = PIXI.Sprite.from("/live2d/bangocat-model/resources/background.png");
  background.anchor.set(0.5);
  background.position.set(app.renderer.width / 2, app.renderer.height / 2);
  background.zIndex = 0;
  app.stage.addChild(background);

  const model = await Live2DModel.from("/live2d/bangocat-model/cat.model3.json", {
    autoUpdate: true,
    ticker: app.ticker,
  });

  model.scale.set(0.8);
  model.position.set(0, 0);
  model.anchor.set(0.5, 1);
  model.eventMode = "none";

  const modelContainer = new PIXI.Container();
  modelContainer.position.set(app.renderer.width / 2, app.renderer.height * 0.685);
  modelContainer.zIndex = 5;
  modelContainer.addChild(model);
  app.stage.addChild(modelContainer);

  const hitArea = new PIXI.Graphics();
  hitArea.beginFill(0x000000, 0);
  hitArea.drawRect(0, 0, app.renderer.width, app.renderer.height);
  hitArea.endFill();
  hitArea.eventMode = "static";
  hitArea.cursor = "pointer";
  hitArea.zIndex = 100;
  app.stage.addChild(hitArea);

  app.stage.sortChildren();

  // 🐭 Di chuyển mèo theo chuột + mắt nhìn theo
  let targetX = modelContainer.position.x;
  let targetY = modelContainer.position.y;

  hitArea.on("pointermove", (e) => {
    targetX = e.global.x;
    targetY = e.global.y;

    model.focus?.(targetX / app.renderer.width, targetY / app.renderer.height);
  });

  app.ticker.add(() => {
    modelContainer.position.x += (targetX - modelContainer.position.x) * 0.05;
    modelContainer.position.y += (targetY - modelContainer.position.y) * 0.05;

    // ✅ Tinh chỉnh vị trí ảnh để khớp với tay mèo
    const offsetX = -110; // lệch trái
    const offsetY = -340; // lệch lên
    keyImageContainer.style.left = `${modelContainer.position.x + offsetX}px`;
    keyImageContainer.style.top = `${modelContainer.position.y + offsetY}px`;
  });

  // 👆 Click chuột → motion ngẫu nhiên
  hitArea.on("pointerdown", () => {
    model.internalModel.motionManager.startRandomMotion("CAT_motion", 1);
  });

  // ⌨️ Bàn phím → biểu cảm, motion, ảnh bàn phím
  document.addEventListener("keydown", (e) => {
    showKeyImage(e.key);

    const im = model.internalModel;
    if (!im || !im.expressionManager || !im.motionManager || !im.coreModel) return;

    switch (e.key) {
      case "1":
        im.expressionManager.setExpression("exp_1.exp3.json");
        break;
      case "2":
        im.expressionManager.setExpression("live2d_expression1.exp3.json");
        im.coreModel.setPartOpacity("Part8", 1);
        break;
      case "3":
        im.expressionManager.setExpression("live2d_expression2.exp3.json");
        im.coreModel.setPartOpacity("Part10", 1);
        break;
      case "4":
        im.motionManager.startMotion("CAT_motion", 0, "live2d_motion1.motion3.json");
        break;
      case "5":
        im.motionManager.startMotion("CAT_motion", 1, "live2d_motion2.motion3.json");
        break;
      case "0":
        im.expressionManager.setExpression("live2d_expression0.exp3.json");
        im.coreModel.setPartOpacity("Part8", 0);
        im.coreModel.setPartOpacity("Part10", 0);
        break;
    }
  });
});