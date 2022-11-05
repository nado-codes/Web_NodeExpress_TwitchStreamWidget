import { Button, Paper } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

import data from "../data.json";
import notif1 from "../res/hurricane_notif1.mp3";
import notif2 from "../res/hurricane_notif2.mp3";
import notif3 from "../res/hurricane_notif3.mp3";

import axios from "axios";

export interface WidgetData {
  "channel.follow": number;
  "channel.subscribe": number;
  "channel.raid": number;
  "channel.dono": number;
  animation: string;
}

export const Dashboard: React.FC = () => {
  const localIp = "192.168.0.104";
  const eventsubCallback = `http://${localIp}:2122/webhooks/callback`;
  const {
    "channel.follow": follows,
    "channel.subscribe": subs,
    "channel.raid": raids,
    "channel.dono": donos,
  }: WidgetData = data as WidgetData;
  const notificationSounds = [notif3, notif2, notif1];
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [audioI, setAudioI] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const notifySound = () => {
    audio?.pause();
    const _audio = new Audio(
      notificationSounds[audioI % notificationSounds.length]
    );
    _audio.play();
    setAudio(_audio);
    setAudioI(audioI + 1);
  };

  useEffect(() => {
    // notifySound();
  }, [data]);

  const triggerEvent = async (event: string) => {
    notifySound();
    enqueueSnackbar(`Triggered "${event}" event`, { variant: "success" });

    try {
      await axios.post(
        `http://${localIp}:2022/trigger?event=${event}&callback=${eventsubCallback}`
      );
    } catch (e) {
      console.error(e);
    }
  };

  const writeData = async (key: string, value: unknown) => {
    try {
      console.log(`SETTING DATA.JSON ${key} to ${value}`);
      await axios.post(`http://${localIp}:2122/writedata`, { key, value });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>Dashboard</h1>
      <Paper style={{ padding: 10, margin: 5, textAlign: "left" }}>
        <h3>Testing</h3>
        <div style={{ marginLeft: 10 }}>
          <Button
            variant="contained"
            onClick={() => triggerEvent("follow")}
            style={{ marginRight: 5 }}
          >
            Follow
          </Button>
          <Button
            variant="contained"
            onClick={() => triggerEvent("subscribe")}
            style={{ marginRight: 5 }}
          >
            Subscribe
          </Button>
          <Button
            variant="contained"
            onClick={() => triggerEvent("channel.raid")}
          >
            Raid
          </Button>
        </div>

        <ul style={{ userSelect: "none" }}>
          <li>
            <b>Followers: </b>
            {follows ?? 0}
          </li>
          <li>
            <b>Subs: </b>
            {subs ?? 0}
          </li>
          <li>
            <b>Donos: </b>
            {donos ?? 0}
          </li>
          <li>
            <b>Raids: </b>
            {raids ?? 0}
          </li>
        </ul>
      </Paper>
      <Paper style={{ padding: 10, margin: 5, textAlign: "left" }}>
        <h3 style={{ textAlign: "left" }}>Triggers</h3>
        <Button
          variant="contained"
          style={{ marginRight: 5 }}
          onClick={() => writeData("animation", "END_STREAM")}
        >
          Trigger End Stream
        </Button>
        <Button
          variant="contained"
          style={{ marginRight: 5 }}
          onClick={() => writeData("animation", "AFK")}
        >
          Trigger AFK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => writeData("animation", "NONE")}
        >
          STOP
        </Button>
      </Paper>
    </>
  );
};
