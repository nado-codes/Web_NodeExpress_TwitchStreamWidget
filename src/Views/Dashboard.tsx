import { Button, Paper } from "@mui/material";
import React from "react";

import data from "../data.json";

import song from "../res/surprise.mp3";
import axios from "axios";

interface EventData {
  "channel.follow": number;
  "channel.subscribe": number;
  "channel.raid": number;
  "channel.dono": number;
}

export const Dashboard: React.FC = () => {
  const localIp = "192.168.39.138";
  const eventsubCallback = `http://${localIp}:2122/webhooks/callback`;
  const {
    "channel.follow": follows,
    "channel.subscribe": subs,
    "channel.raid": raids,
    "channel.dono": donos,
  }: EventData = data as EventData;

  const triggerEvent = async (event: string) => {
    const audio = new Audio(song);
    audio.play();

    try {
      await axios.post(
        `http://${localIp}:2022/trigger?event=${event}&callback=${eventsubCallback}`
      );
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
        <Button variant="contained" style={{ marginRight: 5 }}>
          Trigger End Stream
        </Button>
        <Button variant="contained">Trigger AFK</Button>
      </Paper>
    </>
  );
};
