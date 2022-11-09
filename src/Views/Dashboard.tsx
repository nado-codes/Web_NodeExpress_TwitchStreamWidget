import { Button, Paper, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

import data from "../data.json";
import notif1 from "../res/hurricane_notif1.mp3";
import notif2 from "../res/hurricane_notif2.mp3";
import notif3 from "../res/hurricane_notif3.mp3";
//import wahh from "../res/wahh.mp3";

import axios from "axios";

export interface WidgetData {
  "channel.follow": number;
  "channel.subscribe": number;
  "channel.raid": number;
  "channel.dono": number;
  "channel.cheer": number;
  animation: string;
}

export const Dashboard: React.FC = () => {
  const cliDomain = "http://192.168.0.22"; // "https://icy-teeth-grow-112-118-58-127.loca.lt";
  const apiDomain = "http://192.168.0.22"; // "https://flat-sheep-visit-112-118-58-127.loca.lt";
  const eventsubCallback = `${apiDomain}:2122/webhooks/callback`;
  const {
    "channel.follow": follows,
    "channel.subscribe": subs,
    "channel.cheer": cheers,
    "channel.raid": raids,
    "channel.dono": donos,
    animation,
  }: WidgetData = data as WidgetData;
  // const notificationSounds = [wahh];
  const notificationSounds = [notif3, notif2, notif1];
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [audioI, setAudioI] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
    notifySound();
  }, [data]);

  const triggerEvent = async (event: string) => {
    notifySound();
    enqueueSnackbar(`Triggered "${event}" event`, { variant: "success" });

    setIsLoading(true);
    try {
      await axios.post(
        `${cliDomain}:2022/trigger?event=${event}&callback=${eventsubCallback}`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetEvents = async () => {
    await writeData("channel.follow", 0);
    await writeData("channel.subscribe", 0);
    await writeData("channel.cheer", 0);
    await writeData("channel.raid", 0);
    enqueueSnackbar(`Reset all events`, {
      variant: "success",
    });
  };

  const triggerAnimation = async (animation: string) => {
    notifySound();
    enqueueSnackbar(`Triggered "${animation}" animation`, {
      variant: "success",
    });
    await writeData("animation", animation);
  };

  const writeData = async (key: string, value: unknown) => {
    try {
      console.log(`SETTING DATA.JSON ${key} to ${value}`);
      setIsLoading(true);
      await axios.post(`${apiDomain}:2122/writedata`, { key, value });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <CircularProgress style={{ position: "absolute", left: 25 }} />
      )}
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
            onClick={() => triggerEvent("channel.cheer")}
            style={{ marginRight: 5 }}
          >
            Cheer
          </Button>
          <Button
            variant="contained"
            onClick={() => triggerEvent("channel.raid")}
            style={{ marginRight: 5 }}
          >
            Raid
          </Button>
          <Button
            variant="contained"
            // onClick={() => triggerEvent("channel.raid")}
            disabled
          >
            Donate
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
            <b>Cheers: </b>
            {cheers ?? 0}
          </li>
          <li>
            <b>Raids: </b>
            {raids ?? 0}
          </li>
        </ul>
        <Button variant="contained" onClick={resetEvents} color="error">
          Reset
        </Button>
      </Paper>
      <Paper
        style={{
          padding: 10,
          paddingBottom: 20,
          margin: 5,
          textAlign: "left",
        }}
      >
        <h3 style={{ textAlign: "left" }}>Triggers</h3>
        <b>Current Animation: </b>
        <span style={{ marginBottom: 10, display: "block" }}>
          {animation ?? "NONE"}
        </span>
        <Button
          variant="contained"
          style={{ marginRight: 5 }}
          onClick={() => triggerAnimation("END_STREAM")}
        >
          Trigger End Stream
        </Button>
        <Button
          variant="contained"
          style={{ marginRight: 5 }}
          onClick={() => triggerAnimation("AFK")}
        >
          Trigger AFK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => triggerAnimation("NONE")}
        >
          STOP
        </Button>
      </Paper>
    </>
  );
};
