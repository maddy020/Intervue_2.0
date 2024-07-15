import { Route, BrowserRouter, Routes } from "react-router-dom";
import { CodingPage } from "./components/CodingPage";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/coding" element={<CodingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
