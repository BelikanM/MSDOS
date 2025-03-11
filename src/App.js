import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Affichage from "./Affichage";
import Abonnements from "./Abonnements";
import Navbar from "./Navbar"; // Importer la barre de navigation

function App() {
  return (
    <Router>
      <div className="App">
        {/* Barre de navigation en haut */}
        <Navbar />
        
        {/* Configuration des routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/affichage" element={<Affichage />} />
          <Route path="/abonnements" element={<Abonnements />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
