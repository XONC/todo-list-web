"use client";
import { createRef, RefObject, useEffect } from "react";

type CanvasRef = {
  ref: RefObject<HTMLCanvasElement>;
  rect: {
    width: number;
    height: number;
  };
  img: Record<string, any>;
  frame: number;
  scale: number;
  delay: number;
  callback: (
    gameSpeed: number,
    delay: number,
    x: number,
    y: number,
  ) => { x: number; y: number };
};

const img1 = require("@/style/imgs/enemy1.png").default;
const img2 = require("@/style/imgs/enemy2.png").default;
const img3 = require("@/style/imgs/enemy3.png").default;
const img4 = require("@/style/imgs/enemy4.png").default;
const img5 = require("@/style/imgs/layer-1.png").default;

class Enemy {
  private x: number;
  private y: number;
  private image: HTMLImageElement;
  private rect: {
    sx: number;
    sy: number;
    sWidth: number;
    sHeight: number;
    dx: number;
    dy: number;
    dWidth: number;
    dHeight: number;
  };
  private frame: number;
  private currentFrame: number;

  constructor(img, rect, frame, scale) {
    this.image = new Image();
    this.image.src = img.src;
    this.rect = rect;
    this.frame = frame;
    const width = img.width / frame;
    const height = img.height;
    this.rect.sWidth = width;
    this.rect.sHeight = height;
    this.rect.dWidth = width * scale;
    this.rect.dHeight = height * scale;
    this.currentFrame = 1;
  }

  update(gameSpeed, delay, callback: (gameSpeed, delay, x, y) => { x; y }) {
    this.currentFrame = Math.floor(gameSpeed / delay) % (this.frame - 1);
    const { x, y } = callback(gameSpeed, delay, this.rect.dx, this.rect.dy);
    this.rect.dx = x;
    this.rect.dy = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "red";
    ctx.strokeRect(
      this.rect.dx,
      this.rect.dy,
      this.rect.dWidth,
      this.rect.dHeight,
    );
    ctx.drawImage(
      this.image,
      this.rect.sWidth * this.currentFrame,
      this.rect.sy,
      this.rect.sWidth,
      this.rect.sHeight,
      this.rect.dx,
      this.rect.dy,
      this.rect.dWidth,
      this.rect.dHeight,
    );
  }
}

export default () => {
  const canvasRef1 = createRef<HTMLCanvasElement>();
  const canvasRef2 = createRef<HTMLCanvasElement>();
  const canvasRef3 = createRef<HTMLCanvasElement>();
  const canvasRef4 = createRef<HTMLCanvasElement>();
  const CANVAS_WIDTH = 350;
  const CANVAS_HEIGHT = 700;
  const enemiesLen = 1;
  const canvasRefs: CanvasRef[] = [
    {
      ref: canvasRef1,
      rect: {
        width: 50,
        height: 50,
      },
      img: img1,
      frame: 6,
      scale: 0.3,
      delay: 10,
      callback: img1Movement,
    },
    {
      ref: canvasRef2,
      rect: {
        width: 50,
        height: 50,
      },
      frame: 6,
      scale: 0.3,
      delay: 10,
      callback: img2Movement,
      img: img2,
    },
    {
      ref: canvasRef3,
      rect: {
        width: 50,
        height: 50,
      },
      frame: 6,
      scale: 0.3,
      delay: 10,
      callback: img3Movement,
      img: img3,
    },
    {
      ref: canvasRef4,
      rect: {
        width: 50,
        height: 50,
      },
      frame: 9,
      scale: 0.3,
      delay: 10,
      callback: img4Movement,
      img: img4,
    },
  ];
  let gameSpeed = 1;
  useEffect(() => {
    canvasRefs.forEach((target) => {
      if (target.ref.current) {
        const ctx = target.ref.current.getContext("2d");
        target.ref.current.width = CANVAS_WIDTH;
        target.ref.current.height = CANVAS_HEIGHT;
        const enemies = [];
        for (let i = 0; i < enemiesLen; i++) {
          let x = Math.random() * CANVAS_WIDTH;
          let y = Math.random() * CANVAS_HEIGHT;
          const enemy = new Enemy(
            target.img,
            {
              sx: 0,
              sy: 0,
              dx: x,
              dy: y,
            },
            target.frame,
            target.scale,
          );
          enemies.push(enemy);
        }

        changeAnimate(ctx, target, enemies);
      }
    });
  }, []);

  function changeAnimate(
    ctx: CanvasRenderingContext2D,
    target: CanvasRef,
    enemies: Enemy[],
  ) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enemies.forEach((enemy) => {
      enemy.draw(ctx);
      enemy.update(gameSpeed, 25, target.callback);
    });

    gameSpeed++;
    requestAnimationFrame(() => changeAnimate(ctx, target, enemies));
  }

  function img1Movement(gameSpeed, delay, x, y) {
    if (gameSpeed % 5 === 0) {
      x = x + Math.random() * 4 - 2;
      y = y + Math.random() * 4 - 2;
    }

    return {
      x,
      y,
    };
  }

  let angle = 0;
  function img2Movement(gameSpeed, delay, x, y) {
    if (gameSpeed % 10 === 0) {
      x = x - 3;
      // 让敌人正弦波移动
      y = y + Math.sin(angle) * 10;
      angle = angle + 0.2;
    }
    return {
      x,
      y,
    };
  }
  function img3Movement(gameSpeed, delay, x, y) {
    return {
      x,
      y,
    };
  }
  function img4Movement(gameSpeed, delay, x, y) {
    return {
      x,
      y,
    };
  }

  return (
    <div className={"full-page-no-padding"}>
      {canvasRefs.map((item, index) => {
        return (
          <canvas
            ref={item.ref}
            key={index}
            style={{
              display: "inline-block",
              border: "3px solid black",
              height: CANVAS_HEIGHT + "px",
              width: CANVAS_WIDTH + "px",
              marginRight: "10px",
            }}
          ></canvas>
        );
      })}
    </div>
  );
};
