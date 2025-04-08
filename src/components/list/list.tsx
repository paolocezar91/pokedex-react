'use client';

import { IPkmn } from '@/app/types';
import Link from 'next/link';
import PokemonThumb from '../thumb/thumb';

export default function PokemonList({
  pokemons,
  ref,
  inView,
  searched
}: Readonly<{
  pokemons: IPkmn[],
  // eslint-disable-next-line no-unused-vars
  ref: (_?: Element | null) => void,
  inView: boolean,
  searched: boolean
}>) {
  return (
    <div className="list-container">
      <div className="list relative flex justify-center flex-row flex-wrap p-4">
        {
          pokemons.map((pokemon, i) => {
            return <Link href={`/pokedex/${pokemon.name}`} key={i} className="my-1 mx-1 link">
              <PokemonThumb pokemonData={pokemon} />
            </Link>;
          })
        }
        {!inView && !searched && <div className="ref" ref={ref}></div>}
      </div>
    </div>
  );
}