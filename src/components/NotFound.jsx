import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center mt-24 dark:text-gray-200 blue:text-white">
      <h1 className="text-6xl font-bold light:text-gray-700 dark:text-gray-200 blue:text-white">
        404
      </h1>
      <p className="text-xl light:text-gray-500 mt-3 dark:text-gray-200 blue:text-white">
        {t("notFoundPage.notFound")}
      </p>
      <Link
        to="/"
        className="navlink mt-5 px-5 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 "
      >
        {t("notFoundPage.goToDashboard")}
      </Link>
    </div>
  );
};

export default NotFound;
