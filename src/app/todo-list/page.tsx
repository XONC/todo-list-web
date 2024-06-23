import { fetchTodoList } from "@/actions/todo-list";
import TodoListWrapper from "@/components/todo-list/todoListWrapper";
import todoListCss from "@/style/todo-list/index.module.css";
import TodoListCard from "@/components/todo-list/todoListCard";
import { isVerifyIsSuccess } from "@/components/hooks/commonHooks";
import { Suspense } from "react";

export default async function TodoList() {
  const res = await fetchTodoList({ status: "" });
  const todo = {
    wait: [],
    progress: [],
    complete: [],
  };
  if (isVerifyIsSuccess(res)) {
    todo.wait = res.data.filter((item) => item.status === 0);
    todo.progress = res.data.filter((item) => item.status === 1);
    todo.complete = res.data.filter((item) => item.status === 2);
  }
  return (
    <div className={todoListCss.todoList + " page"}>
      <TodoListWrapper list={todo.wait} title={"代办"} status={0}>
        <Suspense fallback={<p>加载中...</p>}>
          {todo.wait.map((item) => {
            return <TodoListCard key={item.uuid} {...item}></TodoListCard>;
          })}
        </Suspense>
      </TodoListWrapper>
      <TodoListWrapper list={todo.progress} title={"进行中"} status={1}>
        <Suspense fallback={<p>加载中...</p>}>
          {todo.progress.map((item) => {
            return <TodoListCard key={item.uuid} {...item}></TodoListCard>;
          })}
        </Suspense>
      </TodoListWrapper>
      <TodoListWrapper list={todo.complete} title={"已完成"} status={2}>
        <Suspense fallback={<p>加载中...</p>}>
          {todo.complete.map((item) => {
            return <TodoListCard key={item.uuid} {...item}></TodoListCard>;
          })}
        </Suspense>
      </TodoListWrapper>
    </div>
  );
}
