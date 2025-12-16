import { Player } from "@lottiefiles/react-lottie-player";
import React from "react";
import loginLoader from "../assets/LoginLoader.json";

const LoginLoader = ({ title }) => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-linear-to-br from-gray-50 to-gray-200">
      <Player
        autoplay
        loop
        src={loginLoader}
        style={{ height: "320px", width: "320px" }}
      />

      <div className="text-3xl font-semibold tracking-wide text-gray-700 mt-6">
        {title}
      </div>
    </div>
  );
};

export default LoginLoader;
