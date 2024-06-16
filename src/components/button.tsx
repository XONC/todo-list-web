'use client'

import Link from "next/link";
import {LinkProps} from "next/dist/client/link";
import React, {MouseEventHandler,MouseEvent} from "react";

type ButtonEmit = {
  onclick?: (e:MouseEvent<HTMLButtonElement, Event>) => void
}

type ButtonContent = {
  children?: React.ReactNode;
  icon?: string;
  loading?: boolean
}

type ButtonProps = {
  link?: boolean,
  href?: string,
  type?: ColorType,
  round?: boolean,
  linkProps?: LinkProps,
  disabled?: boolean
  size?: 'middle' | 'small' | 'large'
  form?: React.ButtonHTMLAttributes<HTMLButtonElement>['form']

} & ButtonContent & ButtonEmit




function ButtonContent(props: ButtonContent) {
  return (
    <div className={"button-content"}>
      {(props.icon || props.loading) && <i className={`
      ${props.loading && 'is-loading'} 
      material-icons
      icon
      `}
      style={{
        marginRight: props.children ? '4px' : ''
      }}
      >{props.loading ? 'autorenew' : props.icon}</i>}
      {props.children}
    </div>
  )
}

function ButtonLink({linkProps, children}: {linkProps: LinkProps, children: ButtonProps['children']} ) {

  return (
    <Link {...linkProps}>
        <ButtonContent>{children}</ButtonContent>
    </Link>
  )
}

export default ({form,disabled, link, href,linkProps, children, round,icon,loading,size="middle", type="default",onclick}:  Readonly<ButtonProps>) => {
  const isDisabled = loading || disabled
  return (
    <button form={form} className={`
    ${type}
    ${round ? 'is-round' : ''}
    ${ isDisabled? 'is-disabled' : ''}
    ${size}
    `} disabled={isDisabled} onClick={onclick}>
      {link ? <ButtonLink linkProps={{
        href: href || '',
        ...linkProps
      }}>{children}</ButtonLink> : <ButtonContent loading={loading} icon={icon}>{children}</ButtonContent>}
    </button>
  )
}