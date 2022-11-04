import React, { useEffect } from "react";
import { Fade } from "@mui/material";
import logo from "../res/nadotornado.png";
import "../App.css";
import { Scene } from "../Components/Scene";
import fadeAway from "../res/hurricane_fadeAway.mp3";

export const Widget: React.FC = () => {
  const { animation } = localStorage;
  useEffect(() => {
    console.log("animation=", animation);
    if (animation === "END_STREAM") {
      const audio = new Audio(fadeAway);
      audio.play();
      localStorage.animation = "NONE";
    }
  }, [localStorage.animation]);
  return (
    <Fade in={true} timeout={3000}>
      <div>
        <Scene>
          <Scene duration={3000}>
            <div
              style={{
                background: "black",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <img src={logo} className="App-logo" alt="logo" />
            </div>
          </Scene>

          <Scene>
            <h1 style={{ color: "red" }}>I'm a Scene</h1>
          </Scene>
        </Scene>
      </div>
    </Fade>
  );
};
