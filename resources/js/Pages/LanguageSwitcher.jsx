import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className="flex gap-2 text-sm">
      <button onClick={() => changeLanguage('ru')}>RU</button>
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('zh')}>中文</button>
    </div>
  );
};

export default LanguageSwitcher;
