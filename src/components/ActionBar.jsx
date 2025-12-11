import React from "react";
import { User, Plus, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

const ActionBar = ({ masterName, buttonName, onOpen, onClicked }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full px-2 pb-1 flex justify-center">
      <div className="w-full flex items-center justify-between mt-3 light:bg-white dark:bg-[#141b34] blue:bg-[#282828] shadow-md rounded-md p-4 ">
        <div className="text-2xl font-semibold flex gap-2 items-center text-gray-700">
          <User
            size={30}
            className="dark:text-gray-200 blue:text-[#fdf379] light:text-black"
          />
          <span className="dark:text-gray-200 blue:text-[#ffffff] text-md light:text-black md:text-md lg:text-lg text-sm">
            {t(masterName)}
          </span>
        </div>

        {buttonName && (
          <div className="flex gap-3">
            <button
              onClick={onClicked}
              style={{ borderRadius: 7 }}
              className="
                flex gap-1 items-center 
                border md:px-6 md:py-2 px-2 py-1 text-sm md:text-md lg:text-lg 
                shadow-md transition-all duration-200 lg:px-6 lg:py-2

                light:text-white 
                light:bg-linear-to-r light:from-blue-600 light:to-blue-700 
                light:hover:scale-105 light:hover:shadow-lg 
                light:border-blue-300

                dark:bg-linear-to-r dark:from-[#1e2a47] dark:to-[#243157]
                dark:text-gray-100 dark:hover:scale-105 dark:hover:shadow-lg
                dark:border-[#304485]

                blue:bg-linear-to-r blue:from-[#6c6c6c] blue:to-[#4f4f4f]
                blue:text-white blue:hover:scale-105 blue:hover:shadow-lg
                blue:border-[#575757]
              "
            >
              <Download size={16} />
              <span className="hidden md:inline lg:inline">{t("export")}</span>
            </button>

            <button
              onClick={onOpen}
              style={{ borderRadius: 7 }}
              className="
                flex items-center gap-1 px-2 py-1 md:px-6 md:py-2 lg:px-6 lg:py-2
                text-sm md:text-md lg:text-lg 
                rounded-[5px] shadow-md transition-all duration-200

                light:bg-linear-to-r light:from-yellow-400 light:to-yellow-500 
                light:text-black light:hover:scale-105 light:hover:shadow-lg

                dark:bg-linear-to-r dark:from-[#3b82f6] dark:to-[#2563eb] 
                dark:text-white dark:hover:scale-105 dark:hover:shadow-lg

                blue:bg-linear-to-r blue:from-[#fbf15f] blue:to-[#f4e82f]
                blue:text-black blue:hover:scale-105 blue:hover:shadow-lg
              "
            >
              <Plus size={15} />
              <span className="hidden md:inline lg:inline">
                {t(buttonName)}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
