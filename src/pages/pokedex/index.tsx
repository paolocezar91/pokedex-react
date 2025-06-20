import { fetchPokemonDataList, fetchPokemonList } from '@/app/query';
import '@/app/globals.css';
import RootLayout from '@/app/layout';
import { IPkmn } from '@/types/types';
import PokemonFilter from '@/components/pokedex/list/filter';
import PokemonList from '@/components/pokedex/list/list';
import PokemonTable from '@/components/pokedex/table/table';
import Spinner from '@/components/shared/spinner';
import Toggle from '@/components/shared/toggle';
import Tooltip from '@/components/shared/tooltip/tooltip';
import { useLocalStorage } from '@/components/shared/utils';
import { Squares2X2Icon, TableCellsIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

const NUMBERS_OF_POKEMON = 50;
const STARTING_POKEMON = 0;

export const metadata: Metadata = {
  title: `Pokédex -- Next.js Demo`,
  description: 'By Paolo Pestalozzi with PokeAPI and Next.js.'
};

export async function getPokemonPage(
  offset: number,
  limit: number
): Promise<IPkmn[]> {
  try {
    return await fetchPokemonDataList(await fetchPokemonList(limit, offset));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getStaticProps() {
  return {
    props: {
      pokemonsData: await getPokemonPage(STARTING_POKEMON, NUMBERS_OF_POKEMON),
    },
  };
}

export default function Pokedex({ pokemonsData }: { pokemonsData: IPkmn[] }) {
  const { ref, inView } = useInView({ threshold: 1 });
  const [pokemons, setPokemons] = useState<IPkmn[]>(pokemonsData);
  const [pokemonsBackup, setPokemonsBackup] = useState<IPkmn[]>(pokemonsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [listTableToggle, setListTableToggle] = useLocalStorage('listTable', false);
  const [filtered, setFiltered] = useState<boolean>(false);
  const [offset, setOffset] = useState(STARTING_POKEMON + NUMBERS_OF_POKEMON);
  const { t } = useTranslation('common');

  useEffect(() => {
    async function loadMorePkmn() {
      const morePkmn = await getPokemonPage(offset, NUMBERS_OF_POKEMON);
      if (morePkmn.length > 0){
        setPokemons(pkmn => [...pkmn, ...morePkmn]);
        setPokemonsBackup(pokemons);
        setOffset(offset => offset + NUMBERS_OF_POKEMON);
        setTimeout(() => setLoading(false), 0);
      }
    }

    if (inView && !loading) {
      setLoading(true);
      loadMorePkmn();
    }
  }, [pokemonsData, pokemons, inView, offset, loading]);

  const filter = (filterText: string) => {
    setFiltered(!!filterText);
    if(filterText) {
      setPokemons(pokemonsBackup.filter(pkmn => {
        const value = filterText.toLowerCase();

        return pkmn.name.toLowerCase().includes(filterText.toLowerCase()) ||
          pkmn.types[0].type.name === value ||
          pkmn.types[1]?.type?.name === value;
      }));
    } else {
      setPokemons(pokemonsBackup);
    }
  };

  if (!pokemons) return null;

  const refElement = !inView && !filtered && <div className="ref" ref={ref}></div>;

  return (
    <RootLayout title="Next.js Demo">
      {pokemons &&
        <div className="wrapper h-[inherit] p-4 bg-background">
          <div className="flex items-center">
            <div className="flex items-center bg-(--pokedex-red-dark) p-2 md:w-max border-b-2 border-solid border-black rounded-t-lg">
              <PokemonFilter className="flex" onFilter={filter} />
            </div>
            <div className="flex-1">
              <Tooltip content={t('settings.toggleView')}>
                <label className="ml-4 flex">
                  <Squares2X2Icon className="w-7" />
                  <Toggle className="mx-2" id="list-table" value={listTableToggle} onChange={(value: boolean) => setListTableToggle(value)} />
                  <TableCellsIcon className="w-7" />
                </label>
              </Tooltip>
            </div>
          </div>
          {
            !listTableToggle ?
              <PokemonList pokemons={pokemons}>{refElement}</PokemonList> :
              <PokemonTable pokemons={pokemons}>{refElement}</PokemonTable>
          }
          {loading && <Spinner /> }
        </div>
      }
    </RootLayout>
  );
}
