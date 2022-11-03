import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Widget } from "./Views/Widget";
import { Dashboard } from "./Views/Dashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="widget" element={<Widget />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
