import { ChangeEvent } from "react";

// eslint-disable-next-line no-unused-vars
export default function Toggle({value, children, onChange}: {value: boolean, children?: React.ReactNode, onChange: (_: boolean) => void }) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return <label className="inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" checked={value} onChange={handleChange} />
    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-(--pokedex-blue) dark:peer-focus:ring-white rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-(--pokedex-red-light) after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-(--pokedex-blue) dark:peer-checked:bg-(--pokedex-blue)"></div>
    <span className="ms-3 text-xs font-medium text-foreground">{children}</span>
  </label>
  ;
}