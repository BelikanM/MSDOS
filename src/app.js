
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './Nav';
import Upload from './Upload';
import Affichage from './Affichage';
import Abonnements from './Abonnements';
import Paramètres from './Paramètres';

const App = () => {
    return (
        <Router>
            <Nav />
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/affichage" element={<Affichage />} />
                    <Route path="/abonnements" element={<Abonnements />} />
                    <Route path="/parametres" element={<Paramètres />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

