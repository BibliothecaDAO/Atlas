import { Collection, Game } from "@/types";
import { games } from "@/constants";
import { GameCard } from "./components/GameCard";
import { CollectionCard } from "./components/CollectionCard";
import { getCollections } from "./lib/reservoir/getCollections";

import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const data = await getCollections([
    {
      contract: "0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d",
    },
  ]);

  const collections: Collection[] = data.collections;
  const defaultImage = "/backgrounds/map.png";

  const backgroundImageStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(5, 5, 5, 1)), url(${defaultImage}), url(${defaultImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <main className="z-0" style={backgroundImageStyle}>
      <div className="w-full sm:-mt-24 sm:pl-32">
        <div className="container px-8 mx-auto pt-48">
          <h1 className="text-4xl md:text-6xl font-sans">
            Realms <br /> Autonomous <br /> World.
          </h1>
          <div className="flex my-2">
            <span className="align-center">Powered by </span>
            <Link href={"https://dojoengine.org/"}>
              <Image
                width={35}
                height={35}
                src="/icons/mark-dark.svg"
                alt="Dojo"
              />
            </Link>
            <span className="px-1">on</span>{" "}
            <Link href={"https://www.starknet.io/en"}>
              <Image
                width={24}
                height={24}
                src="/icons/starknet.svg"
                alt="Starknet"
              />
            </Link>
          </div>

          <hr className="border" />

          <div className="my-20 ">
            <h3 className="mb-8">Games</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {games.map((game: Game, index) => (
                <GameCard key={index} game={game} />
              ))}
            </div>
          </div>
          <hr className="border my-8" />
          <div className="my-20 ">
            <h3 className="mb-8">Featured Collections</h3>
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3">
              {collections?.map((collection: Collection, index) => {
                return <CollectionCard collection={collection} key={index} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
