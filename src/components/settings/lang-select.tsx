import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import nextI18nextConfig from "../../../next-i18next.config";
import Select from "../shared/select";
import { useSnackbar } from "@/context/snackbar";

export default function LangSelect({
  currentLanguage = 'en-US',
}: {
  currentLanguage?: string,
}) {
  const { t, i18n } = useTranslation('common');
  const locales = nextI18nextConfig.i18n.locales;
  const { showSnackbar } = useSnackbar();

  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    showSnackbar(t('settings.languageOptions.languageUpdate'), 5);
  };
  return <label htmlFor="lang">
    <div className="flex flex-col mb-4">
      <span>{t('settings.languageOptions.language')}:</span>
      <Select
        data-testid="lang"
        id="lang"
        value={currentLanguage}
        onChange={handleLangChange}>
        {
          locales.map((lang: string) => {
            return <option
              key={lang}
              value={lang}
              className="text-xs"
            >
              {lang}
            </option>;
          })
        }
      </Select>
      <div className="text-xs hover:text-(--pokedex-red) w-75">
        { t('settings.languageOptions.languageTooltip') }
      </div>
    </div>
  </label>;
}