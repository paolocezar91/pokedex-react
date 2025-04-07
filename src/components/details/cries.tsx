import { IPokemon } from "pokeapi-typescript";

interface PokeIPokemon extends IPokemon {
  cries: {
    legacy?: string;
    latest?: string;
  };
}

export default function PokemonCries({ pokemon }: { pokemon: IPokemon }) {
  const cry = (pokemon as PokeIPokemon).cries?.latest;
  return (cry && (
    <div className="pokemon-cries mt-2">
      <h3 className="text-lg font-semibold mb-2">Cry</h3>
      <audio controls src={cry} className="w-full" />
    </div>
  ));
}