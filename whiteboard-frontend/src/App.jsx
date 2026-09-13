import BoardPage from "./BoardPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/board/:roomId" element={<BoardPage />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App;