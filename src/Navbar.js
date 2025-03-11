
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaListAlt, FaUserFriends, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css'; // Assurez-vous d'importer le fichier CSS

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // État pour gérer l'ouverture/fermeture de la barre

  // Fonction pour ouvrir/fermer la barre de navigation
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Bouton pour ouvrir/fermer la barre de navigation (Menu hamburger) */}
      <button
        onClick={toggleNav}
        className="hamburger"
        aria-label="Toggle Navigation"
      >
        {isOpen ? <FaTimes className="icon" /> : <FaBars className="icon" />}
      </button>

      {/* Barre de navigation */}
      <nav className={`navbar ${isOpen ? 'open' : 'closed'}`}>
        {/* Icônes de navigation avec liens */}
        <Link
          to="/"
          className="nav-link"
          aria-label="Accueil"
          onClick={() => setIsOpen(false)} // Ferme le menu après clic sur un lien
        >
          <FaHome className="icon" />
          <span>Accueil</span>
        </Link>
        <Link
          to="/affichage"
          className="nav-link"
          aria-label="Affichage"
          onClick={() => setIsOpen(false)}
        >
          <FaListAlt className="icon" />
          <span>Affichage</span>
        </Link>
        <Link
          to="/abonnements"
          className="nav-link"
          aria-label="Abonnements"
          onClick={() => setIsOpen(false)}
        >
          <FaUserFriends className="icon" />
          <span>Abonnements</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;

