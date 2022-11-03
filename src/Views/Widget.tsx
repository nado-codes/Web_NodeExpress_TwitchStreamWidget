import React from "react";
import logo from "../res/nadotornado.png";
import "../App.css";
import { Button } from "@mui/material";

import data from "../data.json";

import song from "../res/surprise.mp3";
import axios from "axios";

interface EventData {
  "channel.follow": number;
  "channel.subscribe": number;
  "channel.raid": number;
  "channel.dono": number;
}

export const Widget: React.FC = () => {
  const eventsubCallback = "http://localhost:2122/webhooks/callback";
  const {
    "channel.follow": follows,
    "channel.subscribe": subs,
    "channel.raid": raids,
    "channel.dono": donos,
  }: EventData = data as EventData;

  console.log(typeof data);

  const triggerEvent = async (event: string) => {
    const audio = new Audio(song);
    audio.play();

    try {
      await axios.post(
        `http://localhost:2022/trigger?event=${event}&callback=${eventsubCallback}`
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <div style={{ textAlign: "left", marginLeft: 10 }}>
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

      <ul style={{ textAlign: "left", userSelect: "none" }}>
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
    </div>
  );
};
