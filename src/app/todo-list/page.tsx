"use client";
import { getTodoList } from "@/actions/todo-list";
import TodoListWrapper from "@/components/todo-list/todoListWrapper";
import TodoListCard from "@/components/todo-list/todoListCard";
import todoListCss from "@/style/todo-list/index.module.css";
import CardInfo from "@/components/todo-list/dialog/cardInfo";
import { useState } from "react";
import { Simulate } from "react-dom/test-utils";
import submit = Simulate.submit;

export default function TodoList() {
  // const todoList = await getTodoList()
  // console.log(todoList.length)
  const [cardInfo, setCardInfo] = useState({
    title: "新增",
    visible: false,
  });

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
  }

  return (
    <div className={todoListCss.todoList + " page"}>
      <TodoListWrapper title={"代办"} onclick={addCard}>
        <TodoListCard
          content={"test"}
          title={"test"}
          status={0}
          createdDate={"2024-06-14"}
        ></TodoListCard>
      </TodoListWrapper>
      {/*{todoList.map(item => <div>{item.title}</div>)}*/}

      <CardInfo
        width={600}
        title={cardInfo.title}
        visible={cardInfo.visible}
        onClose={closeCardInfo}
        onSubmit={submitCardInfo}
      ></CardInfo>
    </div>
  );
}
