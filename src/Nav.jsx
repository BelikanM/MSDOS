
// src/Nav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaEye, FaRegListAlt, FaCog } from 'react-icons/fa'; // Assurez-vous d'installer react-icons

const Nav = () => {
 return (
 <nav className="bg-blue-800 shadow-md">
 <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
 <div className="text-white text-lg font-bold">Mon e="text-white text-lg font-bold">Mon Application</div>
 <ul className="flex space-x-6">
 <li>
 <Link to="/upload" className="text-white flex items-center hover:text-blue-300 transition-colors">
 <FaUpload className="mr-2" />
 Upload
 </Link>
 </li>
 <li>
 <Link to="/affichage" className="text-white flex items-center hover:text-blue-300 transition-colors">
 <FaEye className="mr-2" />
 Affichage
 </Link>
 </li>
 <li>
 <Link to="/abonnements" className="text-white flex items-center hover:text-blue-300 transition-colors">
 <FaRegListAlt className="mr-2" />
 Abonnements
 </Link>
 </li>
 <li>
 <Link to="/parametres" className="text-white flex items-center hover:text-blue-300 transition-colors">
 <FaCog className="mr-2" />
 Paramètres
 </Link>
 </li>
 </ul>
 </div>
 </nav>
 );
};

export default Nav;

