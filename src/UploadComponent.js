import { useState, useEffect } from "react";
import { Client, Storage } from "appwrite";

const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
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
    <div className="upload-container">
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? "Téléversement..." : "Téléverser"}
      </button>

      <h2>Fichiers téléversés</h2>
      <ul>
        {fileList.map((file) => (
          <li key={file.$id}>
            {file.mimeType.startsWith("image/") ? (
              <img
                src={getFileUrl(file.$id, file.mimeType)}
                alt={file.name}
                width="100"
              />
            ) : (
              <a href={getFileUrl(file.$id, file.mimeType)} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            )}
            <button onClick={() => deleteFile(file.$id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadComponent;
