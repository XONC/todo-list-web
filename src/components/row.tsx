import React, { createContext } from "react";
import { classNameMarge } from "@/utils/common";

type Props = {
  gutter?: number;
  children: Readonly<React.ReactNode>;
};

type RowProps = {};

type ColProps = {
  span?: number;
};

const commonPropsContext = createContext<Omit<Props, "children">>({
  gutter: 24,
});

export const Col = (props: Props & ColProps) => {
  const span = props.span || 24;
  const gutter = props.gutter || 24;
  const width = (span / gutter) * 100 + "%";

  return (
    <div
      style={{
        width,
      }}
    >
      {props.children}
    </div>
  );
};

export default (props: Props & RowProps) => {
  const gutter = props.gutter || 24;
  return (
    <div className={classNameMarge(["row"])}>
      <commonPropsContext.Provider
        value={{
          gutter,
        }}
      >
        {props.children}
      </commonPropsContext.Provider>
    </div>
  );
};
