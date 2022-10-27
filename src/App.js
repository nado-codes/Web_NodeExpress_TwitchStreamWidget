import logo from "./res/nadotornado.png";
import "./App.css";
import song from "./res/surprise.mp3";
import data from "./data.json";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const audio = new Audio(song);
    audio.play();
    console.log("data=", data);

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <ul style={{ textAlign: "left", userSelect: "none" }}>
        <li>
          <b>Followers: </b>1
        </li>
        <li>
          <b>Subs: </b>2
        </li>
        <li>
          <b>Donos: </b>3
        </li>
        <li>
          <b>Raids: </b>4
        </li>
      </ul>
    </div>
  );
}

export default App;
