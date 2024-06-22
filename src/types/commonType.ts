enum Todo_List_Card_Status {
  UnStart = 0,
  Process,
  Complete,
}

type ColorType =
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "primary"
  | "info"
  | "text";

/*弹框类组件基本属性*/
type DialogProps = {
  title: string;
  visible: boolean;
  width: string | number;
  children?: Readonly<React.ReactNode>;
  footer?: Readonly<React.ReactNode>;

  onClose?: () => void;
};

type Size = "small" | "middle" | "large";
