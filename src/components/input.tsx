import type { InputHTMLAttributes } from "react";
import { classNameMarge } from "@/utils/common";
import type { Size } from "@/types/commonType";

type Props = {
  value?: string;
  type?: "text" | "textarea";
  placeholder?: InputHTMLAttributes<any>["placeholder"];
  readOnly?: InputHTMLAttributes<any>["readOnly"];
  row?: number;
  size?: Size;
  onChange?: (val?: string) => void;
};

export default (props: Props) => {
  const size = props.size || "middle";
  const row = props.row || 1;
  let height =
    size === "small" ? 24 * row : size === "middle" ? 30 * row : 42 * row;

  const inputProps = {
    className: classNameMarge(["input__inner"]),
    placeholder: props.placeholder,
    type: props.type,
    value: props.value,
    readOnly: props.readOnly,
    onChange: (e: any) => props.onChange && props.onChange(e.target.value),
  };

  return (
    <div
      className={classNameMarge(["input", size])}
      style={{
        [`--input-size-${props.type}`]: height + "px",
        height: `var(--input-size-${props.type})`,
        lineHeight: `var(--input-size-${props.type})`,
      }}
    >
      {props.type === "textarea" ? (
        <textarea {...inputProps}></textarea>
      ) : (
        <input {...inputProps} />
      )}
    </div>
  );
};
