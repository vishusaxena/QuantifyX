import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
  ];

  const selected =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
          text-white  transition "
      >
        <Globe className="w-5 h-5 text-white" />
        <span>{selected.label}</span>
      </button>

      {open && (
        <div
          className="absolute mt-2 w-48 light:bg-[#3b82f6] text-white blue:bg-[#282828]  dark:bg-gray-800 shadow-lg rounded-xl 
          border dark:border-gray-300 overflow-hidden z-50"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              className="w-full flex items-center gap-2 px-4 py-2
              text-white light:hover:bg-blue-700 dark:hover:bg-gray-700 blue:hover:bg-[#201e1e] text-left"
            >
              <span className="text-lg text-white ">{lang.flag}</span>
              <span className="text-sm text-white ">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
