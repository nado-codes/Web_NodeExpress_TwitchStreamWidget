import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Widget } from "./Views/Widget";
import { Dashboard } from "./Views/Dashboard";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={4} autoHideDuration={2000}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="widget" element={<Widget />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </div>
  );
}

export default App;
