import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { useTranslation } from "react-i18next";

function TaskCard({
  index,
  task,
  priorityColors,
  handleEditTask,
  onDelete,
  onView,
}) {
  const badgeColors = {
    high: "border-red-500 bg-gradient-to-r from-red-200 to-red-300 text-red-700",
    medium:
      "border-yellow-500 bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-700",
    low: "border-green-500 bg-gradient-to-r from-green-200 to-green-300 text-green-700",
  };
  const { t } = useTranslation();
  return (
    <>
      <div
        key={index}
        className={`relative min-w-[300px] h-40 rounded-3xl p-4 shadow-md border border-gray-200 dark:text-white  hover:scale-[1.02] hover:shadow-lg  flex flex-col gap-2 ${
          priorityColors[task.priority]
        } whitespace-nowrap`}
      >
        <div className="flex justify-between items-start">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              badgeColors[task.priority]
            }`}
          >
            {task.priority.toUpperCase()}
          </span>

          <div className="flex gap-2">
            <button
              className="p-1  rounded-full transition cursor-pointer"
              onClick={() => handleEditTask(index)}
            >
              <Pencil className="w-4 h-4 text-gray-600 dark:text-white blue:text-white" />
            </button>
            <button
              className="p-1  rounded-full transition cursor-pointer"
              onClick={() => onDelete(index)}
            >
              <Trash2 className="w-4 h-4 text-red-500 dark:text-white blue:text-white" />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h5 className="text-md font-semibold text-gray-800 mt-1">
            {task.taskName}
          </h5>
          <Eye
            size={16}
            className="text-blue-500 cursor-pointer"
            onClick={onView}
          />
        </div>

        <div className="flex  justify-between ">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500 dark:text-white blue:text-white ">
              {t("startDate")}: {formatDate(task.startDate) || "No time added"}
            </span>
            <span className="text-xs text-gray-500  dark:text-white blue:text-white">
              {t("endDate")}: {formatDate(task.endDate) || "No time added"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-200 blue:text-white">
              {" "}
              {t("assignedBy")}
            </span>
            <span className="text-xs">{task.assignedBy}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskCard;
