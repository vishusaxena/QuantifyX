import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { RiDraggable } from "react-icons/ri";
import DropArea from "./DropArea";

const Modal = ({ isOpen, onClose, data, id, onUpdateColumns }) => {
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
    const timer = setTimeout(
      () => handleSearch(searchedCol.toUpperCase()),
      500
    );

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
    onUpdateColumns(visibleColumns);
  };

  const handleReset = () => {
    setSearchedCol("");
    setIsSearching(false);
    setVisibleColumns(previousVisibleColumns);
    setHiddenColumns(previousHiddenColumns);
  };

  const column = isSearching ? searchedList : hiddenColumns;
  return (
    <div className="fixed inset-0 bg-black/50 h-screen w-screen flex justify-center items-center z-999 ">
      <div className="w-[700px] h-[500px] bg-white rounded-2xl px-4 py-2  ">
        <div className="flex flex-col justify-around  h-full">
          <div className="h-[80%] flex justify-between ">
            <div className="flex flex-col w-[48%] justify-between ">
              <div className="h-[10%] ">
                <div className="bg-white rounded-lg shadow-sm border px-2 py-1 h-full flex items-center gap-2">
                  <Search size={18} />
                  <input
                    type="text"
                    className="w-full focus:outline-none"
                    placeholder="Search"
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
                className="h-[88%] bg-white rounded-md shadow-inner border overflow-y-auto "
                onDragOver={handleOnDragOver}
                onDrop={handleDrop}
              >
                {column?.map((head, i) => (
                  <div
                    key={i}
                    className="w-full bg-blue-50 border py-2 px-2 rounded-md tracking-wide  flex justify-between items-center  cursor-grab active:cursor-grabbing "
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
              className="w-[50%] bg-white rounded-md shadow-inner border overflow-y-auto"
              onDragOver={handleOnVisibleDrag}
              onDrop={handleOnVisibleDrop}
            >
              <DropArea
                classes="w-full  px-2 rounded-md "
                onDrop={() => handleDropInSameColumn(0, draggedColumn)}
                onDragOver={handleDragOverInSameColumn}
              />
              {visibleColumns?.map((head, i) => (
                <div key={i}>
                  <div
                    className="w-full bg-blue-50 border py-2 px-2 rounded-md tracking-wide  flex justify-between items-center  cursor-grab active:cursor-grabbing "
                    draggable
                    onDrag={() => handleDragStart(head)}
                    onDragEnd={() => setDraggedColumn(null)}
                  >
                    {head}
                    <RiDraggable />
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
              className="bg-green-500 px-3 py-1 text-white"
              style={{ borderRadius: 8 }}
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              onClick={() => {
                onClose();
                handleSave();
              }}
              className="bg-red-500 px-3 py-1 text-white"
              style={{ borderRadius: 8 }}
            >
              Save & Cancel
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              className="bg-gray-500 px-3 py-1 text-white"
              style={{ borderRadius: 8 }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
