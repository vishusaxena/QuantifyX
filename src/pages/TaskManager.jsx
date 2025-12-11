import React, { useEffect, useRef, useState } from "react";
import TaskCard from "../components/TaskCard";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../common-components/DeleteConfirmModal";
import { toast } from "react-toastify";
import { formatDate, formatDateWithTime } from "../utils/formatDate";
import { Plus, Inbox, Eye } from "lucide-react";
import { usedata } from "../context/dataContext";
import { useTranslation } from "react-i18next";

const TaskManager = () => {
  const { currentUser } = usedata();
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("Tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [remarks, setRemarks] = useState("");

  const [sortedTasks, setSortedTasks] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [onDragOpenModal, setOnDragOpenModal] = useState({
    isOpen: false,
    dragTask: {},
    dragTaskStatus: "",
  });
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUserTasks = tasks.filter(
    (task) => task.user === currentUser.email
  );
  const priorityColors = {
    high: `
    light:bg-gradient-to-r light:from-red-100 light:to-red-200
    dark:bg-[#141b34] dark:text-white
    blue:bg-[#282828]  blue:text-white `,
    medium: `
    light:bg-gradient-to-r light:from-yellow-100 light:to-yellow-200
    dark:bg-[#141b34] dark:text-white
    blue:bg-[#282828] blue:text-white  `,
    low: `
    light:bg-gradient-to-r light:from-green-100 light:to-green-200
    dark:bg-[#141b34]  dark:text-white
    blue:bg-[#282828]  blue:text-white `,
  };

  useEffect(() => {
    localStorage.setItem("Tasks", JSON.stringify(tasks));
    sortTasksByPriority();
  }, [tasks]);

  const sortTasksByPriority = () => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const sorted = [...currentUserTasks].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    setSortedTasks(sorted);
  };

  const handleEditTask = (index) => {
    navigate(`/tasks`, { state: { editIndex: index } });
  };

  const handleDeleteTask = () => {
    setTasks((prev) => {
      return prev.filter((task, index) => {
        if (task.user !== currentUser.email) return true;

        const userTasks = prev.filter(
          (task, index) => task.user === currentUser.email
        );
        const taskToRemove = userTasks[taskToDelete];

        return task !== taskToRemove;
      });
    });
    toast.success("Task deleted successfully");
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);

    e.target.style.opacity = "1";
  };

  const handleDrop = (newStatus) => {
    if (!draggedTask) return;
    if (
      draggedTask.status === "completed" &&
      draggedTask.status !== newStatus
    ) {
      setOnDragOpenModal({
        isOpen: true,
        dragTask: draggedTask,
        dragTaskStatus: newStatus,
      });
      return;
    }
    const updated = tasks.map((t) => {
      if (t === draggedTask && t.status !== newStatus) {
        const newHistory = {
          status: newStatus,
          time: formatDateWithTime(new Date()),
        };

        return {
          ...t,
          status: newStatus,
          activity: Array.isArray(t.activity)
            ? [newHistory, ...t.activity]
            : [newHistory],
        };
      }
      return t;
    });

    setTasks(updated);
    setRemarks("");
    setDraggedTask(null);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnd = (e) => {
    setDraggedTask(null);
    e.target.style.opacity = "1";
  };

  const handleConfirm = () => {
    if (isDeleteModalOpen) {
      handleDeleteTask();
      setIsDeleteModalOpen(false);
    } else if (onDragOpenModal.isOpen) {
      setTasks((prev) => {
        const newTasks = prev.map((task) =>
          task === onDragOpenModal.dragTask
            ? {
                ...task,
                status: onDragOpenModal.dragTaskStatus,
                activity: Array.isArray(task.activity)
                  ? [
                      {
                        status: onDragOpenModal.dragTaskStatus,
                        remark: remarks,
                        time: formatDateWithTime(new Date()),
                      },
                      ...task.activity,
                    ]
                  : task.activity,
              }
            : task
        );
        return newTasks;
      });
      setOnDragOpenModal({ isOpen: false, dragTask: {}, dragTaskStatus: "" });
    }
  };
  return (
    <div className="w-full ">
      <div className="flex justify-end items-center py-2 px-3 ">
        <button
          className="flex gap-2 items-center bg-blue-600 px-3 py-2 text-white hover:scale-1.5 hover:shadow-lg hover:bg-blue-700  cursor-pointer"
          style={{ borderRadius: 8 }}
          onClick={() => navigate("/tasks")}
        >
          <Plus size={16} />
          {t("newTask")}
        </button>
      </div>
      {currentUserTasks.length === 0 ? (
        <div className="  flex flex-col items-center ">
          <span>
            <Inbox className="w-12 h-12 mb-2" />
          </span>
          <span className="font-medium text-3xl">{t("noData")}</span>
        </div>
      ) : (
        <div
          className="
            flex gap-4 
            overflow-x-auto 
            snap-x snap-mandatory 
            hide-scrollbar 
            py-4 px-3
          "
        >
          {currentUserTasks.map((task, index) => (
            <div key={index} className="snap-center shrink-0">
              <TaskCard
                index={index}
                task={task}
                priorityColors={priorityColors}
                handleEditTask={handleEditTask}
                onDelete={(index) => {
                  setTaskToDelete(index);
                  setIsDeleteModalOpen(true);
                }}
                onView={() => {
                  setSelectedTask(task);
                  document.body.classList.add("overflow-hidden");
                }}
              />
            </div>
          ))}
        </div>
      )}

      {currentUserTasks.length > 0 && (
        <div className="flex md:flex-col lg:flex-row flex-col gap-6 mt-6 px-3 justify-around ">
          <div className=" w-full">
            <div className="flex mx-auto lg:mx-0  items-center justify-between blue:bg-[linear-gradient(135deg,#2b5876,#4e4376)] light:bg-indigo-600 dark:bg-[linear-gradient(135deg,#1e293b,#0f172a)] text-white rounded-full px-2 py-2 w-full">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 bg-white text-indigo-600 font-semibold rounded-full flex items-center justify-center text-sm">
                  {sortedTasks.filter((t) => t.status === "incomplete").length}
                </div>
                <span className="font-medium">{t("InComplete")}</span>
              </div>
            </div>

            <TaskContainer
              sortedTasks={sortedTasks}
              status="incomplete"
              priorityColors={priorityColors}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragEnd={handleDragEnd}
              onView={(task) => {
                setSelectedTask(task);
                document.body.classList.add("overflow-hidden");
              }}
            />
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between blue:bg-[linear-gradient(135deg,#005C97,#363795)] light:bg-amber-500 dark:bg-[linear-gradient(135deg,#312e81,#1e1b4b)] text-white rounded-full px-2 py-2 w-full">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 bg-white text-amber-500 font-semibold rounded-full flex items-center justify-center text-sm">
                  {sortedTasks.filter((t) => t.status === "inprogress").length}
                </div>
                <span className="font-medium">{t("InProgress")}</span>
              </div>
            </div>

            <TaskContainer
              sortedTasks={sortedTasks}
              status="inprogress"
              priorityColors={priorityColors}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragEnd={handleDragEnd}
              onView={(task) => {
                setSelectedTask(task);
                document.body.classList.add("overflow-hidden");
              }}
            />
          </div>

          <TaskDetailsModal
            selectedTask={selectedTask}
            onClose={() => {
              setSelectedTask(null);
              document.body.classList.remove("overflow-hidden");
            }}
            t={t}
          />

          <div className="w-full">
            <div className="flex items-center justify-between blue:bg-[linear-gradient(135deg,#396afc,#2948ff)] light:bg-green-500 dark:bg-[linear-gradient(135deg,#0f766e,#064e3b)] text-white rounded-full px-2 py-2 w-full">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 bg-white text-green-500 font-semibold rounded-full flex items-center justify-center text-sm">
                  {sortedTasks.filter((t) => t.status === "completed").length}
                </div>
                <span className="font-medium">{t("completed")}</span>
              </div>
            </div>

            <TaskContainer
              sortedTasks={sortedTasks}
              status="completed"
              priorityColors={priorityColors}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleDragEnd={handleDragEnd}
              onView={(task) => {
                setSelectedTask(task);
                document.body.classList.add("overflow-hidden");
              }}
            />
          </div>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={
          isDeleteModalOpen
            ? isDeleteModalOpen
            : onDragOpenModal.isOpen
            ? onDragOpenModal.isOpen
            : false
        }
        onConfirm={handleConfirm}
        onClose={() => {
          if (isDeleteModalOpen) setIsDeleteModalOpen(false);
          else if (onDragOpenModal.isOpen)
            setOnDragOpenModal({ isOpen: false, dragTask: {} });
        }}
        isConfirmInput={onDragOpenModal.isOpen}
        onInput={setRemarks}
        title={
          isDeleteModalOpen
            ? t("Are you sure you want to delete it")
            : onDragOpenModal.isOpen
            ? t("Are you confirm you want to move it")
            : ""
        }
      />
    </div>
  );
};

export default TaskManager;

function TaskContainer({
  sortedTasks,
  status,
  priorityColors,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  onView,
}) {
  const badgeColors = {
    high: "bg-red-100 text-red-700 border-red-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    low: "bg-green-100 text-green-700 border-green-300",
  };
  const { t } = useTranslation();
  return (
    <div
      className="
        min-h-80 max-h-80 overflow-y-auto hide-scrollbar 
        snap-y snap-mandatory p-2 rounded-xl 
          
      "
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(status)}
    >
      {sortedTasks
        .filter((task) => task.status === status)
        .map((task, index) => (
          <span
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, task)}
            onDragEnd={handleDragEnd}
            className={`
              ${priorityColors[task.priority]}
              h-20 w-full snap-center rounded-2xl px-4 py-2
              shadow-md flex justify-between items-center
              cursor-grab active:cursor-grabbing 
              transition-all duration-300 
              hover:scale-[1.02] hover:shadow-lg 
              border border-white/40
              mt-2 dark:text-white blue:text-white
            `}
          >
            <div className="flex flex-col gap-1">
              <div className="flex gap-3 items-center ">
                <span
                  className={`
                  text-[10px] font-bold border px-3 py-0.5 w-fit
                  rounded-full shadow-sm ${badgeColors[task.priority]}
                `}
                >
                  {task.priority.toUpperCase()}{" "}
                </span>
                <Eye
                  size={16}
                  className="text-blue-500 cursor-pointer"
                  onClick={() => onView(task)}
                />
              </div>

              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 blue:text-white">
                {task.taskName}
              </span>
            </div>

            <div className="text-[10px] opacity-70 flex flex-col gap-0.5  text-right">
              <span>
                {t("startDate")} : {formatDate(task.startDate)}
              </span>
              <span>
                {t("endDate")} : {formatDate(task.endDate)}
              </span>
            </div>
          </span>
        ))}
    </div>
  );
}

export function TaskDetailsModal({ selectedTask, onClose, t }) {
  if (!selectedTask) return null;

  const badgeColors = {
    high: "bg-red-100 text-red-700 border-red-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    low: "bg-green-100 text-green-700 border-green-300",
  };

  const statusColor = {
    incomplete: "bg-indigo-600 text-white font-medium",
    inprogress: "bg-amber-500 text-white font-medium",
    completed: "bg-green-500 text-white font-medium",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 lg:p-0 md:px-2 px-2">
      <div
        className="light:bg-white dark:bg-[#141b34] blue:bg-[#282828] dark:text-white blue:text-white 
        rounded-xl p-6 w-[850px] lg:h-[550px]  h-[450px] shadow-2xl relative overflow-hidden border border-gray-200/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold tracking-wide">
            {t("taskDetails")}
          </div>
          <button
            onClick={onClose}
            className="text-gray-700  dark:text-white blue:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex lg:gap-3 lg:flex-row md:flex-col flex-col">
          <div>
            <h4 className="text-xl font-bold mb-4">{selectedTask.taskName}</h4>
          </div>
          <div className="flex gap-3 mb-4">
            <span
              className={`lg:text-sm md:text-xs text-xs border ${
                badgeColors[selectedTask.priority]
              }
            w-fit lg:px-4 lg:py-1 md:px-2 md:py-1 px-2 py-1 rounded-full shadow-sm font-medium`}
            >
              {selectedTask.priority.toUpperCase()}
            </span>

            <span
              className={`lg:text-sm md:text-xs text-xs border ${
                statusColor[selectedTask.status]
              }
            w-fit lg:px-4 lg:py-1 md:px-2 md:py-1 px-2 py-1 rounded-full shadow-sm font-medium`}
            >
              {selectedTask.status.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="lg:max-h-[450px]   max-h-[250px] md:overflow-y-auto overflow-y-auto">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-4 mb-2 text-sm">
            <div>
              <span className="font-semibold">{t("startDate")}</span>
              <div className="text-gray-600 dark:text-gray-300 blue:text-white">
                {formatDate(selectedTask.startDate)}
              </div>
            </div>

            <div>
              <span className="font-semibold">{t("endDate")}</span>
              <div className="text-gray-600 dark:text-gray-300 blue:text-white">
                {formatDate(selectedTask.endDate)}
              </div>
            </div>

            <div>
              <span className="font-semibold">{t("timeTaken")}</span>
              <div className="text-gray-600 dark:text-gray-300 blue:text-white">
                {selectedTask.timeTaken} hrs
              </div>
            </div>

            <div>
              <span className="font-semibold">{t("assignedBy")}</span>
              <div className="text-gray-600 dark:text-gray-300 blue:text-white">
                {selectedTask.assignedBy}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <span className="font-semibold">{t("remarks")}</span>
            <div
              className="mt-1 p-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-[#141b34] blue:bg-[#282828]
            lg:max-h-22  text-sm"
            >
              {selectedTask.description || selectedTask.remarks || "—"}
            </div>
          </div>

          <div className="w-full flex flex-col h-[270px] ">
            <span className="font-semibold text-md mb-2">
              {t("Activities")}
            </span>

            <div
              className="overflow-y-auto flex-1 bg-transparent rounded-xl border
            border-gray-200 p-4 mb-2"
            >
              {selectedTask?.activity?.map((item, i) => {
                const isLast = i === selectedTask.activity.length - 1;
                return (
                  <div key={i} className="relative  flex gap-2">
                    <div className="flex flex-col  items-center">
                      <div
                        className={`bg-blue-800 w-2  h-3 mt-2 rounded-full flex `}
                      ></div>

                      <hr
                        className={` ${
                          isLast ? "bg-white" : "bg-gray-500"
                        }  h-full w-0.5 mt-2`}
                        style={{ margin: 0, padding: 0 }}
                      ></hr>
                    </div>

                    <div className="text-sm w-full">
                      <div>
                        <span className="font-medium">Status</span>{" "}
                        <span className="text-indigo-600 dark:text-indigo-300 blue:text-yellow-300">
                          {item.status}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-300 blue:text-white">
                        {t("date")} : {item.time}
                      </div>
                      {item.remark && item.remark.trim() !== "" && (
                        <div className="mt-1 text-sm italic text-gray-700 dark:text-gray-300 blue:text-white">
                          {t("remark")} : {item.remark}
                        </div>
                      )}
                      <hr className="mt-3  border-gray-300/40" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
