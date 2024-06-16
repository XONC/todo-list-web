'use client'

import cardCss from "@/style/todo-list/todoListCard.module.css"

type CardProps = {
  status: Todo_List_Card_Status,
  title: string,
  content: string,
  startTime?: string | null,
  createdDate: string,
  endTime?: string | null,
  completeTime?: string | null
}

export default ({title, content, endTime, startTime, createdDate, completeTime}: Readonly<CardProps>) => {
  return (
    <section className={cardCss.card}>
      <header className={"w-full h-4"}>
        <div className={"rounded-full bg-gray-500 w-4 h-4"}></div>
        {title}
      </header>
      <main>{content}</main>
      <footer>
        <span>创建日期：{createdDate}</span>
        <span>完成日期: {completeTime}</span>
        <span>开始日期: {startTime}</span>
      </footer>
    </section>
  )
}