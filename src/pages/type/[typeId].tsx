'use client';

import PokeApiQuery from "@/app/poke-api-query";
import PokemonDefensiveChart from "@/components/shared/defensive-chart";
import { PokemonOffensiveChart } from "@/components/shared/offensive-chart";
import Select from "@/components/shared/select";
import LoadingSpinner from "@/components/shared/spinner";
import { capitilize } from "@/components/shared/utils";
import MovesByType from "@/components/type/moves-by-type";
import PokemonByType from "@/components/type/pokemon-by-type";
import { useUser } from "@/context/user-context";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { IMove, INamedApiResource, IType } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import RootLayout from "../layout";

const pokeApiQuery = new PokeApiQuery();

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.typeId);
  try {
    const typeData = await pokeApiQuery.getType(id) as IType;
    const allTypes = await pokeApiQuery.getAllTypes() as IType[];
    return {
      props: {
        typeData,
        allTypes
      }
    };
  } catch (error) {
    return { props: error };
  }
}

export function getStaticPaths() {
  const ids = Array.from({ length: 18 }, (_, i) => String(i + 1));

  return {
    paths: ids.map(typeId => ({ params: { typeId }})),
    fallback: true
  };
}

export default function TypeDetails({ typeData, allTypes }: { typeData: IType & { moves: INamedApiResource<IMove>[] }, allTypes: IType[] }) {
  const { t } = useTranslation('common');
  const { settings } = useUser();
  const router = useRouter();

  if (!typeData || !settings) {
    return (
      <RootLayout title={`${t('pokedex.loading')}...`}>
        <div className="h-[inherit] p-4 bg-(--pokedex-red) flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </RootLayout>
    );
  }

  return <RootLayout title={`${t('type.title')} - ${capitilize(typeData.name)}`}>
    <div className="h-[inherit] p-4 bg-(--pokedex-red) md:overflow-[initial]">
      <div className="mx-auto px-4 overflow-auto bg-background rounded shadow-md h-[-webkit-fill-available] flex flex-col">
        <div className="flex items-center mt-4">
          <h2 className="w-fit text-xl font-semibold mb-2 mr-4">{capitilize(typeData.name)}</h2>
          <div className="grow"></div>
          <Select value={typeData.name} className="ml-4" onChange={(e) => router.push(`/type/${e.target.value}`)}>
            {allTypes.map((t, id) => {
              return <option key={id} value={t.name}>{capitilize(t.name)}</option>;
            })}
          </Select>
        </div>
        <div className="flex flex-col md:flex-row">
          <PokemonDefensiveChart types={[typeData.name]} name={typeData.name} />
          <PokemonOffensiveChart types={[typeData.name]} name={typeData.name} />
        </div>
        <div className="flex flex-col md:flex-row h-[-webkit-fill-available]">
          <div className="
            h-[-webkit-fill-available]
            sm:w-auto
            md:w-1/2
            flex
            flex-col
            md:items-start
            mr-0
            md:mr-4
            self-center
            md:self-start
            mt-4
            md:mt-0"
          >
            <MovesByType movesList={typeData.moves} type={typeData.name}></MovesByType>
          </div>
          <div className="
            h-[-webkit-fill-available]
            sm:w-auto
            md:w-1/2
            flex
            flex-col
            md:items-start
            mr-0
            self-center
            md:self-start
          ">
            <PokemonByType pokemonList={typeData.pokemon} type={typeData.name}></PokemonByType>
          </div>
        </div>
      </div>
    </div>
  </RootLayout>;
}