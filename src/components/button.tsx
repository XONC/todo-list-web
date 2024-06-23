"use client";

import Link from "next/link";
import type { LinkProps } from "next/dist/client/link";
import type React, {
  ReactNode,
  MouseEventHandler,
  MouseEvent,
  ButtonHTMLAttributes,
} from "react";
import { classNameMarge } from "@/utils/common";
import type { ColorType } from "@/types/commonType";

type ButtonEmit = {
  onclick?: (e: MouseEvent<HTMLButtonElement, Event>) => void;
};

type ButtonContent = {
  children?: ReactNode;
  icon?: string;
  loading?: boolean;
};

type ButtonProps = {
  link?: boolean;
  href?: string;
  type?: ColorType;
  round?: boolean;
  linkProps?: LinkProps;
  disabled?: boolean;
  size?: "middle" | "small" | "large";
  form?: ButtonHTMLAttributes<HTMLButtonElement>["form"];
} & ButtonContent &
  ButtonEmit;

function ButtonContent(props: ButtonContent) {
  return (
    <div className={"button-content"}>
      {(props.icon || props.loading) && (
        <i
          className={classNameMarge([
            "material-icons",
            "icon",
            props.loading ? "is-loading" : "",
          ])}
          style={{
            marginRight: props.children ? "4px" : "",
          }}
        >
          {props.loading ? "autorenew" : props.icon}
        </i>
      )}
      {props.children}
    </div>
  );
}

function ButtonLink(props: {
  linkProps: LinkProps;
  children: ButtonProps["children"];
}) {
  return (
    <Link href={props.linkProps.href}>
      <ButtonContent>{props.children}</ButtonContent>
    </Link>
  );
}

export default ({
  form,
  disabled,
  link,
  href,
  linkProps,
  children,
  round,
  icon,
  loading,
  size = "middle",
  type = "default",
  onclick,
}: Readonly<ButtonProps>) => {
  const isDisabled = loading || disabled;
  return (
    <button
      form={form}
      className={classNameMarge([
        type,
        round ? "is-round" : "",
        isDisabled ? "is-disabled" : "",
        size,
      ])}
      disabled={isDisabled}
      onClick={onclick}
    >
      {link ? (
        <ButtonLink
          linkProps={{
            href: href || "",
            ...linkProps,
          }}
        >
          {children}
        </ButtonLink>
      ) : (
        <ButtonContent loading={loading} icon={icon}>
          {children}
        </ButtonContent>
      )}
    </button>
  );
};
