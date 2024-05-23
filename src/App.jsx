import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import ListPage from "./pages/ListPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
      <Route path="/list" element={<ListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
