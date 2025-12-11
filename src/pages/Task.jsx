import React, { useEffect, useRef, useState } from "react";
import InputComponent from "../common-components/InputComponent";
import Button from "../common-components/Buttons";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { usedata } from "../context/dataContext";
import SelectComponent from "../common-components/SelectComponent";
import { formatDate, formatDateWithTime } from "../utils/formatDate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const formatCustomDate = (date) => {
  if (!date) return "";
  return format(date, "dd-MMM-yyyy");
};

const Task = () => {
  const { t } = useTranslation();
  const { currentUser, theme } = usedata();
  const navigate = useNavigate();
  const location = useLocation();

  const [taskData, setTaskData] = useState({
    user: currentUser?.email,
    taskName: "",
    priority: "",
    startDate: "",
    endDate: "",
    timeTaken: "",
    remarks: "",
    assignedBy: currentUser?.name,
    status: "incomplete",
    activity: [
      {
        status: "incomplete",
        time: formatDateWithTime(new Date()),
      },
    ],
  });

  const [Tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("Tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [error, setError] = useState({});
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const inputRefs = useRef({});

  const editIndex = location.state?.editIndex;

  useEffect(() => {
    if (inputRefs.current.taskName) inputRefs.current.taskName.focus();
  }, []);

  useEffect(() => {
    if (editIndex !== undefined && editIndex !== null) {
      const task = Tasks[editIndex];
      if (task) setTaskData(task);
    }
  }, [editIndex]);

  useEffect(() => {
    localStorage.setItem("Tasks", JSON.stringify(Tasks));
  }, [Tasks]);

  const validateForm = () => {
    const newErrors = {};

    if (!taskData.taskName) newErrors.taskName = t("taskNameRequired");
    if (!taskData.priority) newErrors.priority = t("priorityRequired");
    if (!taskData.startDate) newErrors.startDate = t("startDateRequired");
    if (!taskData.endDate) newErrors.endDate = t("endDateRequired");
    if (!taskData.timeTaken) newErrors.timeTaken = t("timeTakenRequired");
    if (!taskData.remarks.trim(" ")) newErrors.remarks = t("remarksRequired");

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTask = () => {
    if (!validateForm()) return;

    if (editIndex || editIndex === 0) {
      const updated = [...Tasks];
      updated[editIndex] = taskData;
      setTasks(updated);

      toast.success(t("taskUpdated"));

      navigate(location.pathname, {
        replace: true,
        state: { editIndex: null },
      });
    } else {
      setTasks([taskData, ...Tasks]);
      toast.success(t("taskAdded"));
    }

    handleReset();
  };

  const handleReset = () => {
    setTaskData({
      taskName: "",
      priority: "",
      startDate: "",
      endDate: "",
      timeTaken: "",
      remarks: "",
      assignedBy: currentUser?.name,
      status: "incomplete",
    });

    navigate(location.pathname, {
      replace: true,
      state: { editIndex: null },
    });
  };

  const handleKeyDown = (e, nextField) => {
    const { startDate, endDate, addBtn } = inputRefs.current;

    if (e.key === "Enter") {
      if (nextField === "startDate") {
        startDate.setFocus();
        setIsStartOpen(true);
      } else if (nextField === "endDate") {
        setIsStartOpen(false);
        endDate.setFocus();
        setIsEndOpen(true);
      } else if (nextField && inputRefs.current[nextField]) {
        setIsEndOpen(false);
        inputRefs.current[nextField].focus();
      } else {
        addBtn.focus();
      }
    }
  };

  return (
    <div className="flex flex-col items-center  bg-gray-100 dark:bg-[#0a0f24] blue:bg-[#121212]">
      <div className="w-[90%] flex justify-end items-center mb-2 mt-2 dark:text-white blue:text-white">
        <button
          type="button"
          className="px-3 py-2 light:bg-indigo-500 light:hover:bg-indigo-700 dark:bg-[#304485]  blue:bg-[#e69811] text-white rounded-xl shadow-md transition-all"
          onClick={() => navigate("/task-manager")}
          style={{ borderRadius: 8 }}
        >
          {t("allTasks")}
        </button>
      </div>

      <div className="w-[90%] light:bg-white blue:text-white dark:text-gray-200 light:text-black dark:bg-[#141b34] blue:bg-[#282828] shadow-xl rounded-2xl px-8 py-3 border dark:border-gray-700">
        <h4 className="text-lg font-bold ">{t("addTask")}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <InputComponent
            ref={(el) => (inputRefs.current.taskName = el)}
            label={t("taskName")}
            type="text"
            placeholder={t("enterTaskName")}
            name="taskName"
            maxLength={20}
            value={taskData.taskName}
            error={error.taskName}
            classes="mb-0"
            onChange={(e) => {
              setTaskData({ ...taskData, taskName: e.target.value });
              setError({ ...error, taskName: "" });
            }}
            onKeyDown={(e) => handleKeyDown(e, "priority")}
          />

          <SelectComponent
            selectRef={(el) => (inputRefs.current.priority = el)}
            label={t("priority")}
            name="priority"
            value={taskData.priority}
            error={error.priority}
            required={true}
            placeholder={t("selectPriority")}
            options={[
              { value: "high", label: t("high") },
              { value: "medium", label: t("medium") },
              { value: "low", label: t("low") },
            ]}
            onChange={(e) => {
              setTaskData({ ...taskData, priority: e.target.value });
              setError({ ...error, priority: "" });
            }}
            onKeyDown={(e) => handleKeyDown(e, "startDate")}
          />
          <div className={`datepicker-container ${theme}`}>
            <DatePicker
              name="startDate"
              open={isStartOpen}
              onClickOutside={() => setIsStartOpen(false)}
              selected={
                taskData.startDate ? new Date(taskData.startDate) : null
              }
              minDate={new Date()}
              onChange={(date) => {
                setIsStartOpen(false);
                const formatted = formatCustomDate(date);
                if (formatted < taskData.endDate) {
                  setTaskData({
                    ...taskData,
                    startDate: formatted,
                  });
                } else {
                  setTaskData({
                    ...taskData,
                    startDate: formatted,
                    endDate: "",
                  });
                }
                setError({ ...error, startDate: "" });
              }}
              dateFormat="dd-MMM-yyyy"
              ref={(el) => {
                inputRefs.current["startDate"] = el;
              }}
              customInput={
                <InputComponent
                  label={t("startDate")}
                  value={taskData.startDate}
                  error={error.startDate}
                  onOpen={() => {
                    setIsStartOpen(true);
                  }}
                />
              }
              placeholderText={t("startDate")}
              onKeyDown={(e) => handleKeyDown(e, "endDate")}
            />
          </div>

          <div className={`datepicker-container ${theme}`}>
            <DatePicker
              name="endDate"
              open={isEndOpen}
              onClickOutside={() => setIsEndOpen(false)}
              selected={taskData.endDate ? new Date(taskData.endDate) : null}
              minDate={
                taskData.startDate ? new Date(taskData.startDate) : new Date()
              }
              onChange={(date) => {
                setIsEndOpen(false);
                const formatted = formatCustomDate(date);
                setTaskData({ ...taskData, endDate: formatted });
                setError({ ...error, endDate: "" });
              }}
              dateFormat="dd-MMM-yyyy"
              ref={(el) => {
                inputRefs.current["endDate"] = el;
              }}
              calendarClassName="text-black"
              customInput={
                <InputComponent
                  label={t("endDate")}
                  value={taskData.endDate}
                  error={error.endDate}
                  onOpen={() => {
                    setIsEndOpen(true);
                  }}
                />
              }
              placeholderText={t("endDate")}
              onKeyDown={(e) => handleKeyDown(e, "timeTaken")}
            />
          </div>

          <InputComponent
            ref={(el) => (inputRefs.current.timeTaken = el)}
            label={t("timeTaken")}
            type="text"
            placeholder={t("enterTimeInHours")}
            error={error.timeTaken}
            name="timeTaken"
            value={taskData.timeTaken}
            maxLength={2}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "");
              if (val.startsWith("0")) val = val.substring(1);
              setTaskData({ ...taskData, timeTaken: val });
              setError({ ...error, timeTaken: "" });
            }}
            onKeyDown={(e) => handleKeyDown(e, "remarks")}
          />

          <InputComponent
            label={t("assignedBy")}
            name="assignedBy"
            type="text"
            value={taskData.assignedBy}
            disabled={true}
          />
        </div>

        <InputComponent
          ref={(el) => (inputRefs.current.remarks = el)}
          label={t("remarks")}
          name="remarks"
          type="text"
          maxLength={250}
          as="textarea"
          rows={2}
          value={taskData.remarks}
          placeholder={t("taskDescription")}
          error={error.remarks}
          onChange={(e) => {
            setTaskData({ ...taskData, remarks: e.target.value });
            setError({ ...error, remarks: "" });
          }}
          onKeyDown={(e) => handleKeyDown(e, null)}
        />

        <Button
          saveRef={(el) => (inputRefs.current.addBtn = el)}
          isAdd={true}
          isReset={true}
          handleSubmit={handleAddTask}
          handleReset={handleReset}
          isUpdate={editIndex || editIndex === 0}
        />
      </div>
    </div>
  );
};

export default Task;
