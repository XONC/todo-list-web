"use client";

import cardCss from "@/style/todo-list/todoListCard.module.css";
import { dateFilter } from "@/utils/common";
import Button from "@/components/button";
import { useState } from "react";
import { updateCard } from "@/actions/todo-list";
import { isVerifyIsSuccess, useEmit } from "@/components/hooks/commonHooks";

export type CardProps = {
  id: string;
  uuid: string;
  status: Todo_List_Card_Status;
  title: string;
  content: string;
  startTime?: string | null;
  createdDate: string;
  endTime?: string | null;
  completeTime?: string | null;
  predictCompleteTime?: string | null;
};

export default (
  props: Readonly<CardProps> & {
    onChangeStatus: () => void;
  },
) => {
  const {
    title,
    content,
    endTime,
    startTime,
    createdDate,
    completeTime,
    predictCompleteTime,
    id,
    status,
    onChangeStatus,
  } = props;
  console.log(status);
  const emit = useEmit(props);
  const [loading, setLoading] = useState(false);

  function changeStatus(value: CardProps["status"]) {
    updateCard({
      id,
      status: value,
      startTime:
        value === 1 ? dateFilter(new Date(), "YYYY-MM-DD hh:mm:ss") : undefined,
      completeTime:
        value === 2 ? dateFilter(new Date(), "YYYY-MM-DD hh:mm:ss") : undefined,
    }).then((res) => {
      if (isVerifyIsSuccess(res)) {
        emit("onChangeStatus");
      }
    });
  }
  return (
    <section className={cardCss.card}>
      <header>
        <p>{title}</p>
      </header>
      <main>
        <p>{content}</p>
      </main>
      <footer>
        <div>
          {status === 0 && (
            <p>创建日期：{dateFilter(createdDate, "YYYY-MM-DD")}</p>
          )}
          {status === 2 && (
            <p>完成日期：{dateFilter(completeTime, "YYYY-MM-DD")}</p>
          )}
          {status === 1 && (
            <p>开始日期：{dateFilter(startTime, "YYYY-MM-DD")}</p>
          )}
        </div>
        <div className={"btn-group"}>
          {status === 0 && (
            <Button
              loading={loading}
              type={"primary"}
              size={"small"}
              onclick={() => changeStatus(1)}
            >
              开始
            </Button>
          )}
          {status === 1 && (
            <Button
              loading={loading}
              type={"primary"}
              size={"small"}
              onclick={() => changeStatus(2)}
            >
              完成
            </Button>
          )}
        </div>
      </footer>
    </section>
  );
};
