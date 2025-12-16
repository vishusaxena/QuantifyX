import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import myAnimationData from "../assets/loading.json";

const Loading = () => {
  return (
    <div>
      <Player
        autoplay
        loop
        src={myAnimationData}
        style={{ height: "300px", width: "300px" }}
      />
    </div>
  );
};

export default Loading;
