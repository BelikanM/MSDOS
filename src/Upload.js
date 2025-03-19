
import React, { useState, useEffect } from 'react';
import { account, databases, storage } from './appwriteConfig';
import { FaGoogle, FaUpload, FaPaperPlane, FaTrash, FaEnvelope } from 'react-icons/fa';
import './Upload.css';

const Upload = () => {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [author, setAuthor] = useState('');
    const [email, setEmail] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const userData = await account.get();
                setUser(userData);
                setAuthor(userData.name);
                setEmail(userData.email);
                fetchUploadedFiles(); // Récupérer les fichiers déjà téléversés
            } catch (error) {
                console.error('Utilisateur non connecté');
            }
        };
        getUser();
    }, []);

    const fetchUploadedFiles = async () => {
        try {
            const response = await databases.listDocuments('67bb32ca00157be0d0a2', 'documents300');
            setUploadedFiles(response.documents);
        } catch (error) {
            console.error('Erreur lors de la récupération des documents :', error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await account.createOAuth2Session('google', 'http://localhost:3000/upload', 'http://localhost:3000/login');
        } catch (error) {
            console.error("❌ Erreur lors de l'authentification Google :", error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Veuillez vous connecter pour téléverser');
            return;
        }

        if (file) {
            try {
                const fileResponse = await storage.createFile(
                    '67c698210004ee988ef1', // BUCKET_ID
                    'unique()', // ID unique pour le fichier
                    file,
                    (progress) => {
                        setUploadProgress(progress);
                    }
                );

                const fileUrl = await storage.getFilePreview('67c698210004ee988ef1', fileResponse.$id);

                const response = await databases.createDocument(
                    '67bb32ca00157be0d0a2', // DATABASE_ID
                    'documents300', // COLLECTION_ID
                    'unique()', // ID unique pour le document
                    {
                        title,
                        description,
                        created_at: new Date().toISOString(),
                        file: fileUrl, // Utiliser l'URL du fichier téléversé
                        author,
                        email,
                    }
                );
                alert('Document créé avec succès !');
                setTitle('');
                setDescription('');
                setFile(null);
                setUploadProgress(0);
                fetchUploadedFiles(); // Mettre à jour la liste des fichiers téléversés
            } catch (error) {
                console.error('❌ Erreur lors de la création du document :', error);
            }
        } else {
            alert('❌ Aucun fichier sélectionné');
        }
    };

    const handleDelete = async (documentId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
            try {
                await databases.deleteDocument('67bb32ca00157be0d0a2', 'documents300', documentId);
                alert('Fichier supprimé avec succès !');
                fetchUploadedFiles(); // Mettre à jour la liste après suppression
            } catch (error) {
                console.error('❌ Erreur lors de la suppression du document :', error);
            }
        }
    };

    const handleEmailContact = (email) => {
        window.open(`mailto:${email}`, '_blank');
    };

    if (!user) {
        return (
            <div className="auth-container">
                <button onClick={handleGoogleLogin} className="btn-google">
                    <FaGoogle /> Se connecter avec Google
                </button>
            </div>
        );
    }

    return (
        <div className="upload-container">
            <h1>Upload Page</h1>
            <div className="user-info">
                <img src={user.prefs.picture} alt="User" className="user-photo" />
                <p>Bienvenue, {author}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label className="file-upload-label">
                    <FaUpload /> Choisir un fichier
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="file-upload-input"
                    />
                </label>
                <button type="submit" className="btn-submit">
                    <FaPaperPlane /> Téléverser
                </button>
                {uploadProgress > 0 && (
                    <div>
                        <progress value={uploadProgress} max="100" />
                        <span>{uploadProgress}%</span>
                    </div>
                )}
            </form>
            <h2>Fichiers Téléversés</h2>
            <div className="file-grid">
                {uploadedFiles.map((fileDoc) => (
                    <div key={fileDoc.$id} className="file-card">
                        <h3>{fileDoc.title}</h3>
                        <p>Envoyé par: {fileDoc.author} ({fileDoc.email})</p>
                        <button onClick={() => handleEmailContact(fileDoc.email)} className="contact-button">
                            <FaEnvelope /> Contacter
                        </button>
                        {fileDoc.file.endsWith('.mp4') && (
                            <video controls width="250">
                                <source src={fileDoc.file} type="video/mp4" />
                                Votre navigateur ne prend pas en charge la vidéo.
                            </video>
                        )}
                        {fileDoc.file.endsWith('.mp3') && (
                            <audio controls>
                                <source src={fileDoc.file} type="audio/mpeg" />
                                Votre navigateur ne prend pas en charge l'audio.
                            </audio>
                        )}
                        {fileDoc.file.endsWith('.jpg') || fileDoc.file.endsWith('.png') ? (
                            <img src={fileDoc.file} alt={fileDoc.title} width="250" />
                        ) : null}
                        <button onClick={() => handleDelete(fileDoc.$id)}>
                            <FaTrash /> Supprimer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Upload;

