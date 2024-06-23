import { classNameMarge } from "@/utils/common";
import React, { createRef, RefObject, useEffect, useState } from "react";
import type { ReactNode } from "react";
type CommonProps = {
  children?: ReactNode;
};

type Props = {
  show: boolean;
  parentRef: RefObject<HTMLElement>;
  content?: string;
};

export default (props: Props & CommonProps) => {
  const popoverRef = createRef<HTMLDivElement>();
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    zIndex: -99999,
  });
  const [show, setShow] = useState(props.show);

  useEffect(() => {
    if (props.parentRef.current && popoverRef.current) {
      if (props.show) {
        const rect = props.parentRef.current.getBoundingClientRect();
        const zIndex = Array.from(document.querySelectorAll("*"))
          .map((el) => {
            return window.getComputedStyle(el).zIndex;
          })
          .filter((o) => o !== "auto")
          .sort((a, b) => parseInt(a) - parseInt(b))
          .at(-1);
        popoverRef.current.style.display = "block";
        document.body.append(popoverRef.current);
        setShow(true);
        setPosition({
          left: rect.left + rect.width / 2 - popoverRef.current.clientWidth / 2,
          top: rect.top + rect.height,
          zIndex: zIndex ? parseInt(zIndex) + 1 : 2000,
        });
      } else {
        popoverRef.current.style.display = "none";
        setShow(false);
      }
    }
  }, [props.show]);

  return (
    <div
      ref={popoverRef}
      className={classNameMarge(["popover"])}
      style={{
        display: "none",
        padding: "20px",
        position: "absolute",
        ...position,
      }}
    >
      <div>
        {typeof props.content === "string" && props.content}
        {props.children}
      </div>
    </div>
  );
};
