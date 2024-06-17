"use client";
import todoListWrapper from "@/style/todo-list/todoListWrapper.module.css";
import WrpHeader from "@/components/wrpHeader";
import Button from "@/components/button";

type Props = {
  title: string;
  children: Readonly<React.ReactNode>;
} & Emit;

type Emit = {
  onclick?: () => void;
};

export default (props: Props) => {
  const { title, onclick, children } = props;
  return (
    <section className={todoListWrapper.todoListWrapper}>
      <WrpHeader {...props}>
        <Button type={"primary"} icon={"add"} onclick={onclick}></Button>
      </WrpHeader>
      <main className={todoListWrapper.main}>{children}</main>
    </section>
  );
};
