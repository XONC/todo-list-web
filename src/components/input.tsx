import { InputHTMLAttributes } from "react";
import { classNameMarge } from "@/utils/common";

type Props = {
  value?: string;
  type?: InputHTMLAttributes<any>["type"];
  onChange: (val?: string) => void;
};

export default (props: Props) => {
  return (
    <div className={classNameMarge(["input"])}>
      <input
        {...props}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
