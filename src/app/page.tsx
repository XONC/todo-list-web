import Button from "@/components/button";

export default async function Home() {
  return (
    <main className="">
      <p>首页</p>
      <i className="material-icons add">face</i>
      <Button link href={"/todo-list"}>
        任务列表
      </Button>
      <Button link href={"/game-list?type=shadow-dog"}>
        影子狗
      </Button>
      <Button link href={"/game-list?type=parallax-rolling"}>
        视差滚动
      </Button>
      <Button link href={"/game-list?type=enemy-movement"}>
        敌人运动
      </Button>
    </main>
  );
}
