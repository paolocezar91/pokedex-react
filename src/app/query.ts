import { IEvolutionChain, IMove, INamedApiResourceList, IPokemon, IPokemonSpecies, IPokemonType, IType } from "pokeapi-typescript";
export default class PokeApiQuery {
  private apiUrl: string;

  constructor(api: string = process.env.POKEAPI_URL as string) {
    this.apiUrl = api;
  }

  getPokemonList = async (limit:number , offset: number) =>
    (await this._fetchAndJson(`${this.apiUrl}/api/v2/pokemon/?limit=${limit}&offset=${offset}`)) as INamedApiResourceList<IPokemon>;

  getPokemonDataList = async (pkmnList: INamedApiResourceList<IPokemon>) => await Promise.all(
    pkmnList.results.map(async (pkmn) => {
      const pokemon = await this._fetchAndJson(`${this.apiUrl}/api/v2/pokemon/${pkmn.name}/`) as IPokemon;
      return { name: pokemon.name, types: pokemon.types, id: pokemon.id, sprites: pokemon.sprites, stats: pokemon.stats };
    })
  );

  getMove = async (id: string): Promise<IMove> => {
    return await this._fetchAndJson(`${this.apiUrl}/api/v2/move/${id}`) as IMove;
  };

  getPokemon = async (id: string): Promise<IPokemon> => {
    return await this._fetchAndJson(`${this.apiUrl}/api/v2/pokemon/${id}`) as IPokemon;
  };

  getSpecies = async (id: string): Promise<IPokemonSpecies> => {
    return await this._fetchAndJson(`${this.apiUrl}/api/v2/pokemon-species/${id}`) as IPokemonSpecies;
  };

  getTypes = async (types: IPokemonType[]): Promise<IType[]> => {
    const fetchType = async (id: string) => await this._fetchAndJson(`${this.apiUrl}/api/v2/type/${id}`) as IType;
    return Promise.all(types.map(type => fetchType(type.type.name)));
  };

  getEvolutionChain = async (species: IPokemonSpecies): Promise<IEvolutionChain> => {
    return await this.fetchURL<IEvolutionChain>(`${species.evolution_chain.url}`);
  };

  getUser = async (user_id: number) => {
    return await this.fetchURL(`${this.apiUrl}/api/v2/user/${user_id}`);
  };

  getSettings = async (user_id: number) => {
    return await this.fetchURL(`${this.apiUrl}/api/v2/user/${user_id}/settings`);
  };

  fetchURL = async <T>(url: string) => {
    return await this._fetchAndJson(`${this.apiUrl}${url}`) as T;
  };

  private _fetchAndJson = async (url: string) => {
    try {
      const data = await fetch(url, { cache: 'force-cache' });
      if (data.status === 200) {
        const json = await data.json();
        return json;
      }
      throw { status: 404, text: data.statusText };
    } catch (error) {
      console.log({ error });
      throw { error };
    }
  };

  postUrl = async <T>(url: string, body: Record<string, unknown>) => {
    try {
      const data = await fetch(`${this.apiUrl}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!data.ok) {
        throw new Error("Invalid credentials");
      }
      const json = await data.json();
      return json as T;
      // Handle success (e.g., redirect)
    } catch (err: any) {
      throw err;
    }
  };

}
