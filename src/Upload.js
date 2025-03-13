
import React, { useEffect, useState } from 'react';
import { account } from './appwrite'; // Importer le client Appwrite
import axios from 'axios'; // Pour faire des requêtes à votre API MySQL
import { FaVideo, FaImage, FaFilePdf, FaTrash, FaGoogle } from 'react-icons/fa';

const Upload = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [textContent, setTextContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  // Connexion utilisateur automatique
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
        fetchUploads(userData.$id); // Charger les uploads de l'utilisateur
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
      }
    };

    fetchUser();
  }, []);

  // Récupération des uploads
  const fetchUploads = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/uploads?userId=${userId}`);
      setUploads(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des uploads:", error);
    }
  };

  // Connexion avec Google
  const handleLogin = async () => {
    try {
      const response = await account.createOAuth2Session('google');
      fetchUploads(response.user.$id); // Charger les uploads après connexion
    } catch (error) {
      console.error("Erreur de connexion Google:", error);
    }
  };

  // Téléversement des fichiers
  const handleUpload = async () => {
    if (!file && !imageFile && !pdfFile) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('textContent', textContent);
    formData.append('userId', user.$id);

    if (file) formData.append('video', file);
    if (imageFile) formData.append('image', imageFile);
    if (pdfFile) formData.append('pdf', pdfFile);

    try {
      await axios.post('http://localhost:5000/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchUploads(user.$id); // Recharger les uploads
    } catch (error) {
      console.error("Erreur lors du téléversement:", error);
    }

    // Réinitialiser les champs
    setTitle('');
    setDescription('');
    setFile(null);
    setImageFile(null);
    setPdfFile(null);
    setTextContent('');
  };

  // Suppression d'un upload
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/uploads/${id}`);
      setUploads(uploads.filter(upload => upload.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Upload Content</h1>
      {user ? (
        <div>
          <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
            />
            <textarea
              placeholder="Write your text here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
              rows="4"
            ></textarea>

            <div className="flex justify-between items-center my-4">
              <label className="cursor-pointer flex items-center gap-2">
                <FaVideo className="text-blue-500" />
                <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
                <span>Upload Video</span>
              </label>

              <label className="cursor-pointer flex items-center gap-2">
                <FaImage className="text-green-500" />
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
                <span>Upload Image</span>
              </label>

              <label className="cursor-pointer flex items-center gap-2">
                <FaFilePdf className="text-red-500" />
                <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="hidden" />
                <span>Upload PDF</span>
              </label>
            </div>

            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded shadow-md w-full">
              Upload
            </button>
          </div>

          {/* Uploads Section */}
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Your Uploads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploads.map(upload => (
                <div key={upload.id} className="bg-white shadow-lg rounded-lg p-4">
                  <h3 className="font-bold">{upload.title}</h3>
                  <p>{upload.description}</p>
                  {upload.videoUrl && (
                    <video controls src={upload.videoUrl} className="w-full mt-2 rounded-lg" />
                  )}
                  {upload.imageUrl && (
                    <img src={upload.imageUrl} alt="Uploaded" className="w-full mt-2 rounded-lg" />
                  )}
                  {upload.pdfUrl && (
                    <iframe
                      src={upload.pdfUrl}
                      className="w-full mt-2 rounded-lg"
                      height="300"
                      title="PDF Viewer"
                    ></iframe>
                  )}
                  <button onClick={() => handleDelete(upload.id)} className="bg-red-500 text-white px-4 py-2 rounded shadow">
                    <FaTrash /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4">Please Log In</h2>
          <button onClick={handleLogin} className="bg-green-500 flex items-center gap-2 px-4 py-2 rounded">
            <FaGoogle /> Login with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;

