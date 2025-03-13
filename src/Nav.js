
// src/Nav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaEye, FaRegListAlt, FaCog } from 'react-icons/fa'; // Assurez-vous d'installer react-icons
import './Nav.css'; // Importez le fichier CSS

const Nav = () => {
    return (
        <nav className="navbar">
            <Link to="/upload" className="nav-link flex flex-col items-center">
                <FaUpload className="icon" />
            </Link>
            <Link to="/affichage" className="nav-link flex flex-col items-center">
                <FaEye className="icon" />
            </Link>
            <Link to="/abonnements" className="nav-link flex flex-col items-center">
                <FaRegListAlt className="icon" />
            </Link>
            <Link to="/parametres" className="nav-link flex flex-col items-center">
                <FaCog className="icon" />
            </Link>
        </nav>
    );
};

export default Nav;

