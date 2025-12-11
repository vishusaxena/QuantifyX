import React, { useState, useEffect } from "react";
import { usedata } from "../context/dataContext";
import { Download, MoveLeft, Mail, Phone, MapPin } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFResume from "../utils/PDFResume";
import { useTranslation } from "react-i18next";

const UserPreview = () => {
  const [data, setData] = useState({
    profileData: {},
    educations: [],
    address: {},
    employments: [],
  });

  const { currentUser } = usedata();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentUser?.email) return;

    const allUserData = JSON.parse(localStorage.getItem("usersCardData")) || [];
    const currentUserCard = allUserData.find(
      (u) => u.email === currentUser.email
    );

    if (currentUserCard) {
      setData({
        profileData: currentUser,
        educations: currentUserCard.educations || [],
        address: currentUserCard.address || {},
        employments: currentUserCard.employments || [],
      });
    }
  }, [currentUser]);

  return (
    <div className="w-full min-h-screen p-4 bg-gray-100 dark:bg-[#141b34]  blue:bg-[#282828]">
      <div className="flex justify-between mb-4 max-w-5xl mx-auto">
        <button
          className="flex items-center gap-2 light:text-gray-700 hover:text-gray-900 blue:text-white  dark:text-white"
          onClick={() => navigate("/profile")}
        >
          <MoveLeft size={20} />
          <span className="text-sm font-medium hidden sm:block">
            {t("UserPreview.back")}
          </span>
        </button>

        <PDFDownloadLink
          document={<PDFResume data={data} />}
          fileName={`${currentUser?.name}.pdf`}
          className="navlink flex items-center bg-blue-600 px-4 py-2 text-white rounded hover:bg-blue-700 transition"
        >
          {() => (
            <>
              <Download size={20} />
              <span className="ml-2 text-sm font-medium hidden sm:block">
                {t("UserPreview.download")}
              </span>
            </>
          )}
        </PDFDownloadLink>
      </div>

      <div
        className="max-w-3xl mx-auto shadow-xl bg-white rounded-lg overflow-hidden 
                      flex flex-col sm:flex-row"
      >
        <div className="sm:w-1/3 w-full bg-blue-600 text-white p-6 flex flex-col items-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img
              src={currentUser.profilePic || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="mt-4 text-lg sm:text-xl font-semibold text-center text-white">
            {currentUser.name}
          </h2>

          <div className="w-full mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <MapPin size={16} />
              <span className="wrap-break-word">
                {data.address?.currentCity}, {data.address?.currentState},{" "}
                {data.address?.currentCountry}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} />
              <span>{currentUser.phoneNo}</span>
            </div>

            <div className="flex items-center gap-3 wrap-break-word">
              <Mail size={16} />
              <span>{currentUser.email}</span>
            </div>
          </div>
        </div>

        <div className="sm:w-2/3 w-full p-6 sm:p-8 text-gray-900 text-[13px] leading-[1.35]">
          <div className="mb-6">
            <h5 className="text-lg font-semibold border-b pb-1">
              {t("UserPreview.about")}
            </h5>
            <p className="mt-2 text-gray-700 wrap-break-word">
              {data.profileData.about || "No about section provided."}
            </p>
          </div>

          <div className="mb-6">
            <h5 className="text-lg font-semibold border-b pb-1">
              {t("UserPreview.workExperience")}
            </h5>

            {data.employments.length > 0 ? (
              <div className="mt-3 space-y-4">
                {data.employments.map((job, i) => (
                  <div key={i} className="pb-3 border-b last:border-none">
                    <p className="text-base sm:text-lg font-semibold">
                      {job.jobTitle}
                    </p>

                    <p className="text-gray-600 italic text-sm">
                      {job.company} • {formatDate(job.joiningDate)} –{" "}
                      {job.leaveDate ? formatDate(job.leaveDate) : "Present"}
                    </p>

                    {job.about && (
                      <ul className="list-disc mt-1 text-gray-700 text-[12px] space-y-1 pl-4">
                        {job.about
                          .split(". ")
                          .map((line, idx) =>
                            line.trim() ? (
                              <li key={idx}>{line.trim()}</li>
                            ) : null
                          )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 mt-2">
                {t("UserPreview.noExperienceAdded")}
              </p>
            )}
          </div>

          <div>
            <h5 className="text-lg font-semibold border-b pb-1">
              {t("UserPreview.education")}
            </h5>

            {data.educations.length > 0 ? (
              <div className="mt-3 space-y-3">
                {data.educations.map((edu, i) => (
                  <div key={i} className="pb-2 border-b last:border-none">
                    <p className="text-base sm:text-lg font-semibold">
                      {edu.college}
                    </p>

                    <p className="text-gray-700 text-sm">
                      {edu.qualification} • {edu.marks}%
                    </p>

                    <p className="text-gray-500 text-sm mt-0.5">
                      {formatDate(edu.startDate)} –{" "}
                      {edu.isPursuing ? "Present" : formatDate(edu.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 mt-2">
                {t("UserPreview.noEducationAdded")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreview;
