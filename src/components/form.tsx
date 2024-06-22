"use client";
import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { EventEmitter } from "events";
import { getTureValue } from "@/utils/common";

const commonPropsContext = createContext<Omit<Props, "children">>({
  labelSuffix: "",
  labelWidth: "",
  labelPosition: "",
});

type Props = {
  labelSuffix?: string;
  labelWidth?: string | number;
  labelPosition?: "left" | "right" | "";
  children: Readonly<React.ReactNode>;
};

type FormItemProps = {
  label?: string;
  prop?: string;
} & Props;

type FormProps = {} & Props;

export const FormItem = (props: FormItemProps) => {
  const formStore = useContext(commonPropsContext);
  const labelWidth = getTureValue(formStore.labelWidth, props.labelWidth) as
    | string
    | number;
  const labelPosition = getTureValue(
    formStore.labelPosition,
    props.labelPosition,
  );
  const labelSuffix = getTureValue(formStore.labelSuffix, props.labelSuffix);

  return (
    <div className={"form-item"}>
      {props.label && (
        <div
          className={"label"}
          style={{
            flexShrink: 0,
            flexBasis:
              typeof labelWidth === "number" ? labelWidth + "px" : labelWidth,
            width:
              typeof labelWidth === "number" ? labelWidth + "px" : labelWidth,
            textAlign: labelPosition || "right",
          }}
        >
          <label key="label">
            {props.label}
            {labelSuffix}
          </label>
        </div>
      )}
      <div className={"content"}>{props.children}</div>
    </div>
  );
};

export default forwardRef(
  (
    props: FormProps & React.FormHTMLAttributes<HTMLFormElement>,
    ref: React.ForwardedRef<HTMLFormElement>,
  ) => {
    return (
      <form
        ref={ref}
        id={props.id}
        action={props.action}
        onSubmit={props.onSubmit}
      >
        <commonPropsContext.Provider value={props}>
          {props.children}
        </commonPropsContext.Provider>
      </form>
    );
  },
);
