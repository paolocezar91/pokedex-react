import { capitilize, kebabToSpace } from "@/pages/pokedex/utils";
import { IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

export const statName = (name: string) => {
  let rv = '';
  switch(name) {
  case 'hp':
    rv = 'HP';
    break;
  case 'special-attack':
    rv = 'Sp.Att';
    break;
  case 'special-defense':
    rv = 'Sp.Def';
    break;
  case 'defense':
    rv = 'Def';
    break;
  case 'attack':
    rv = 'Att';
    break;
  case 'speed':
    rv = 'Spd';
    break;
  default:
    rv = capitilize(kebabToSpace(name));
    break;
  }
  return rv;
};

export default function PokemonStats({pokemon}: {pokemon: IPokemon}) {
  const {t} = useTranslation('common');

  const progressBar = (value: number, dividedBy: number) => {
    return <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${value*100/dividedBy}%`}}></div>
    </div>;
  };
  const total = pokemon.stats.reduce((acc, stat) => acc += stat.base_stat, 0);


  return <div className="stats col-span-2 md:col-span-1">
    <h3 className="text-lg font-semibold mb-4">{ t('pokedex.details.stats.title') }</h3>
    <table className="w-full">
      <tbody>
        {pokemon.stats.map((stat, i) => {
          return <tr key={i}>
            <th className={`w-[20%] text-left ${i === pokemon.stats.length - 1 ? 'pb-1' : ''}`}>
              { statName(stat.stat.name) }
            </th>
            <td className={`w-[18%] text-center px-4 ${i === pokemon.stats.length - 1 ? 'pb-1' : ''}`}>{stat.base_stat}</td>
            <td className={`${i === pokemon.stats.length - 1 ? 'pb-1' : ''}`}>{progressBar(stat.base_stat, 255)}</td>
          </tr>;
        })}
        <tr>
          <th className="w-[20%] text-left border-t-1 border-solid border-foreground">Total</th>
          <td className="w-[18%] text-center border-t-1 border-solid border-foreground px-4">{total}</td>
          <td className="border-t-1 border-solid border-foreground">{progressBar(total, 255*6)}</td>
        </tr>
      </tbody>
    </table>
  </div>;
}