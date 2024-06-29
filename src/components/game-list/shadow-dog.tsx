"use client";
import shadowDog from "@/style/game-list/index.module.css";
import { createRef, useEffect, useState } from "react";
const shadowPng = require("@/style/imgs/shadow_dog.png").default.src;
export default () => {
  let animate = "idle";
  const canvasRef = createRef<HTMLCanvasElement>();
  const IMAGE_WIDTH = 575;
  const IMAGE_HEIGHT = 523;
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 600;
  // 错开帧
  const staggerFrame = 7;
  // 当前帧
  let gameFrame = 1;

  // 图片各个动画的信息
  const spriteAnimation: Record<
    string,
    {
      name: string;
      loc: Array<{
        width: number;
        height: number;
      }>;
    }
  > = {};
  const animationState = [
    {
      name: "idle",
      frames: 7,
    },
    {
      name: "jump",
      frames: 7,
    },
    {
      name: "fall",
      frames: 7,
    },
    {
      name: "run",
      frames: 9,
    },
    {
      name: "dizzy",
      frames: 11,
    },
    {
      name: "sit",
      frames: 5,
    },
    {
      name: "roll",
      frames: 7,
    },
    {
      name: "bite",
      frames: 7,
    },
    {
      name: "ko",
      frames: 12,
    },
    {
      name: "getHit",
      frames: 4,
    },
  ];

  animationState.forEach((state, index) => {
    spriteAnimation[state.name] = {};
    spriteAnimation[state.name]["loc"] = [];
    spriteAnimation[state.name]["name"] = state.name;
    for (let i = 0; i < state.frames; i++) {
      spriteAnimation[state.name]["loc"].push({
        width: IMAGE_WIDTH * i,
        height: IMAGE_HEIGHT * index,
      });
    }
  });

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = CANVAS_WIDTH;
      canvasRef.current.height = CANVAS_HEIGHT;

      const img = new Image();
      img.src = shadowPng;

      animation(ctx, img);
    }
  }, []);

  function animation(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const loc = spriteAnimation[animate].loc;
    const position = Math.floor(gameFrame / staggerFrame) % (loc.length - 1);
    ctx.drawImage(
      img,
      loc[position].width,
      loc[position].height,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
    );

    gameFrame++;
    requestAnimationFrame(() => animation(ctx, img));
  }

  function changeAnimate(value: string) {
    gameFrame = 1;
    animate = value;
  }

  return (
    <div className={"page"}>
      <div className={shadowDog.select}>
        <label>选择动画状态：</label>
        <select onChange={(e) => changeAnimate(e.target.value)}>
          <option value={"idle"}>idle</option>
          <option value={"jump"}>jump</option>
          <option value={"fall"}>fall</option>
          <option value={"run"}>run</option>
          <option value={"dizzy"}>dizzy</option>
          <option value={"sit"}>sit</option>
          <option value={"roll"}>roll</option>
          <option value={"bite"}>bite</option>
          <option value={"ko"}>ko</option>
          <option value={"getHit"}>getHit</option>
        </select>
      </div>

      <canvas ref={canvasRef} className={shadowDog.canvas1}></canvas>
    </div>
  );
};
