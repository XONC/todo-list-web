"use client";
import WrpHeader from "@/components/wrpHeader";
import Button from "@/components/button";
import { ReactNode } from "react";
import { classNameMarge } from "@/utils/common";

export const Footer = (props: {
  position?: "right | center | left";
  children: Readonly<ReactNode>;
}) => {
  return (
    <footer
      className={`
      ${props.position ? props.position : "right"}
    `}
    >
      {props.children}
    </footer>
  );
};

export default (props: DialogProps) => {
  const baseZIndex = 2000;

  return (
    <div
      className={classNameMarge([
        !props.visible ? "is-hidden" : "is-visible",
        "dialog",
      ])}
    >
      <div
        className={"mark"}
        style={{
          zIndex: baseZIndex,
        }}
      ></div>
      <div
        className={`
          main
        `}
        style={{
          width:
            typeof props.width === "number" ? props.width + "px" : props.width,
          zIndex: baseZIndex + 1,
        }}
      >
        <WrpHeader tag={"h1"} title={props.title}>
          <Button
            size={"small"}
            type={"text"}
            icon={"close"}
            onclick={props.onClose}
          ></Button>
        </WrpHeader>
        <main>{props.children}</main>
      </div>
    </div>
  );
};
