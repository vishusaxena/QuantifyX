import {
  CircleCheck,
  CircleX,
  MoveDown,
  MoveUp,
  RotateCcw,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

import { RiDraggable } from "react-icons/ri";
import DropArea from "../common-components/DropArea";
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

  const [previousHiddenColumns, setPreviousHiddenColumns] =
    useState(hiddenColumns);

  const [previousVisibleColumns, setPreviousVisibleColums] =
    useState(visibleColumns);

  const [searchedList, setSearchedList] = useState([]);
  const [searchedCol, setSearchedCol] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSwapBtn, setShowSwapBtn] = useState(null);
  useEffect(() => {
    setVisibleColumns(columnOrder);
  }, [columnOrder]);

  useEffect(() => {
    let timer;
    if (searchedCol !== "") {
      timer = setTimeout(() => handleSearch(searchedCol.toUpperCase()), 500);
    }

    return () => clearTimeout(timer);
  }, [searchedCol, hiddenColumns, visibleColumns]);

  const handleDragStart = (col) => {
    setDraggedColumn(col);
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();
  };

  const handleOnHiddenDrop = () => {
    if (!draggedColumn) return;
    const colExist = hiddenColumns.find((col) => col === draggedColumn);
    if (colExist) return;

    setHiddenColumns([...hiddenColumns, draggedColumn]);
    setVisibleColumns((prev) => prev.filter((head) => head !== draggedColumn));
  };

  const handleOnVisibleDrag = (e) => e.preventDefault();

  const handleOnVisibleDrop = () => {
    if (!draggedColumn) return;
    console.log(visibleColumns);
    const colExist = visibleColumns.find((col) => col === draggedColumn);
    if (colExist) return;

    setVisibleColumns([...visibleColumns, draggedColumn]);
    setHiddenColumns((prev) => prev.filter((head) => head !== draggedColumn));
  };

  const handleSearch = (str) => {
    const filteredSearch = hiddenColumns.filter((col) => {
      const column = col.toUpperCase();
      if (column.includes(str)) return true;
      else return false;
    });

    setSearchedList(filteredSearch);
  };

  const handleDragOverInSameColumn = (e) => e.preventDefault();

  const handleOnDropInSameColumn = (dropIndex) => {
    if (!draggedColumn) return;

    const fromIndex = visibleColumns.indexOf(draggedColumn);
    if (fromIndex === -1) return;

    let targetIndex = dropIndex;

    if (fromIndex < dropIndex) {
      targetIndex = dropIndex - 1;
    }

    if (fromIndex === targetIndex) return;

    const updated = [...visibleColumns];
    updated.splice(fromIndex, 1);
    updated.splice(targetIndex, 0, draggedColumn);

    setVisibleColumns(updated);
    setDraggedColumn(null);
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
    setShowSwapBtn(null);
  };

  const handleMoveUp = (head) => {
    const updated = visibleColumns.filter((col) => col !== head);
    updated.splice(0, 0, head);
    setVisibleColumns(updated);
  };

  const handleMoveDown = (head) => {
    const updated = visibleColumns.filter((col) => col !== head);
    updated.splice(visibleColumns.length - 1, 0, head);
    setVisibleColumns(updated);
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
                className="h-[88%] rounded-md shadow-inner border overflow-y-auto 
                         light:bg-white 
                         dark:bg-[#101626] 
                         blue:bg-[#1a1a1a]"
                onDragOver={handleOnDragOver}
                onDrop={handleOnHiddenDrop}
              >
                <span
                  className="rounded-md flex items-center justify-center py-2 font-medium tracking-wide
                           light:bg-gray-400 light:text-white
                             dark:bg-linear-to-r dark:from-blue-700 dark:to-indigo-800 dark:text-white
                             blue:bg-linear-to-r blue:from-green-500 blue:to-lime-500 blue:text-black"
                >
                  {t("hiddenColumns")}
                </span>
                {column?.map((head, i) => (
                  <div
                    key={i}
                    className="w-full border py-2 px-2 rounded-md tracking-wide flex justify-between items-center 
                               cursor-grab active:cursor-grabbing transition
                              light:bg-blue-50
                               dark:bg-linear-to-r dark:from-[#1b263b] dark:to-[#0d1b2a] dark:text-gray-100
                            blue:bg-[#232323] blue:text-gray-200 blue:border-gray-600"
                    draggable
                    onDragStart={() => handleDragStart(head)}
                  >
                    {head}
                    <RiDraggable className="opacity-80" />
                  </div>
                ))}
              </div>
            </div>
            <div
              className="w-[50%] light:bg-white dark:bg-[#141b34] blue:bg-[#282828] rounded-md shadow-inner border overflow-y-auto"
              onDragOver={handleOnVisibleDrag}
              onDrop={handleOnVisibleDrop}
            >
              <span
                className="rounded-md flex items-center justify-center py-2 font-medium tracking-wide
                          light:bg-gray-400 light:text-white
                          dark:bg-linear-to-r dark:from-blue-700 dark:to-indigo-800 dark:text-white
                          blue:bg-linear-to-r blue:from-green-500 blue:to-lime-500 blue:text-black sticky top-0"
              >
                {t("visibleColumns")}
              </span>
              <DropArea
                classes="w-full h-10 px-2 rounded-md"
                onDrop={() => handleOnDropInSameColumn(0)}
                onDragOver={handleDragOverInSameColumn}
              />

              {visibleColumns?.map((head, i) => (
                <div key={i}>
                  <div
                    className={` 
                               ${
                                 showSwapBtn === head
                                   ? "light:bg-blue-200 dark:from-[#24304d] dark:to-[#161f33] blue:bg-[#2d2d2d]"
                                   : "light:bg-blue-50"
                               }
                                 w-full border py-2 px-2 rounded-md tracking-wide flex justify-between items-center 
                                 cursor-pointer active:cursor-grabbing 
                                 dark:bg-linear-to-r dark:from-[#1b263b] dark:to-[#0d1b2a] dark:text-gray-100
                                 blue:bg-[#232323] blue:text-gray-200 blue:border-gray-600 
                             `}
                    draggable
                    onDragStart={() => handleDragStart(head)}
                    onMouseOver={() => setShowSwapBtn(head)}
                    onMouseLeave={() => setShowSwapBtn(null)}
                  >
                    {head}

                    <div className="flex gap-2 items-center">
                      {showSwapBtn === head && (
                        <div className="flex gap-1 ">
                          <button
                            onClick={() => handleMoveUp(head)}
                            disabled={i === 0}
                            className={`${
                              i === 0
                                ? "opacity-30 cursor-not-allowed"
                                : "hover:text-blue-500"
                            }`}
                          >
                            <MoveUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveDown(head)}
                            disabled={i === visibleColumns.length - 1}
                            className={`${
                              i === visibleColumns.length - 1
                                ? "opacity-30 cursor-not-allowed"
                                : "hover:text-blue-500"
                            }`}
                          >
                            <MoveDown size={14} />
                          </button>
                        </div>
                      )}

                      <RiDraggable className="dark:text-gray-200 opacity-80" />
                    </div>
                  </div>

                  <DropArea
                    classes="w-full h-10 px-2 rounded-md"
                    onDrop={() => handleOnDropInSameColumn(i + 1)}
                    onDragOver={handleDragOverInSameColumn}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className=" flex justify-end gap-2 ">
            <button
              className="px-3 py-1 text-white flex items-center gap-2 rounded-lg 
                         bg-linear-to-r from-green-500 to-emerald-600 hover:opacity-90 transition"
              onClick={handleReset}
              style={{ borderRadius: 8 }}
            >
              <RotateCcw size={16} /> {t("reset")}
            </button>

            <button
              onClick={() => {
                onClose();
                handleSave();
              }}
              className="px-3 py-1 text-white flex items-center gap-2 rounded-lg 
                         bg-linear-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition"
              style={{ borderRadius: 8 }}
            >
              <CircleCheck size={16} /> {t("save")}
            </button>

            <button
              onClick={onClose}
              className="px-3 py-1 text-white flex items-center gap-2 rounded-lg 
                         bg-linear-to-r from-gray-500 to-gray-600 hover:opacity-90 transition"
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
