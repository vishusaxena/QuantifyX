import { useState, useRef, useEffect } from "react";
import { ChevronUp, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DeletedLog({ deletedLog }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const logRef = useRef(null);
  const viewDetailsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        viewDetailsRef.current &&
        !viewDetailsRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {deletedLog.length > 0 && (
        <div
          onClick={() => setOpen(true)}
          ref={viewDetailsRef}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 
                     bg-red-600 text-white px-4 sm:px-6 py-2 
                     rounded-full shadow-lg cursor-pointer flex items-center gap-2 
                     hover:bg-red-700 transition z-40"
        >
          <ChevronUp size={18} />
          <span className="font-medium text-[9px] md:text-sm">
            {t("deletedLog.viewDeletedEntries")} ({deletedLog.length})
          </span>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-end z-50">
          <div
            className="bg-white dark:bg-gray-900 
                       w-full max-h-[80vh] md:max-h-[60vh] 
                       rounded-t-2xl shadow-xl 
                       p-4 sm:p-6 
                       animate-[slideUp_0.3s_ease-out]"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg sm:text-xl dark:text-white">
                {t("deletedLog.title")}
              </h3>
              <button onClick={() => setOpen(false)}>
                <X className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <div
              ref={logRef}
              className="overflow-y-auto border rounded-md p-3 
                         h-[55vh] md:h-[45vh]"
            >
              {deletedLog.map((item) => (
                <div
                  key={item.AwbNo}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center 
                             px-3 py-3 border-b 
                             border-gray-300 dark:border-gray-700  gap-2"
                >
                  <div className="text-sm dark:text-gray-800">
                    <span className="font-medium">
                      {t("deletedLog.awbNo")}:
                    </span>{" "}
                    {item.AwbNo}
                  </div>

                  <div className="text-sm text-red-600 dark:text-red-400 sm:ml-4 break-all">
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0%); opacity: 1; }
        }
      `}</style>
    </>
  );
}
