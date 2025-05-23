import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '../../shared/tooltip/tooltip';

// eslint-disable-next-line no-unused-vars
export default function PokemonFilter({ onFilter, className }: { onFilter: (_: string) => void, className?: string }) {
  const { t } = useTranslation('common');

  const [filterText, setFilterText] = useState('');

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setFilterText(text);
    if(text.length === 0 || text.length > 1){
      onFilter(text);
    }
  };

  return (
    <Tooltip content={t("actions.filter.tooltip")}>
      <input
        value={filterText}
        name="filter"
        className={`w-30 md:w-100 text-sm bg-white rounded-lg border-2 border-[#212529] text-[#212529] p-2 ${className}`}
        type="text"
        placeholder={t("actions.filter.placeholder")}
        onChange={handleFilter} />
    </Tooltip>
  );
}