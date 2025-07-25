import { SpeciesChain } from "@/types/types";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { normalizePokemonName } from "@/components/shared/utils";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { IChainLink, IEvolutionChain, IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import PokemonThumb, { getNumber } from "../../../shared/thumb/thumb";
import PokemonEvolutionHappiness from "./happiness";
import PokemonEvolutionItem from "./item";
import PokemonEvolutionLocation from "./location";
import PokemonEvolutionLevel from "./lvl";
import PokemonEvolutionTrade from "./trade";

export default function PokemonEvolutionChart({
  pokemon,
  speciesChain,
  evolutionChain
}: {
  pokemon: IPokemon,
  evolutionChain: IEvolutionChain,
  speciesChain: SpeciesChain
}) {
  const { t } = useTranslation('common');

  if(!!speciesChain.chain.first?.length && !speciesChain.chain.second?.length) {
    return <div className="evolution-chain col-span-6 ">
      <h3 className="w-fit text-lg font-semibold mb-2">{ t('pokedex.details.evolutionChart.title') }</h3>
      <p>{normalizePokemonName(speciesChain.chain.first[0].name)} does not evolve</p>
    </div>;
  }


  const firstPkmn = speciesChain.chain.first[0];
  const firstChainColumn = <Tooltip
    content={`${normalizePokemonName(firstPkmn.name)} ${getNumber(firstPkmn.id)}`}
  >
    <Link className="flex-2" href={`/pokedex/${firstPkmn.name}`}>
      <PokemonThumb
        className={`${pokemon.id === firstPkmn.id ? 'border-foreground border-solid border-4': 'border-0'} `}
        pokemonData={firstPkmn}
        size="sm"
      />
    </Link>
  </Tooltip>;

  const chainColumn = (chain: IPokemon[], evolves_to: IChainLink[]) =>
    <ul className="flex flex-col">
      {chain.map((pkmn, idx) => {
        const evolution_details = evolves_to[idx].evolution_details[0];
        return <li className="mb-2 items-center flex text-xs" key={idx}>
          <div className="flex flex-col items-center flex-1 mx-3">
            {evolution_details && <span className="flex text-center">
              <PokemonEvolutionLevel evolution_details={evolution_details} />
              <PokemonEvolutionItem evolution_details={evolution_details} />
              <PokemonEvolutionLocation evolution_details={evolution_details} />
              <PokemonEvolutionHappiness evolution_details={evolution_details} />
              <PokemonEvolutionTrade evolution_details={evolution_details} />
            </span>}
            <span className="font-bold text-xl">
              <ArrowRightIcon className="w-7" />
            </span>
          </div>
          <Tooltip content={`${normalizePokemonName(pkmn.name)} ${getNumber(pkmn.id)}`}>
            <Link className="flex-2" href={`/pokedex/${pkmn.name}`}>
              <PokemonThumb
                className={`${pokemon.id === pkmn.id ? 'border-foreground border-solid border-4': 'border-0'} `}
                pokemonData={pkmn}
                size="sm"
              />
            </Link>
          </Tooltip>
        </li>;
      })}
    </ul>;

  return (
    <div className="evolution-chain col-span-6 ">
      <h3 className="w-fit text-lg font-semibold mb-2">{ t('pokedex.details.evolutionChart.title') }</h3>
      {!!speciesChain.loaded &&
        <ul className="w-fit flex items-start justify-start overflow-x-auto mt-4">
          {!!speciesChain.chain.second?.length && <>
            <li>{firstChainColumn}</li>
            <li>{chainColumn(speciesChain.chain.second, evolutionChain.chain.evolves_to)}</li>
          </>}
          {!!speciesChain.chain.third?.length &&
            <li>{chainColumn(speciesChain.chain.third, evolutionChain.chain.evolves_to[0].evolves_to)}</li>
          }
        </ul>}
    </div>
  );
}