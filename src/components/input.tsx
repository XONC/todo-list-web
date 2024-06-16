import {InputHTMLAttributes} from "react";

type Props = {
  value?: string;
  type?: InputHTMLAttributes<any>['type'],
  onChange: (val?: string) => void
}


export default (props: Props) => {
  return (
    <div>
      <input {...props} value={props.value} onChange={(e) => props.onChange(e.target.value)}/>
    </div>
  )
}