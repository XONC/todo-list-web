"use client";

import React, { createRef, useEffect, useState } from "react";
import { classNameMarge } from "@/utils/common";

type Props = {
  height?: number;
  className?: string;
  children: Readonly<React.ReactNode>;
};

export default (props: Props) => {
  const scrollBar = createRef<HTMLDivElement>();
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const rect = scrollBar.current?.parentElement?.getBoundingClientRect();
    if (rect) {
      setHeight(props.height ? props.height : rect.height);
    } else {
      setHeight(props.height || 0);
    }
  }, []);

  return (
    <div
      ref={scrollBar}
      className={classNameMarge(["scroll-bar", props.className])}
      style={{
        height: height + "px",
        overflowY: "auto",
      }}
    >
      <div>{props.children}</div>
    </div>
  );
};
