'use client'

import {ReactNode} from "react";

type Props = {
  title: string;
  tag?: string;
  children?: Readonly<ReactNode>;
}

export default ({title, tag, children}: Props) => {
  return (
    <div className={( tag || 'h3') + " wrp-header"}>
      <div className={'title'}>{title}</div>
      <div>{children}</div>
    </div>
  )
}