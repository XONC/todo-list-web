"use client";
import { createRef, useEffect } from "react";
const img1 = require("@/style/imgs/boom.png").default;
class Smoke {
  private image: HTMLImageElement;
  private frame: number;
  private dx: number;
  private dy: number;
  private dWidth: number;
  private dHeight: number;
  private sWidth: number;
  private sHeight: number;
  private sx: number;
  private sy: number;
  private scale: number;
  private currentFrame: number;
  private degree: number;

  constructor(img, x, y) {
    this.image = new Image();
    this.image.src = img.src;
    this.frame = 5;
    this.scale = 0.37;
    this.currentFrame = 0;
    const width = img.width / this.frame;
    const height = img.height;
    this.sx = 0;
    this.sy = 0;
    this.sWidth = width;
    this.sHeight = height;
    this.dx = x - (width * this.scale) / 2;
    this.dy = y - (height * this.scale) / 2;
    this.dWidth = width * this.scale;
    this.dHeight = height * this.scale;
    this.degree = Math.random() * 360;
    // this.degree = 30
  }

  update(gameFrame, delay) {
    if (gameFrame % 10 === 0) {
      this.currentFrame = Math.floor(gameFrame / delay) % this.frame;
      if (this.currentFrame === this.frame - 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.dx, this.dy);
    ctx.rotate((this.degree * Math.PI) / 180);

    ctx.drawImage(
      this.image,
      this.sWidth * this.currentFrame,
      this.sy,
      this.sWidth,
      this.sHeight,
      0 - this.dWidth / 2,
      0 - this.dHeight / 2,
      this.dWidth,
      this.dHeight,
    );
    ctx.restore();
  }
}

export default () => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 700;
  let gameFrame = 0;

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = CANVAS_WIDTH;
      canvasRef.current.height = CANVAS_HEIGHT;
      const rect = canvasRef.current.getBoundingClientRect();
      const smokes = [];

      window.addEventListener("click", (e) => {
        const smoke = new Smoke(img1, e.x - rect.left, e.y - rect.top);
        smokes.push(smoke);
      });

      window.addEventListener("mousemove", (e) => {
        const smoke = new Smoke(img1, e.x - rect.left, e.y - rect.top);
        smokes.push(smoke);
      });

      changeAnimate(ctx, smokes);
    }
  }, []);

  function changeAnimate(ctx: CanvasRenderingContext2D, smokes: Smoke[]) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    smokes.forEach((smoke, index) => {
      if (smoke.update(gameFrame, 20)) {
        smokes.splice(index, 1);
      }
      smoke.draw(ctx);
    });

    gameFrame++;
    requestAnimationFrame(() => changeAnimate(ctx, smokes));
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        className={"absolute-center"}
        style={{
          display: "inline-block",
          border: "3px solid black",
          height: CANVAS_HEIGHT + "px",
          width: CANVAS_WIDTH + "px",
          marginRight: "10px",
          background: "black",
        }}
      ></canvas>
    </div>
  );
};
