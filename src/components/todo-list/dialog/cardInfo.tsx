import Dialog, { Footer } from "@/components/dialog";
import Button from "@/components/button";
import { createRef, MouseEvent, useEffect, useRef, useState } from "react";
import Input from "@/components/input";
import Form, { FormItem } from "@/components/form";
import { v4 as uuidv4 } from "uuid";
import { getFormData } from "@/utils/common";
import { createdCard } from "@/actions/todo-list";
import { useFormState } from "react-dom";
import Row, { Col } from "@/components/row";
import DatePicker from "@/components/datePicker";
import { useEmit } from "@/components/hooks/commonHooks";
const defaultForm = {
  completeTime: "",
  content: "",
  createdDate: "",
  startTime: "",
  status: 0,
  statusName: "未开始",
  title: "",
  userUuid: "",
  uuid: "",
};

type MyForm = typeof defaultForm;

type Props = {
  data?: MyForm;
};
type Emit = {
  onSubmit?: (val: MyForm) => void;
};

export default (props: DialogProps & Emit & Props) => {
  const emit = useEmit<Emit>(props);
  const [loading, setLoading] = useState(false);
  const [myForm, setMyForm] = useState<MyForm>(props.data || defaultForm);
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createdCard, initialState);
  const formRef = createRef<HTMLFormElement>();
  useEffect(() => {
    emit("onSubmit", myForm);
    setLoading(false);
  }, [state]);
  const submit = async () => {
    setLoading(true);
    const payload = { ...myForm };
    payload.uuid = uuidv4();
    payload.createdDate = new Date().getTime().toString();
    dispatch(payload);
  };

  const changeForm = (obj: any) => {
    setMyForm({
      ...myForm,
      ...obj,
    });
  };

  return (
    <Dialog {...props}>
      <Form ref={formRef} labelSuffix={"："} labelWidth={100}>
        <Row>
          <Col span={24}>
            <FormItem label={"标题"} prop={"title"}>
              <Input
                value={myForm.title}
                placeholder={"请输入标题"}
                onChange={(val) => changeForm({ title: val })}
              ></Input>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label={"内容"} prop={"content"}>
              <Input
                type={"textarea"}
                row={2}
                value={myForm.content}
                onChange={(val) => changeForm({ content: val })}
              ></Input>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={"预计完成时间"} prop={"title"}>
              <DatePicker
                valueFormatter={"YYYY-MM-DD hh:mm:ss"}
                type={"date"}
                value={myForm.completeTime}
                onChange={(val) => changeForm({ completeTime: val })}
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Footer>
        <Button loading={loading} type={"primary"} onclick={submit}>
          提交
        </Button>
        <Button loading={loading} onclick={props.onClose}>
          关闭
        </Button>
      </Footer>
    </Dialog>
  );
};
