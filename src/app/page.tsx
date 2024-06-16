import Button from "@/components/button";

export default async function Home() {

  return (
    <main className="">
      <p>首页</p>
      <i className="material-icons add">face</i>
      <Button link href={"/todo-list"}>任务列表</Button>
    </main>
  );
}
