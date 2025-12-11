function TabComponent({ tabs, setTab, tab }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-md">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => setTab(t.value)}
          className={`
            px-2 py-2 rounded-md font-medium border transition-all duration-200
            text-sm md:text-base
            ${
              t.value === tab
                ? `
                  light:bg-blue-700 light:text-white light:border-blue-700
                  dark:bg-[#304485] dark:text-white dark:border-[#304485]
                  blue:bg-[#b7f764] blue:text-black blue:border-[#8ccc42]
                  shadow-md scale-[1.03]
                `
                : `
                  light:border-blue-300 light:text-blue-700 
                  dark:text-gray-200 dark:border-gray-600
                  blue:text-white blue:border-[#888]
                  light:hover:bg-blue-100 dark:hover:bg-[#1f2a4a] 
                  hover:shadow-sm
                `
            }
          `}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default TabComponent;
