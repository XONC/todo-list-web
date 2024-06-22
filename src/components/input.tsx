import { InputHTMLAttributes } from "react";
import { classNameMarge } from "@/utils/common";

type Props = {
  value?: string;
  type?: InputHTMLAttributes<any>["type"];
  placeholder?: InputHTMLAttributes<any>["placeholder"];
  readOnly?: InputHTMLAttributes<any>["readOnly"];
  size?: Size;
  onChange?: (val?: string) => void;
};

export default (props: Props) => {
  const size = props.size || "middle";
  return (
    <div className={classNameMarge(["input", size])}>
      <input
        className={classNameMarge(["input__inner"])}
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
        readOnly={props.readOnly}
        onChange={(e) => props.onChange && props.onChange(e.target.value)}
      />
    </div>
  );
};
