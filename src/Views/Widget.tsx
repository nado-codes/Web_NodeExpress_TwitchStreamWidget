import React, { useEffect, useState } from "react";
import { Fade } from "@mui/material";
import logo from "../res/nadotornado.png";
import { useSnackbar } from "notistack";
import "../App.css";
import { Scene } from "../Components/Scene";
import fadeAway from "../res/hurricane_fadeAway.mp3";
// import inFrontOfYou from "../res/hurricane_inFrontOfYou.mp3";
import higherhigher from "../res/lightupalight_higherandhigher.mp3";
// import intermission from "../res/hurricane_intermission.mp3";
import data from "../data.json";
import axios from "axios";

export const Widget: React.FC = () => {
  const apiDomain = "http://192.168.50.205";
  const { enqueueSnackbar } = useSnackbar();
  const [audio, setAudio] = useState<HTMLAudioElement>();

  const { animation } = data;

  useEffect(() => {
    enqueueSnackbar("Widget is ready", { variant: "success" });
    return;
    writeData("animation", "NONE");
  }, []);

  useEffect(() => {
    audio?.pause();
    audio?.removeEventListener(
      "ended",
      () => () => writeData("animation", "NONE")
    );
    if (animation === "END_STREAM") {
      const _audio = new Audio(higherhigher);
      _audio.play();
      setAudio(_audio);
      _audio.addEventListener("ended", () => writeData("animation", "NONE"));
      // setTimeout(() => writeData("animation", "NONE"),5000);
      enqueueSnackbar('Playing "END STREAM"', { variant: "success" });
    }
    if (animation === "AFK") {
      const _audio = new Audio(fadeAway);
      _audio.play();
      setAudio(_audio);
      _audio.addEventListener("ended", () => writeData("animation", "NONE"));
      enqueueSnackbar('Playing "AFK"', { variant: "success" });
    }
  }, [animation]);

  const writeData = async (key: string, value: unknown) => {
    try {
      console.log(`SETTING DATA.JSON ${key} to ${value}`);
      await axios.post(`${apiDomain}:2122/writedata`, { key, value });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{}}>
      <h1>{animation}</h1>
    </div>
  );

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
