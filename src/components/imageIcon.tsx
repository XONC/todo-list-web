"use client";

import { classNameMarge } from "@/utils/common";

type Props = {
  icon?: string;
  size?: number;
  color?: string;
  className?: string;
  style?: object;
  onClick?: () => void;
};

export default (props: Props) => {
  const style = props.style ? { ...props.style } : {};
  return (
    <div className={classNameMarge(["image-icon", props.className])}>
      <span
        onClick={props.onClick}
        style={{
          fontSize: props.size,
          color: props.color,
          ...style,
        }}
        className={classNameMarge(["iconfont", props.icon])}
      ></span>
    </div>
  );
};
