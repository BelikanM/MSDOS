// Affichage.js
import React, { useEffect, useState } from 'react';
import { listFiles } from './appwrite';  // Nouvelle importation

const Affichage = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await listFiles();  // Nouvelle fonction
      setFiles(response);
    };
    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Liste des fichiers</h1>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Affichage;
