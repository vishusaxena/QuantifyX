import React from "react";
import { Pencil, Trash2, GraduationCap, Building2 } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { useTranslation } from "react-i18next";

const SectionHeader = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="light:text-blue-700 dark:text-gray-200 blue:text-white">
      {icon}
    </span>
    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide dark:text-gray-100 blue:text-white">
      {title}
    </h2>
  </div>
);

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex gap-2 justify-end mt-3">
    <button
      onClick={onEdit}
      className="p-2 text-blue-600 rounded-md  transition"
    >
      <Pencil size={16} className="blue:text-white dark:text-white" />
    </button>
    <button
      onClick={onDelete}
      className="p-2 text-red-600 rounded-md  transition"
    >
      <Trash2 size={16} className="blue:text-white dark:text-white" />
    </button>
  </div>
);

const InfoRow = ({ label, value }) => (
  <p className="text-sm text-gray-700 dark:text-gray-200 blue:text-white">
    <span className="font-medium text-gray-800 dark:text-gray-200 blue:text-white">
      {label}:
    </span>{" "}
    {value}
  </p>
);

const gradientCard =
  "rounded-2xl shadow p-4 space-y-2 text-gray-800 dark:text-gray-200 blue:text-white \
   bg-gradient-to-br from-[#e0f2ff] via-white to-[#dbeafe] \
   dark:from-[#1f2937] dark:via-[#111827] dark:to-[#0f172a] \
   blue:from-[#1e3a8a] blue:via-[#1e40af] blue:to-[#1d4ed8]";

const UserDetailsCard = ({ data, onEdit, onDelete, tab }) => {
  const { t } = useTranslation();
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full p-6 rounded-lg space-y-8">
      {data.map((user, index) => {
        return (
          <div key={index} className="space-y-10">
            {tab === "education" && user.educations?.length > 0 && (
              <div>
                <SectionHeader
                  title={t("UserDetailsCard.education")}
                  icon={<GraduationCap size={18} />}
                />

                <div className="flex lg:flex-row md:flex-col flex-col gap-4 overflow-x-auto no-scrollbar ">
                  {user.educations.map((edu, i) => (
                    <div
                      key={i}
                      className={`${gradientCard} lg:w-[300px] w-full inline-block  `}
                    >
                      <ActionButtons
                        onEdit={() => onEdit("education", i)}
                        onDelete={() => onDelete("education", i)}
                      />

                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                        {edu.qualification}
                      </h3>

                      <InfoRow
                        label={t("UserDetailsCard.college")}
                        value={edu.college}
                      />
                      <InfoRow
                        label={t("UserDetailsCard.startDate")}
                        value={formatDate(edu.startDate)}
                      />

                      {edu.endDate && (
                        <InfoRow
                          label={t("UserDetailsCard.endDate")}
                          value={formatDate(edu.endDate)}
                        />
                      )}

                      <InfoRow
                        label={t("UserDetailsCard.status")}
                        value={
                          edu.isPursuing
                            ? t("UserDetailsCard.pursuing")
                            : t("UserDetailsCard.completed")
                        }
                      />
                      <InfoRow
                        label={t("UserDetailsCard.percentage")}
                        value={edu.marks}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "employment" && user.employments?.length > 0 && (
              <div>
                <SectionHeader
                  title={t("UserDetailsCard.employment")}
                  icon={<Building2 size={18} />}
                />

                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                  {user.employments.map((emp, idx) => (
                    <div
                      key={idx}
                      className={`${gradientCard} w-[300px] h-100 overflow-y-auto inline-block`}
                    >
                      <ActionButtons
                        onEdit={() => onEdit("employment", idx)}
                        onDelete={() => onDelete("employment", idx)}
                      />

                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                        {emp.jobTitle}
                      </h3>

                      <InfoRow
                        label={t("UserDetailsCard.company")}
                        value={emp.company}
                      />
                      <InfoRow
                        label={t("UserDetailsCard.duration")}
                        value={`${emp.joiningDate} - ${
                          emp.leaveDate || t("UserDetailsCard.present")
                        }`}
                      />
                      <InfoRow
                        label={t("UserDetailsCard.experience")}
                        value={emp.about}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserDetailsCard;
