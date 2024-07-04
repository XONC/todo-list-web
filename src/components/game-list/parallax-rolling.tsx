"use client";
import { createRef, useEffect, useState } from "react";
const img1 = require("@/style/imgs/layer-1.png").default;
const img2 = require("@/style/imgs/layer-2.png").default;
const img3 = require("@/style/imgs/layer-3.png").default;
const img4 = require("@/style/imgs/layer-4.png").default;
const img5 = require("@/style/imgs/layer-5.png").default;
class Layer {
  static CANVAS_WIDTH = 800;
  static CANVAS_HEIGHT = 700;
  static BASE_SPEED = 1;

  private image: HTMLImageElement;
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private x1: number;
  private speed: number;
  private imgWidth: number;

  constructor(ctx, img, speed) {
    this.image = new Image();
    this.imgWidth = img.width;
    this.image.src = img.src;
    this.ctx = ctx;
    this.x = 0;
    this.speed = speed * Layer.BASE_SPEED;
  }

  update() {
    if (this.x <= -this.imgWidth) {
      this.x = 0;
    } else {
      this.x = this.x - this.speed;
    }
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, 0);
    this.ctx.drawImage(this.image, this.x + this.imgWidth, 0);
  }
}

export default () => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const CANVAS_WIDTH = Layer.CANVAS_WIDTH;
  const CANVAS_HEIGHT = Layer.CANVAS_HEIGHT;

  const [rangeValue, setRangeValue] = useState(1);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = CANVAS_WIDTH;
      canvasRef.current.height = CANVAS_HEIGHT;

      const layer1 = new Layer(ctx, img1, 0.2);
      const layer2 = new Layer(ctx, img2, 0.4);
      const layer3 = new Layer(ctx, img3, 0.6);
      const layer4 = new Layer(ctx, img4, 0.8);
      const layer5 = new Layer(ctx, img5, 1);

      changeAnimate(ctx, [layer1, layer2, layer3, layer4, layer5]);
    }
  }, []);

  function changeAnimate(ctx: CanvasRenderingContext2D, layers: Layer[]) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    layers.forEach((layer) => {
      layer.update();
      layer.draw();
    });

    requestAnimationFrame(() => changeAnimate(ctx, layers));
  }

  return (
    <div
      style={{
        background: "black",
        width: "100vw",
        height: "100vh",
      }}
    >
      <canvas
        style={{
          position: "absolute",
          border: "3px solid white",
          width: "800px",
          height: "700px",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
        }}
        ref={canvasRef}
      ></canvas>

      <div>
        <label>调节速度</label>
        <input
          type={"range"}
          min={1}
          max={50}
          value={rangeValue}
          onChange={(e) => setRangeValue(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};
