import React, { useState, useEffect, useRef, use } from "react";
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pin,
  PinOff,
  Scale,
  SquarePen,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { closestCenter, DndContext, useDroppable } from "@dnd-kit/core";
import { mergeRefs } from "react-merge-refs";
import { RiDraggable } from "react-icons/ri";

const DataTable = ({
  data,
  onEdit,
  onOpen,
  onRowSelect,
  selectedRows = [],
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  tableId = "data-table",
}) => {
  const { t } = useTranslation();

  const [selectedAction, setSelectedAction] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [pinned, setPinned] = useState(() => {
    const saved = localStorage.getItem("pinnedColumns");
    return saved ? JSON.parse(saved) : {};
  });
  const [columnOrder, setColumnOrder] = useState(() => {
    const saved = localStorage.getItem(`columnOrder_${tableId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [visiblecolumnList, setVisibleColumnList] = useState(() => {
    const stored = localStorage.getItem(`visibleColumns_${tableId}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [colWidths, setColWidths] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pinnedRefs = useRef({});
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [page]);

  useEffect(() => {
    localStorage.setItem("pinnedColumns", JSON.stringify(pinned));
  }, [pinned]);

  useEffect(() => {
    localStorage.setItem(`columnOrder_${tableId}`, JSON.stringify(columnOrder));
  }, [columnOrder]);

  useEffect(() => {
    if (data?.Data?.length) {
      const keys = Object.keys(data.Data[0]);

      const ordered = keys.includes("SrNo")
        ? ["SrNo", ...keys.filter((k) => k !== "SrNo")]
        : keys;

      if (columnOrder.length === 0) {
        setColumnOrder(ordered);
      }
    }
    if (visiblecolumnList?.length) {
      setColumnOrder(visiblecolumnList);
    }
  }, [data, visiblecolumnList]);

  if (!data || !data.Data)
    return (
      <div className="p-4 light:text-black blue:text-white dark:text-white text-lg flex justify-center items-center ">
        {t("table.noDataAvailable")}
      </div>
    );

  const totalRecords = data.Data.length;
  const totalPages = Math.ceil(totalRecords / perPage);
  const start = (page - 1) * perPage;
  const currentData = data.Data.slice(start, start + perPage);
  const hideColumns = data.HideColumns;

  let allKeys = Object.keys(currentData[0] || {});

  if (allKeys.includes("SrNo")) {
    allKeys = ["SrNo", ...allKeys.filter((k) => k !== "SrNo")];
  }
  const visibleColumns = columnOrder.filter(
    (key) => !hideColumns.includes(key)
  );

  const hasActions = data.Actions && data.Actions.length > 1;

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedRows = [...currentData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const A = a[sortConfig.key];
    const B = b[sortConfig.key];
    if (A < B) return sortConfig.direction === "asc" ? -1 : 1;
    if (A > B) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const hasCheckbox = allKeys.includes("Checkbox");

  const toggleRow = (id) => {
    const updated = selectedRows.includes(id)
      ? selectedRows.filter((x) => x !== id)
      : [...selectedRows, id];

    onRowSelect(updated);
  };

  const toggleAll = () => {
    if (selectedRows.length === currentData.length) {
      onRowSelect([]);
    } else {
      onRowSelect(currentData.map((r) => r.Checkbox));
    }
  };

  const handlePinAndUnpin = (col) => {
    setPinned((prev) => ({
      ...prev,
      [col]: !prev[col],
    }));
  };

  const registerPinnedRef = (col) => (el) => {
    if (!el) return;
    pinnedRefs.current[col] = el;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      setColWidths((prev) => ({ ...prev, [col]: width }));
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  };

  const getLeftOffset = (col) => {
    const pinnedCols = visibleColumns.filter((c) => pinned[c]);

    if (hasCheckbox && pinned["Checkbox"]) pinnedCols.unshift("Checkbox");

    const index = pinnedCols.indexOf(col);
    if (index === -1) return 0;

    return pinnedCols.slice(0, index).reduce((sum, c) => {
      if (c === "Checkbox") return sum + (colWidths["Checkbox"] + 15 || 40);
      return sum + (colWidths[c] + 15 || 0);
    }, 0);
  };

  const handleColumnDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setColumnOrder((prev) => {
      const oldIndex = prev.indexOf(active.id);
      const newIndex = prev.indexOf(over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <>
      <div className="w-full px-2 h-[400px]">
        <div
          className="px-1 py-1 font-semibold  light:text-gray-700 dark:text-gray-200 blue:text-[#ffffff]
                     flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <div>
            {t("table.totalRecords")}: {totalRecords}
          </div>

          {hasCheckbox && (
            <div>
              {t("table.selectedRows")}: {selectedRows.length}
            </div>
          )}

          {hasCheckbox && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 ">
                <select
                  className="custom-select "
                  onChange={(e) => setSelectedAction(e.target.value)}
                >
                  <option value="">{t("table.selectPlaceholder")}</option>
                  <option value="Bulk Delete">{t("table.bulkDelete")}</option>
                </select>

                <button
                  className={`px-2 py-.5 rounded-lg font-medium shadow-md transition-all
                              ${
                                selectedAction && selectedRows.length > 0
                                  ? `bg-linear-to-r from-blue-500 to-blue-600 
                                hover:from-blue-600 hover:to-blue-700
                                dark:from-green-500 dark:to-green-600
                                text-white`
                                  : "bg-green-500 dark:bg-green-600 text-white "
                              }`}
                  onClick={() => {
                    if (!selectedAction)
                      return toast.error(t("table.errorSelectAction"));
                    if (selectedRows.length === 0)
                      return toast.error(t("table.errorSelectRow"));
                    if (selectedAction === "Bulk Delete") onOpen();
                  }}
                  style={{
                    borderRadius: 8,
                    cursor:
                      selectedAction && selectedRows.length > 0
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  {t("table.ok")}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end  mt-1 mb-1  ">
          <span className="dark:text-white blue:text-white">
            <SquarePen
              size={20}
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer "
            />
          </span>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={visibleColumns}
          id={tableId}
          onUpdateColumns={(updated) => setVisibleColumnList(updated)}
        />
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleColumnDragEnd}
        >
          <div
            className="w-full overflow-x-auto max-h-[75%] shrink-0 "
            ref={scrollRef}
          >
            <div className="w-screen rounded   shadow-sm">
              <table
                className="w-full border-collapse light:border-gray-200 text-sm md:text-base  "
                id="tableData"
              >
                <thead className="sticky top-0 z-3 bg-[#fcfffa] dark:bg-[#304485] blue:bg-[#e69811] text-gray-600 dark:text-gray-200 blue:text-white">
                  <tr>
                    {hasCheckbox && (
                      <th
                        className={` ${
                          pinned["Checkbox"]
                            ? "sticky light:bg-[#f3f4f6] dark:bg-[#3c559e] blue:bg-[#f2ad32] z-2 bg-[#fcfffa] "
                            : ""
                        } p-2 md:p-3  text-left w-10 whitespace-nowrap`}
                        ref={
                          pinned["Checkbox"]
                            ? registerPinnedRef("Checkbox")
                            : null
                        }
                        style={
                          pinned["Checkbox"]
                            ? { left: getLeftOffset("Checkbox") }
                            : {}
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedRows.length === currentData.length}
                          onChange={toggleAll}
                          className="cursor-pointer"
                        />
                        <span className="ml-1">{t("table.All")}</span>
                        <button onClick={() => handlePinAndUnpin("Checkbox")}>
                          {pinned["Checkbox"] ? (
                            <PinOff size={16} />
                          ) : (
                            <Pin size={16} />
                          )}
                        </button>
                      </th>
                    )}
                    <SortableContext
                      items={visibleColumns}
                      strategy={horizontalListSortingStrategy}
                    >
                      {visibleColumns.map((col) => (
                        <ColumnsHeader
                          key={col}
                          col={col}
                          pinned={pinned}
                          registerPinnedRef={registerPinnedRef}
                          getLeftOffset={getLeftOffset}
                          t={t}
                          sortData={sortData}
                          handlePinAndUnpin={handlePinAndUnpin}
                          sortConfig={sortConfig}
                        />
                      ))}
                    </SortableContext>

                    {hasActions && (
                      <th
                        className="p-2 md:p-3  sticky right-0 z-2 
                  bg-[#fcfffa] dark:bg-[#304485] blue:bg-[#e69811]"
                      >
                        {t("table.Actions")}
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="dark:bg-[#141b34] dark:text-gray-200 blue:bg-[#282828] blue:text-[#ffffff]">
                  {sortedRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border border-b  light:hover:bg-gray-50 dark:hover:bg-[#0f152b] blue:hover:bg-[#262323] light:text-gray-700 text-sm light:bg-white`}
                    >
                      {hasCheckbox && (
                        <td
                          className={`${
                            pinned["Checkbox"]
                              ? "sticky light:bg-[#faf7f5] dark:bg-[#163646]  blue:bg-[#333536] z-1 "
                              : ""
                          }
                      p-2 md:p-3 text-base`}
                          style={
                            pinned["Checkbox"]
                              ? { left: getLeftOffset("Checkbox") }
                              : {}
                          }
                        >
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.Checkbox)}
                            onChange={() => toggleRow(row.Checkbox)}
                            className="cursor-pointer"
                          />
                        </td>
                      )}

                      {visibleColumns.map((col) => (
                        <td
                          key={col}
                          className={`${
                            pinned[col]
                              ? "sticky light:bg-[#faf7f5] dark:bg-[#163646] blue:bg-[#333536] z-1"
                              : ""
                          } p-2 md:p-3 whitespace-nowrap `}
                          style={
                            pinned[col] ? { left: getLeftOffset(col) } : {}
                          }
                        >
                          {col === "Active" || col === "Account Status" ? (
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium
                                     ${
                                       row[col] === "Active"
                                         ? "bg-green-100 text-green-700 border border-green-300"
                                         : "bg-red-100 text-red-700 border border-red-300"
                                     }`}
                            >
                              {row[col]}
                            </span>
                          ) : (
                            row[col]
                          )}
                        </td>
                      ))}

                      {hasActions && (
                        <td
                          className="px-2 py-3  sticky right-0  z-1
                      light:bg-white dark:bg-[#141b34] blue:bg-[#282828] flex gap-2 "
                        >
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => onEdit(row)}
                          >
                            <Pencil
                              size={18}
                              className="dark:text-[#89d355] blue:text-[#f0ed4d]"
                            />
                          </button>

                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => onOpen(row)}
                          >
                            <Trash2
                              size={18}
                              className="dark:text-[#efe22a] blue:text-[#4effb8]"
                            />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DndContext>
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 px-2 gap-2 md:gap-0">
          <div className="flex gap-2 items-center flex-wrap w-[70%]">
            {perPage < totalRecords && (
              <div className="flex items-center space-x-1">
                <button
                  disabled={page === 1}
                  onClick={() => onPageChange(page - 1)}
                  className="px-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed
              light:bg-white light:text-blue-600 light:border-blue-300 light:hover:bg-blue-100
              dark:bg-[#141b34] dark:text-gray-200 dark:border-gray-700 dark:hover:bg-[#1f2a4d]
              blue:bg-[#282828] blue:text-[#ffffff] blue:hover:bg-[#3e3e3e]"
                >
                  {t("table.prev")}
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-2  mx-1 border rounded transition-colors duration-200 md:block lg:block hidden
              ${
                i + 1 === page
                  ? `light:bg-blue-600 light:text-white light:border-blue-600
              dark:bg-[#304485] dark:text-white dark:border-[#304485]
              blue:bg-[#e69811] blue:text-black blue:border-[#e69811]`
                  : `light:bg-white light:text-blue-600 light:border-blue-300 light:hover:bg-blue-100
              dark:bg-[#141b34] dark:text-gray-200 dark:border-gray-700 dark:hover:bg-[#1f2a4d]
              blue:bg-[#282828] blue:text-[#ffffff] blue:border-[#444444] blue:hover:bg-[#3e3e3e]`
              }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="px-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed
              light:bg-white light:text-blue-600 light:border-blue-300 light:hover:bg-blue-100
              dark:bg-[#141b34] dark:text-gray-200 dark:border-gray-700 dark:hover:bg-[#1f2a4d]
              blue:bg-[#282828] blue:text-[#ffffff] blue:hover:bg-[#3e3e3e]"
                >
                  {t("table.next")}
                </button>
              </div>
            )}
          </div>

          <div className="w-[30%] flex justify-end ">
            <select
              className="border  dark:text-gray-200 px-2 rounded text-sm dark:bg-[#141b34] blue:bg-[#282828] blue:text-[#ffffff]"
              value={perPage}
              onChange={(e) => {
                onPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
            >
              <option value={10}>{t("table.10Page")}</option>
              <option value={20}>{t("table.20Page")}</option>
              <option value={50}>{t("table.50Page")}</option>
            </select>
          </div>
        </div>
      </div>
      <style>
        {` .custom-select{
            font-size: 16px;
            padding: 2px 16px 2px 16px;
            border-radius: 8px;
            background-color: #ffffff;
            border-right: 16px solid transparent;
            box-shadow: 0 0 2px rgba(0,0,0,.5);  
            outline: none;                
            transition: all 150ms;          
            cursor: pointer; 
            }
            .dark .custom-select {
            background-color: #141b34;
            color: #cbd5e1;
            }
            .blue .custom-select {
            background-color: #282828;
            color: #ffffff;
            }
         `}
      </style>
    </>
  );
};
export default DataTable;

import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Modal from "./Modal";
import { tab } from "@material-tailwind/react";

function ColumnsHeader({
  col,
  pinned,
  registerPinnedRef,
  getLeftOffset,
  sortConfig,
  t,
  sortData,
  handlePinAndUnpin,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: col });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? "#f3f4f6" : undefined,
    zIndex: isDragging ? 50 : pinned[col] ? 2 : 1,
  };

  return (
    <th
      ref={mergeRefs([setNodeRef, pinned[col] ? registerPinnedRef(col) : null])}
      style={{
        ...style,
        ...(pinned[col] ? { left: getLeftOffset(col) } : {}),
      }}
      className={`p-2 md:p-3 text-left whitespace-nowrap 
        ${
          pinned[col]
            ? "sticky light:bg-[#f3f4f6] dark:bg-[#3c559e] blue:bg-[#f2ad32]"
            : ""
        }`}
    >
      <div className="flex items-center gap-1 md:gap-2">
        {t(`table.${col}`) || col}

        <button
          className="text-gray-400 blue:text-white"
          onClick={() => sortData(col)}
        >
          {sortConfig.key !== col && <ArrowUpDown size={16} />}
          {sortConfig.key === col && sortConfig.direction === "asc" && (
            <ArrowUp size={16} />
          )}
          {sortConfig.key === col && sortConfig.direction === "desc" && (
            <ArrowDown size={16} />
          )}
        </button>

        <button onClick={() => handlePinAndUnpin(col)}>
          {pinned[col] ? <PinOff size={16} /> : <Pin size={16} />}
        </button>

        <RiDraggable
          size={16}
          className="cursor-grab active:cursor-grabbing text-gray-400 blue:text-white"
          {...attributes}
          {...listeners}
        />
      </div>
    </th>
  );
}
