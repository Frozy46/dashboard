import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "./pages/Home";
import SupervisorPage from "./pages/SupervisorPage";

function App() {
  return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/supervisor" element={<SupervisorPage />} />
            </Routes>
        </Router>
  );
}

export default App;
