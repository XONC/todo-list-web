import ShadowDog from "@/components/game-list/shadow-dog";
import ParallaxRolling from "@/components/game-list/parallax-rolling";
import EnemyMovement from "@/components/game-list/enemy-movement";

export default async function GameList({ searchParams }) {
  return (
    <div>
      {searchParams.type === "shadow-dog" && <ShadowDog></ShadowDog>}
      {searchParams.type === "parallax-rolling" && (
        <ParallaxRolling></ParallaxRolling>
      )}
      {searchParams.type === "enemy-movement" && (
        <EnemyMovement></EnemyMovement>
      )}
    </div>
  );
}
