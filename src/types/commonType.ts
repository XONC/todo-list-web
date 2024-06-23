export enum Todo_List_Card_Status {
  UnStart = 0,
  Process,
  Complete,
}

export type ColorType =
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "primary"
  | "info"
  | "text";

/*弹框类组件基本属性*/
export type DialogProps = {
  title: string;
  visible: boolean;
  width: string | number;
  children?: Readonly<React.ReactNode>;
  footer?: Readonly<React.ReactNode>;

  onClose?: () => void;
};

export type Size = "small" | "middle" | "large";

export interface DBResponse<T> {
  code: 200 | 500;
  data: T;
  message: string;
}
