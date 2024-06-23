"use client";
import todoListWrapper from "@/style/todo-list/todoListWrapper.module.css";
import WrpHeader from "@/components/wrpHeader";
import Button from "@/components/button";
import TodoListCard, { CardProps } from "@/components/todo-list/todoListCard";
import { useEffect, useState } from "react";
import CardInfo from "@/components/todo-list/dialog/cardInfo";
import { createdCard, fetchTodoList } from "@/actions/todo-list";
import { useFormState } from "react-dom";
import { initialState } from "@/components/hooks/commonHooks";
import ScrollBar from "@/components/scrollBar";

type Props = {
  title: string;
  status: CardProps["status"];
  children?: Readonly<React.ReactNode>;
} & Emit;

type Emit = {
  onclick?: () => void;
};

export default (props: Props) => {
  const { title, onclick, children } = props;
  const [todoList, setTdoList] = useState<CardProps[]>([]);
  // 用作页面的加载信号
  const [loading, setLoading] = useState(false);

  const [cardInfo, setCardInfo] = useState({
    title: "新增",
    visible: false,
  });

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (loading) {
      fetchTodoList({
        status: props.status,
      })
        .then((res) => {
          setTdoList(res.data || []);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading]);

  function closeCardInfo() {
    setCardInfo({
      title: "新增",
      visible: false,
    });
  }

  function addCard() {
    setCardInfo({
      title: "新增",
      visible: true,
    });
  }

  function submitCardInfo() {
    closeCardInfo();
    setLoading(true);
  }

  function onChangeStatus() {
    setLoading(true);
  }

  return (
    <>
      <section className={todoListWrapper.todoListWrapper}>
        <WrpHeader {...props}>
          <Button type={"primary"} icon={"add"} onclick={addCard}></Button>
        </WrpHeader>
        <main className={todoListWrapper.main}>
          <ScrollBar>
            {loading ? (
              <p>加载中。。。</p>
            ) : (
              todoList.map((item) => {
                return (
                  <TodoListCard
                    key={item.uuid}
                    {...item}
                    onChangeStatus={onChangeStatus}
                  ></TodoListCard>
                );
              })
            )}
          </ScrollBar>
        </main>
      </section>

      <CardInfo
        width={600}
        title={cardInfo.title}
        visible={cardInfo.visible}
        onClose={closeCardInfo}
        onSubmit={submitCardInfo}
      ></CardInfo>
    </>
  );
};
