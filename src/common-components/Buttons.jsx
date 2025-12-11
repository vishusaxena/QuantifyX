import { Upload, RefreshCw, ArrowRight, Save, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const Button = ({
  handleSubmit,
  setTab,
  isReset = true,
  isNext = false,
  isAdd = true,
  tab = null,
  currentTab,
  handleReset,
  editMode,
  saveRef,
  isUpdate,
}) => {
  const { t } = useTranslation();

  const addLabel =
    currentTab === "address" || currentTab === "profile"
      ? editMode?.type === "address"
        ? t("button.update")
        : t("button.save")
      : editMode?.type === "employment" ||
        editMode?.type === "education" ||
        isUpdate
      ? t("button.update")
      : t("button.add");

  return (
    <div className="mt-6 flex lg:flex-row md:flex-row flex-col justify-end gap-3">
      {isAdd && (
        <button
          ref={saveRef}
          onClick={handleSubmit}
          className="
            flex items-center gap-2 px-8 py-2 font-medium rounded-xl
            transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.03]
            text-white 
            bg-linear-to-r from-blue-600 to-blue-700
            dark:from-[#1f2a44] dark:to-[#253253]
            blue:from-[#88e066] blue:to-[#6ec54e] blue:text-black
          "
        >
          {addLabel === "Add" ? <Plus size={18} /> : <Save size={18} />}
          {addLabel}
        </button>
      )}

      {isReset && (
        <button
          onClick={handleReset}
          className="
            flex items-center gap-2 px-8 py-2 font-medium rounded-xl
            transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.03]
            text-white 
            bg-linear-to-r from-green-500 to-green-600
            dark:from-[#244b36] dark:to-[#2d5d43]
            blue:from-[#59b336] blue:to-[#3f9028] blue:text-black
          "
        >
          <RefreshCw size={18} />
          {t("button.reset")}
        </button>
      )}

      {isNext && (
        <button
          onClick={() => setTab(tab)}
          className="
            flex items-center gap-2 px-8 py-2 font-medium rounded-xl
            transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.03]
            text-white 
            bg-linear-to-r from-red-500 to-red-600
            dark:from-[#5a2c2c] dark:to-[#6b3535]
            blue:from-[#8468de] blue:to-[#6d52d1] blue:text-black
          "
        >
          <ArrowRight size={18} />
          {t("button.next")}
        </button>
      )}
    </div>
  );
};

export default Button;
