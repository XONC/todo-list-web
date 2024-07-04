import ShadowDog from "@/components/game-list/shadow-dog";
import ParallaxRolling from "@/components/game-list/parallax-rolling";

export default async function GameList({ searchParams }) {
  return (
    <div>
      {searchParams.type === "shadow-dog" && <ShadowDog></ShadowDog>}
      {searchParams.type === "parallax-rolling" && (
        <ParallaxRolling></ParallaxRolling>
      )}
    </div>
  );
}
