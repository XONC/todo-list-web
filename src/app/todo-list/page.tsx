import { fetchTodoList } from "@/actions/todo-list";
import TodoListWrapper from "@/components/todo-list/todoListWrapper";
import todoListCss from "@/style/todo-list/index.module.css";
import TodoListCard from "@/components/todo-list/todoListCard";

export default async function TodoList() {
  // const dbResponse = await fetchTodoList({
  //   status: 0
  // })
  return (
    <div className={todoListCss.todoList + " page"}>
      <TodoListWrapper title={"代办"} status={0}></TodoListWrapper>
      <TodoListWrapper title={"进行中"} status={1}></TodoListWrapper>
      <TodoListWrapper title={"已完成"} status={2}></TodoListWrapper>
    </div>
  );
}
