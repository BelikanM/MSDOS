import React, { useState } from 'react';
import { storage } from './appwrite'; // Importation d'Appwrite

const Accueil = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file) {
      try {
        const uploadedFile = await storage.createFile('docs', file); // Téléversement du fichier
        console.log('Fichier téléversé :', uploadedFile);
      } catch (error) {
        console.error('Erreur de téléversement :', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1>Page d'Accueil</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Téléverser le fichier</button>
    </div>
  );
};

export default Accueil;
