import React from "react";
import logo from "../res/nadotornado.png";
import "../App.css";

export const Widget: React.FC = () => {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );
};
