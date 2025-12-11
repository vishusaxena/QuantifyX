import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Offcanvas, Button, Nav } from "react-bootstrap";
import {
  Users,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  ChartColumn,
} from "lucide-react";
import { usedata } from "../context/dataContext";
import { useTranslation } from "react-i18next";

const Leftbar = ({ showMobileMenu, setShowMobileMenu }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { logout, handleThemeToggle, theme } = usedata();
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { label: t("dashboard"), path: "/" },
    { label: t("userMaster"), path: "/user" },
    { label: t("teamMaster"), path: "/team" },
    { label: t("orderMaster"), path: "/order" },
    { label: t("taskManager"), path: "/tasks" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1240) {
        setIsMobile(true);
        setCollapsed(false);
      } else {
        setIsMobile(false);
        setShowMobileMenu(false);
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const width = collapsed ? "5%" : "20%";

  const ThemeButton = ({ mode, Icon, label }) => (
    <button
      className="flex items-center gap-2 py-2 rounded-lg transition text-sm"
      onClick={() => handleThemeToggle(mode)}
    >
      <span
        className={`p-2 rounded-full transition-all ${
          theme === mode
            ? "bg-blue-500 text-white ring-2 ring-blue-400"
            : "light:bg-black "
        }`}
      >
        <Icon
          size={18}
          className={`${
            mode !== "dark" && theme === "dark"
              ? "text-gray-200 "
              : "text-white"
          } blue:text-[#fdf379] light:text-white`}
        />
      </span>

      {!collapsed && (
        <span
          className={`transition ${
            theme === mode
              ? "text-blue-500 font-semibold"
              : "dark:text-gray-200"
          } blue:text-[#ffffff] text-sm light:text-white`}
        >
          {t(label)}
        </span>
      )}
    </button>
  );

  const DesktopSidebar = (
    <div
      className="sticky right-0 top-0 h-screen light:bg-black shadow-lg flex flex-col transition-all duration-300 dark:bg-[#141b34] blue:bg-[#282828]"
      style={{ width }}
    >
      <div className="p-4 flex justify-between items-center dark:text-gray-200 blue:text-[#f5ed05] light:text-white">
        {!collapsed && (
          <h3 className="sm:text-sm md:text-[40px] lg:text-2xl font-semibold  dark:text-gray-200 ">
            {t("brandName")}
          </h3>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded light:hover:bg-gray-700"
        >
          {collapsed ? (
            <ChevronsRight className="dark:text-gray-200" />
          ) : (
            <ChevronsLeft className="dark:text-gray-200" />
          )}
        </button>
      </div>

      <div className=" flex flex-col text-sm ">
        {navLinks.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              to={item.path}
              key={item.path}
              className={`navlink flex items-center gap-2 px-4 py-2.5 transition-all 
                ${
                  isActive
                    ? "light:bg-linear-to-r light:from-[#3b82f6] light:to-[#2563eb]  dark:bg-[#304485] light:text-white blue:bg-[#e69811] rounded-[5px] w-full"
                    : "light:text-white "
                }`}
            >
              {item.label === t("dashboard") ? (
                <ChartColumn
                  size={18}
                  className=" dark:text-gray-200 light:text-white blue:text-[#fdf379]"
                />
              ) : (
                <Users
                  size={18}
                  className=" dark:text-gray-200 light:text-white blue:text-[#fdf379]"
                />
              )}

              {!collapsed && (
                <span className="dark:text-gray-200 light:text-white blue:text-[#ffffff] text-sm tracking-wider">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="w-full flex px-3 py-1 items-end h-full">
        <div>
          <div className="flex flex-col gap-1 mb-1">
            <ThemeButton mode="light" Icon={Sun} label="light" />
            <ThemeButton mode="dark" Icon={Moon} label="dark" />
            <ThemeButton mode="blue" Icon={Sparkles} label="lightDark" />
          </div>

          {!collapsed ? (
            <div className="flex items-center gap-2 py-2 mb-3 rounded-lg transition text-sm">
              <LogOut
                className="dark:text-gray-200 cursor-pointer mx-2 blue:text-[#fdf379] light:text-white"
                onClick={() => logout()}
              />
              <span className="dark:text-gray-200 blue:text-[#fdf379] light:text-white">
                {t("logout")}
              </span>
            </div>
          ) : (
            <LogOut
              className="dark:text-gray-200 cursor-pointer mx-2 blue:text-[#fdf379] light:text-white"
              onClick={() => logout()}
            />
          )}
        </div>
      </div>
    </div>
  );

  const MobileSidebar = (
    <div className="hidden ">
      <Button
        variant="light"
        className="m-2 shadow-sm btn-menu sticky"
        onClick={() => setShowMobileMenu(true)}
      >
        ☰ {t("menu")}
      </Button>

      <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)}>
        <Offcanvas.Header
          closeButton
          className="dark:bg-[#141b34] blue:bg-[#282828] light:bg-black text-white custom-close-btns"
        >
          <Offcanvas.Title>{t("brandName")}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="dark:bg-[#141b34] blue:bg-[#282828] light:bg-black">
          <Nav className="flex-column text-lg">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`navlink flex items-center gap-3 px-4 py-3 rounded transition-all ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Users />
                  {item.label}
                </Link>
              );
            })}
          </Nav>

          <div className="flex flex-col gap-2 px-3 mt-4">
            <ThemeButton mode="light" Icon={Sun} label="light" />
            <ThemeButton mode="dark" Icon={Moon} label="dark" />
            <ThemeButton mode="blue" Icon={Sparkles} label="lightDark" />

            <button
              className="bg-sky-600 text-white px-8 py-2 rounded-lg mt-3"
              onClick={() => logout()}
            >
              {t("logout")}
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );

  return <>{!isMobile ? DesktopSidebar : MobileSidebar}</>;
};

export default Leftbar;
