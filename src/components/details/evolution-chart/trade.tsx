import Image from "next/image";
import { kebabToCapitilize } from "./evolution-chart";
import { IEvolutionDetail } from "pokeapi-typescript";

export default function PokemonEvolutionTrade({evolution_details}: {evolution_details: IEvolutionDetail}) {
  return (evolution_details.trigger.name === 'trade' &&
    <span> trade {evolution_details.held_item?.name &&
      <span className="flex flex-col items-center text-xs">
        {kebabToCapitilize(evolution_details.held_item?.name)}
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolution_details.held_item?.name}.png`}
          width={30}
          height={30}
          alt={kebabToCapitilize(evolution_details.held_item?.name)}
        />
      </span>}
    </span>);
}