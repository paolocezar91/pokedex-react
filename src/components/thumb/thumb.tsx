import { IPkmn } from '@/app/types';
import { normalizePokemonName } from '@/pages/pokedex/utils';
import Image from 'next/image';
import { IPokemon, IPokemonType } from 'pokeapi-typescript';
import { CSSProperties, Suspense, useEffect, useState } from 'react';
import Spinner from '../spinner/spinner';
import './thumb.scss';

export function getArtwork(pokemon: IPokemon | IPkmn, varieties: string[]) {
  const rv: Record<string, string[]> = {
    normal: [],
    shiny: []
  };

  [pokemon.id, ...varieties].forEach((var_id) => {
    rv.normal.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${var_id}.png`);
    rv.shiny.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${var_id}.png`);
  });

  return rv;
}

export function getNumber(id: number) {
  return ('000' + id.toString()).slice(-4);
}

export function getBackgroundStyle(types: IPokemonType[] = []): CSSProperties {
  const colors = types?.map(type => getTypeColor(type.type.name)) || [];
  return colors.length === 1 ? { 'background': `${colors[0]}` } : getGradientStyle(colors);
}

function getGradientStyle(colors: string[]): CSSProperties {
  return { background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`};
}

function getTypeColor(type: string) {
  return {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  }[type] ?? '#CCCCCC';
}

export default function PokemonThumb({
  pokemonData,
  hasShinyCheckbox,
  size = 'base',
  hasName = true,
  // hasVarieties = false
}: Readonly<{
  pokemonData: IPokemon | IPkmn,
  hasShinyCheckbox?: boolean,
  size?: string,
  hasName?: boolean,
  // hasVarieties?: boolean,
}>) {
  const [pokemon, setPokemon] = useState<IPokemon | IPkmn | null>(null);
  const [shiny, setShiny] = useState<boolean>(false);
  // const [varieties, setVarieties] = useState<string[]>([]);


  useEffect(() => {
    setPokemon(pokemonData);
    // const getVarieties = async () => {
    //   const species = await fetchSpecies(String(pokemonData.name));
    //   setVarieties(species.varieties.map(v => getIdFromUrlSubstring(v.pokemon.url)));
    // };
    // if(hasVarieties){
    //   getVarieties();
    // }
  }, [pokemonData]);

  const loading = <span className="loading text-xs my-auto"><Spinner /></span>;
  const isXS = size === 'xs' && ['w-30 h-30', 'h-[120px]', 'mb-0', 'text-xs'];
  const isSM = size === 'sm' && ['w-40 h-40', 'h-[160px]', 'mb-1', 'text-xs'];
  const isBase = size === 'base' && ['w-50 h-50', 'h-[200px]', 'mb-2', 'text-sm'];
  const isLG = ['w-80 h-80', 'h-[320px]', 'mb-4', 'text-base'];
  const classes = isXS || isSM || isBase || isLG;

  const loaded = pokemon && (
    <div
      style={ pokemon ? getBackgroundStyle(pokemon.types) : {'background': '#CCCCC'}}
      className={`pokemon flex flex-col justify-center items-center ${classes[0]} ${size} ${!hasName ? 'titleless' : ''}`}
    >
      <div className={`pokemon-shadow bg-[rgba(0,0,0,0.2)] ${classes[0]}`}></div>
      <div className="img-hover-zoom w-full h-full">
        <div className={`relative w-full ${classes[1]}`}>
          {!shiny && <Image
            className="artwork"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={getArtwork(pokemon, []).normal[0]}
            alt={normalizePokemonName(pokemon.name)}
            priority={true}

          />}
          {shiny && <Image
            className="artwork"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={getArtwork(pokemon, []).shiny[0]}
            alt={normalizePokemonName(pokemon.name)}
            priority={true}
          />}
        </div>
      </div>
      {hasName && <span className={`name ${classes[3]}`}>{ normalizePokemonName(pokemon.name) }</span>}
      {hasName && <span className={`id ${classes[2]} ${classes[3]}`}>#{ getNumber(pokemon.id) }</span>}
    </div>
  );

  return (
    <Suspense fallback={<Spinner />}>
      {pokemon ? loaded : loading}
      {
        pokemon && hasShinyCheckbox && <label className="w-full text-right mt-1" htmlFor="shiny">
          Shiny<input
            id="shiny"
            name="shiny"
            className="mt-2 ml-2 text-xs"
            type="checkbox"
            checked={shiny}
            onChange={()=> setShiny(!shiny)}
          />
        </label>
      }
    </Suspense>
  );
}