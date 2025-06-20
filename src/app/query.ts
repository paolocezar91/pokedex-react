import { IEvolutionChain, IMove, INamedApiResourceList, IPokemon, IPokemonSpecies, IPokemonType, IType } from "pokeapi-typescript";
// const API_URL = 'http://192.168.0.3:3030';
const API_URL = 'https://pokeapi.co';

export const fetchPokemonList = async (limit:number , offset: number) =>
  (await _fetchAndJson(`${API_URL}/api/v2/pokemon/?limit=${limit}&offset=${offset}`)) as INamedApiResourceList<IPokemon>;

export const fetchPokemonDataList = async (pkmnList: INamedApiResourceList<IPokemon>) => await Promise.all(
  pkmnList.results.map(async (pkmn) => {
    const pokemon = await _fetchAndJson(`${API_URL}/api/v2/pokemon/${pkmn.name}/`) as IPokemon;
    return { name: pokemon.name, types: pokemon.types, id: pokemon.id, sprites: pokemon.sprites, stats: pokemon.stats };
  })
);

export const fetchMove = async (id: string): Promise<IMove> => {
  return await _fetchAndJson(`${API_URL}/api/v2/move/${id}`) as IMove;
};

export const fetchPokemon = async (id: string): Promise<IPokemon> => {
  return await _fetchAndJson(`${API_URL}/api/v2/pokemon/${id}`) as IPokemon;
};

export const fetchSpecies = async (id: string): Promise<IPokemonSpecies> => {
  return await _fetchAndJson(`${API_URL}/api/v2/pokemon-species/${id}`) as IPokemonSpecies;
};

export const fetchTypes = async (types: IPokemonType[]): Promise<IType[]> => {
  const fetchType = async (id: string) => await _fetchAndJson(`${API_URL}/api/v2/type/${id}`) as IType;
  return Promise.all(types.map(type => fetchType(type.type.name)));
};

export const fetchEvolutionChain = async (species: IPokemonSpecies): Promise<IEvolutionChain> => {
  return await fetchURL<IEvolutionChain>(`${species.evolution_chain.url}`);
};

export const fetchURL = async <T>(url: string) => {
  return await _fetchAndJson(`${url}`) as T;
};

async function _fetchAndJson(url: string) {
  try {
    const data = await fetch(url, { cache: 'force-cache' });
    if (data.status === 200) {
      const json = await data.json();
      return json;
    }
    throw { status: 404, text: data.statusText };
  } catch (error) {
    throw { error };
  }
}

export async function postUrl(url: string, body: any) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (!res.ok) {
      throw new Error("Invalid credentials");
    }
    // Handle success (e.g., redirect)
  } catch (err: any) {
    throw err;
  } finally {
    return true;
  }
}