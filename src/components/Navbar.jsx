import React, { useState, useRef, useEffect } from "react";
import { CircleUserRound } from "lucide-react";
import { usedata } from "../context/dataContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = ({ setShowMobileMenu }) => {
  const { currentUser, logout } = usedata();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-20 w-full">
      <div
        className="w-full flex items-center justify-between dark:bg-[#141b34] blue:bg-[#282828] 
        shadow-md p-4 light:bg-linear-to-r light:from-[#3b82f6] light:to-[#2563eb] light:text-white h-16 backdrop-blur-md"
      >
        <span
          className="lg:hidden inline w-[20%] cursor-pointer light:text-white dark:text-white blue:text-[#ffffff] text-2xl font-bold"
          onClick={() => setShowMobileMenu(true)}
        >
          ☰
        </span>

        <div className="flex gap-4 items-center w-full justify-end">
          <LanguageSwitcher />

          <span className="font-medium dark:text-gray-200 blue:text-[#ffffff] tracking-wider">
            {currentUser ? currentUser.name : t("user")}
          </span>

          <div className="relative" ref={dropdownRef}>
            <CircleUserRound
              className="cursor-pointer size-7 dark:text-gray-200 blue:text-[#fdf379]"
              onClick={() => setOpen(!open)}
            />

            {open && (
              <div
                className="absolute right-0 mt-2 w-40 dark:bg-[#141b34] 
                light:bg-blue-500 border rounded-md shadow-lg blue:bg-[#282828] z-50"
              >
                <button
                  className="w-full text-left px-4 py-2 light:hover:bg-blue-800 
                    dark:hover:bg-[#1f284b] dark:text-gray-200 blue:text-[#ffffff] 
                    blue:hover:bg-[#202020]"
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  style={{ borderRadius: 8 }}
                >
                  {t("profile")}
                </button>

                <button
                  className="w-full text-left px-4 py-2 light:hover:bg-blue-800 
                    dark:hover:bg-[#1f284b] dark:text-gray-200 blue:text-[#ffffff] 
                    blue:hover:bg-[#202020]"
                  onClick={() => {
                    navigate("/reset-password");
                    setOpen(false);
                  }}
                >
                  {t("resetPassword")}
                </button>
                <button
                  className="w-full text-left px-4 py-2 light:hover:bg-blue-800 
                    dark:hover:bg-[#1f284b] dark:text-gray-200 blue:text-[#ffffff] 
                    blue:hover:bg-[#202020]"
                  onClick={logout}
                  style={{ borderRadius: 8 }}
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
