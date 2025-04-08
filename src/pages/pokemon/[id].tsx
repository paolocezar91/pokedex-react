import RootLayout from '@/app/layout';
import { SpeciesChain } from '@/app/types';
import PokemonAbilities from '@/components/details/abilities';
import PokemonCries from '@/components/details/cries';
import PokemonDescription from '@/components/details/description';
import PokemonEvolutionChart from '@/components/details/evolution-chart';
import PokemonSize from '@/components/details/size';
import PokemonTypes from '@/components/details/types';
import Spinner from '@/components/spinner/spinner';
import PokemonThumb, { getNumber } from '@/components/thumb/thumb';
import { GetStaticPropsContext } from 'next';
import { useParams } from 'next/navigation';
import PokeAPI, { IEvolutionChain, IPokemon, IPokemonSpecies, IPokemonType, IType } from 'pokeapi-typescript';
import { useEffect, useState } from 'react';
import './[id].scss';
import Footer from './footer';

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.id);
  try {
    const pokemonData = await PokeAPI.Pokemon.resolve(id);
    return { props: { id, pokemonData }};
  } catch (error) {
    console.log(error);
    return { props: { redirect: true } };
  }
}

export function capitilize(s: string) {
  return String(s[0]).toUpperCase() + String(s).slice(1);
}

export function getStaticPaths() {
  const ids = Array.from({length: 151}, (_, i) => String(i + 1));

  return {
    paths: ids.map(id => ({ params: { id } })),
    fallback: true
  };
}

export default function PokemonDetails({
  id,
  pokemonData
}: {
  id: string,
  pokemonData: IPokemon
}) {
  const [pokemon, setPokemon] = useState<IPokemon>(pokemonData);
  const [speciesChain, setSpeciesChain] = useState<SpeciesChain>({ loaded: false, chain: {}});
  const [species, setSpecies] = useState<IPokemonSpecies | null>(null);
  const [types, setTypes] = useState<IType[]>([]);
  const [evolutionChain, setEvolutionChain] = useState<IEvolutionChain | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  const params = useParams();
  const currentId = id || params?.id;

  useEffect(() => {
    if (!currentId) return;

    const setPokemonData = () => {
      setLoaded(false);

      speciesChain.loaded = false;
      speciesChain.chain = {};

      const fetchPokemon = async (id: string): Promise<IPokemon> => {
        return await (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json() as IPokemon;
      };
      const fetchSpecies = async (id: string): Promise<IPokemonSpecies> => {
        return await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)).json() as IPokemonSpecies;
      };
      const fetchTypes = async (types: IPokemonType[]): Promise<IType[]> => {
        const fetchType = async (id: string) => await (await fetch(`https://pokeapi.co/api/v2/type/${id}`)).json() as IType;
        return Promise.all(types.map(type => fetchType(type.type.name)));
      };
      const fetchEvolutionChain = async (species: IPokemonSpecies) => {
        const url = species.evolution_chain.url as string;

        try {
          return await (await fetch(url)).json();
        } catch (error) {
          console.error(error);
        }
      };

      const getPokemonMetadata = async () => {
        const [speciesData, typesData] = await Promise.all([
          fetchSpecies(String(pokemonData.id)),
          fetchTypes(pokemonData.types),
        ]);

        if(pokemonData) setPokemon(pokemonData);
        if(typesData.length) setTypes(typesData);
        if(speciesData) {
          setSpecies(speciesData);
          const evolutionChain = await fetchEvolutionChain(speciesData) as IEvolutionChain;
          setEvolutionChain(evolutionChain);

          speciesChain.chain.first = [await fetchPokemon(evolutionChain.chain.species.name)];
          if(evolutionChain.chain?.evolves_to?.[0]) {
            speciesChain.chain.second = await Promise.all(
              evolutionChain.chain.evolves_to.map((evolves_to) => {
                return fetchPokemon(evolves_to.species.name);
              })
            );
            if(evolutionChain.chain.evolves_to[0].evolves_to[0]) {
              speciesChain.chain.third = await Promise.all(
                evolutionChain.chain.evolves_to[0].evolves_to.map((evolves_to) => {
                  return fetchPokemon(evolves_to.species.name);
                })
              );
            } else {
              speciesChain.chain.third = [];
            }
          } else {
            speciesChain.chain.second = [];
            speciesChain.chain.third = [];
          }
          speciesChain.loaded = true;
          setSpeciesChain(speciesChain);
          setLoaded(true);
        }
      };

      getPokemonMetadata();
    };

    setPokemonData();
  }, [currentId]);

  const title = pokemon ? `Pokédex -- ${capitilize(pokemon.name)} - #${getNumber(pokemon.id)}` : 'Loading...';
  return (
    <RootLayout title={title}>
      {!loaded && <Spinner />}
      {loaded && <div className="mx-auto p-4">
        <div className="flex">
          <div className="thumb flex flex-col items-start mr-4">
            <PokemonThumb pokemonData={pokemon} size="large" shinyInput={true}/>
            <hr className="border-solid border-2 border-foreground mt-2 w-full" />
            <PokemonTypes types={types} />
            <PokemonCries pokemon={pokemon} />
          </div>
          <div className="pokemon-details sm:mb-4 p-6 bg-white rounded-lg shadow-md">
            <div className="about grid grid-cols-1 md:grid-cols-2 gap-4">
              {species && <PokemonDescription species={species} />}
              <PokemonSize pokemon={pokemon} />
              <PokemonAbilities pokemon={pokemon} />
              { evolutionChain && <PokemonEvolutionChart speciesChain={speciesChain} evolutionChain={evolutionChain} />}
            </div>
          </div>
        </div>
        <Footer pokemon={pokemon} />
      </div>}
    </RootLayout>
  );
}