import logo from "./res/nadotornado.png";
import "./App.css";
import song from "./res/hurricane.mp3";

function App() {
  const audio = new Audio(song);
  // audio.play();

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );
}

export default App;
