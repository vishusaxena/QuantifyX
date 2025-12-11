import React, { useState } from "react";
import Leftbar from "../components/Leftbar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <div className="flex  dark:bg-[#0a0f24] blue:bg-[#121212] light:bg-[#F8FAFC]">
      <>
        <Leftbar
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />
        <div className="flex flex-col flex-1 min-h-screen transition-all duration-300 w-[75%] ">
          <Navbar setShowMobileMenu={setShowMobileMenu} />
          <div className="h-full">
            <Outlet />
          </div>
        </div>
      </>
    </div>
  );
};

export default DashboardLayout;
