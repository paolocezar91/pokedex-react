import Link from "next/link";

export default function Footer() {
  const me = <Link href="https://github.com/paolocezar91/" target="_blank" className="underline">Paolo Pestalozzi</Link>;
  const pokeApi = <Link href="https://pokeapi.co/" target="_blank" className="underline">PokeAPI</Link>;
  const nextJs = <Link href="http://nextjs.org/" target="_blank" className="underline">Next.js</Link>;
  const credits = <p>
    By {me} with {pokeApi} and {nextJs}.
  </p>;

  return <div className="
    footer
    container
    w-full
    fixed
    bottom-0
    flex
    justify-between
    border-solid
    border-t-2
    border-(--pokedex-red-light)
    bg-(--pokedex-red)
    py-2
    px-4
  ">
    <div className="flex items-center text-xs text-white">
      { credits }
    </div>
  </div>;
}
