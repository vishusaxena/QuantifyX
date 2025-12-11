import { CircleCheck, CircleX, RotateCcw, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { RiDraggable } from "react-icons/ri";
import DropArea from "./DropArea";
import { t } from "i18next";

const Modal = ({ isOpen, onClose, data, id, columnOrder, setColumnOrder }) => {
  if (!isOpen) return null;

  const [draggedColumn, setDraggedColumn] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    const stored = localStorage.getItem(`hiddenColumns_${id}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const stored = localStorage.getItem(`visibleColumns_${id}`);
    return stored ? JSON.parse(stored) : data;
  });
  const [previousHiddenColumns, setPreviousHiddednColumns] =
    useState(hiddenColumns);
  const [previousVisibleColumns, setPreviousVisibleColums] =
    useState(visibleColumns);

  const [searchedList, setSearchedList] = useState([]);
  const [searchedCol, setSearchedCol] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setVisibleColumns(columnOrder);
  }, [columnOrder]);
  useEffect(() => {
    let timer;
    if (searchedCol !== "") {
      timer = setTimeout(() => handleSearch(searchedCol.toUpperCase()), 500);
    }

    return () => clearTimeout(timer);
  }, [searchedCol]);

  const handleDragStart = (col) => {
    setDraggedColumn(col);
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = () => {
    if (!draggedColumn) return;
    const colExist = hiddenColumns.find((col) => col === draggedColumn);
    if (colExist) return;

    setPreviousHiddednColumns(hiddenColumns);
    setPreviousVisibleColums(visibleColumns);

    setHiddenColumns([...hiddenColumns, draggedColumn]);
    setVisibleColumns((prev) => prev.filter((head) => head !== draggedColumn));
  };

  const handleOnVisibleDrag = (e) => e.preventDefault();
  const handleOnVisibleDrop = () => {
    if (!draggedColumn) return;
    const colExist = visibleColumns.find((col) => col === draggedColumn);
    if (colExist) return;
    setPreviousHiddednColumns(hiddenColumns);
    setPreviousVisibleColums(visibleColumns);
    setVisibleColumns([...visibleColumns, draggedColumn]);
    setHiddenColumns((prev) => prev.filter((head) => head !== draggedColumn));
  };
  const handleSearch = (str) => {
    console.log("searching......");
    const filteredSearch = hiddenColumns.filter((col) => {
      const column = col.toUpperCase();
      if (column.includes(str)) return true;
      else return false;
    });

    setSearchedList(filteredSearch);
  };

  const handleDragOverInSameColumn = (e) => e.preventDefault();
  const handleDropInSameColumn = (i, draggedColumn) => {
    setPreviousVisibleColums(visibleColumns);
    let updatedData = visibleColumns.filter((col) => col !== draggedColumn);
    updatedData.splice(i, 0, draggedColumn);
    setVisibleColumns(updatedData);
  };

  const handleSave = () => {
    localStorage.setItem(`hiddenColumns_${id}`, JSON.stringify(hiddenColumns));
    localStorage.setItem(
      `visibleColumns_${id}`,
      JSON.stringify(visibleColumns)
    );
    setColumnOrder(visibleColumns);
  };

  const handleReset = () => {
    setSearchedCol("");
    setIsSearching(false);
    setVisibleColumns(previousVisibleColumns);
    setHiddenColumns(previousHiddenColumns);
  };

  const column = isSearching ? searchedList : hiddenColumns;
  return (
    <div className="fixed inset-0 bg-black/50 h-screen w-screen flex justify-center backdrop-blur-xs items-center z-999 ">
      <div className="w-[700px] h-[500px] light:bg-white rounded-2xl px-4 py-2 border  dark:border-gray-200 dark:bg-[#0a0f24] blue:bg-[#121212] blue:border-white ">
        <div className="flex flex-col justify-around  h-full">
          <div className="h-[80%] flex justify-between ">
            <div className="flex flex-col w-[48%] justify-between ">
              <div className="h-[10%] ">
                <div className="light:bg-white dark:bg-[#141b34] blue:bg-[#282828] rounded-lg shadow-sm border px-2 py-1 h-full flex items-center gap-2">
                  <Search
                    size={18}
                    className="dark:text-white blue:text-white"
                  />
                  <input
                    type="text"
                    className="w-full focus:outline-none light:text-black dark:text-white blue:text-white"
                    placeholder={t("search")}
                    value={searchedCol}
                    onChange={(e) => {
                      if (e.target.value !== "") setIsSearching(true);
                      else setIsSearching(false);
                      setSearchedCol(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div
                className="h-[88%] light:bg-white dark:bg-[#141b34] blue:bg-[#282828] rounded-md shadow-inner border overflow-y-auto  "
                onDragOver={handleOnDragOver}
                onDrop={handleDrop}
              >
                <span className="light:bg-gray-400 text-white dark:bg-blue-600 blue:bg-green-500  rounded-md flex items-center justify-center py-2">
                  {t("hiddenColumns")}
                </span>
                {column?.map((head, i) => (
                  <div
                    key={i}
                    className="w-full light:bg-blue-50 dark:text-white dark:bg-[linear-gradient(135deg,#0f766e,#064e3b)] blue:bg-[#b7f764] blue:text-black border py-2 px-2 rounded-md tracking-wide  flex justify-between items-center  cursor-grab active:cursor-grabbing "
                    draggable
                    onDrag={() => handleDragStart(head)}
                    onDragEnd={() => setDraggedColumn(null)}
                  >
                    {head}
                    <RiDraggable />
                  </div>
                ))}
              </div>
            </div>
            <div
              className="w-[50%] light:bg-white dark:bg-[#141b34] blue:bg-[#282828] rounded-md shadow-inner border overflow-y-auto"
              onDragOver={handleOnVisibleDrag}
              onDrop={handleOnVisibleDrop}
            >
              <span className="light:bg-gray-400 text-white dark:bg-blue-600 blue:bg-green-500 rounded-md flex items-center justify-center py-2 sticky top-0">
                {t("visibleColumns")}
              </span>
              <DropArea
                classes="w-full  px-2 rounded-md "
                onDrop={() => handleDropInSameColumn(0, draggedColumn)}
                onDragOver={handleDragOverInSameColumn}
              />
              {visibleColumns?.map((head, i) => (
                <div key={i}>
                  <div
                    className="w-full light:bg-blue-50 dark:bg-[linear-gradient(135deg,#0f766e,#064e3b)] blue:bg-[#b7f764] blue:text-black dark:text-white border py-2 px-2 rounded-md tracking-wide  flex justify-between items-center  cursor-grab active:cursor-grabbing "
                    draggable
                    onDrag={() => handleDragStart(head)}
                    onDragEnd={() => setDraggedColumn(null)}
                  >
                    {head}
                    <RiDraggable className="dark:text-white" />
                  </div>
                  <DropArea
                    classes="w-full  px-2 rounded-md "
                    onDrop={() => handleDropInSameColumn(i + 1, draggedColumn)}
                    onDragOver={handleDragOverInSameColumn}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className=" flex justify-end gap-2 ">
            <button
              className="bg-green-500 px-3 py-1 text-white flex items-center gap-2 "
              style={{ borderRadius: 8 }}
              onClick={handleReset}
            >
              <RotateCcw size={16} /> {t("reset")}
            </button>
            <button
              onClick={() => {
                onClose();
                handleSave();
              }}
              className="bg-red-500 px-3 py-1 text-white flex items-center gap-2 "
              style={{ borderRadius: 8 }}
            >
              <CircleCheck size={16} /> {t("save")}
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              className="bg-gray-500 px-3 py-1 text-white flex items-center gap-2"
              style={{ borderRadius: 8 }}
            >
              <CircleX size={16} /> {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
