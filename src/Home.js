import { useState, useEffect } from "react";
import { Client, Storage } from "appwrite";

const Home = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Configuration Appwrite
  const client = new Client();
  client
    .setEndpoint(process.env.REACT_APP_API_ENDPOINT)
    .setProject(process.env.REACT_APP_PROJECT_ID);

  const storage = new Storage(client);

  // Gestion du changement de fichier
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Téléversement du fichier
  const uploadFile = async () => {
    if (!file) {
      alert("Sélectionne un fichier !");
      return;
    }

    setUploading(true);
    try {
      const response = await storage.createFile(
        process.env.REACT_APP_BUCKET_ID,
        "unique()", // ID unique généré automatiquement
        file
      );
      console.log("Fichier téléversé : ", response);
      fetchFiles(); // Mettre à jour la liste des fichiers après téléversement
    } catch (error) {
      console.error("Erreur lors du téléversement : ", error);
    }
    setUploading(false);
  };

  // Récupérer la liste des fichiers
  const fetchFiles = async () => {
    try {
      const response = await storage.listFiles(process.env.REACT_APP_BUCKET_ID);
      setFileList(response.files);
    } catch (error) {
      console.error("Erreur lors de la récupération des fichiers : ", error);
    }
  };

  // Obtenir l'URL de prévisualisation ou de téléchargement
  const getFileUrl = (fileId, mimeType) => {
    if (mimeType.startsWith("image/")) {
      return storage.getFilePreview(process.env.REACT_APP_BUCKET_ID, fileId);
    } else if (mimeType === "application/pdf") {
      return storage.getFileView(process.env.REACT_APP_BUCKET_ID, fileId);
    } else {
      return storage.getFileView(process.env.REACT_APP_BUCKET_ID, fileId);
    }
  };

  // Supprimer un fichier
  const deleteFile = async (fileId) => {
    try {
      await storage.deleteFile(process.env.REACT_APP_BUCKET_ID, fileId);
      fetchFiles(); // Mettre à jour la liste après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier : ", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="upload-container p-6">
      <h1 className="text-2xl font-bold mb-4">Téléversement de Fichiers</h1>
      
      {/* Sélectionner un fichier */}
      <input type="file" onChange={handleFileChange} className="mb-4 p-2 border rounded" />
      
      {/* Bouton de téléversement */}
      <button 
        onClick={uploadFile} 
        disabled={uploading} 
        className={`p-2 rounded bg-blue-500 text-white ${uploading ? 'opacity-50' : 'hover:bg-blue-600'}`}
      >
        {uploading ? "Téléversement..." : "Téléverser"}
      </button>

      {/* Liste des fichiers téléversés */}
      <h2 className="text-xl font-semibold mt-6">Fichiers téléversés</h2>
      <ul className="mt-4 space-y-4">
        {fileList.length === 0 ? (
          <li>Aucun fichier trouvé.</li>
        ) : (
          fileList.map((file) => (
            <li key={file.$id} className="flex items-center space-x-4">
              {/* Afficher une image ou un lien selon le type de fichier */}
              {file.mimeType.startsWith("image/") ? (
                <img
                  src={getFileUrl(file.$id, file.mimeType)}
                  alt={file.name}
                  width="100"
                  className="rounded"
                />
              ) : file.mimeType === "application/pdf" ? (
                <a href={getFileUrl(file.$id, file.mimeType)} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {file.name}
                </a>
              ) : (
                <a href={getFileUrl(file.$id, file.mimeType)} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Télécharger {file.name}
                </a>
              )}
              {/* Bouton pour supprimer le fichier */}
              <button 
                onClick={() => deleteFile(file.$id)} 
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Home;
