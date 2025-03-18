import { useState, useEffect, useRef } from 'react';
import { databases, storage } from './votre-config-appwrite';
import { FaEdit, FaTrash, FaFileDownload, FaSpinner, FaTimes, FaImage } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const SocialUpload = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ files: [], caption: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  // Configuration
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'video/mp4', 'application/pdf'];
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const POSTS_COLLECTION = 'posts_collection';
  const BUCKET_ID = '67c698210004ee988ef1';

  // Charger les publications initiales
  useEffect(() => {
    const loadPosts = async () => {
      const { documents } = await databases.listDocuments(
        '67bb32ca00157be0d0a2', // DATABASE_ID
        POSTS_COLLECTION
      );
      setPosts(documents);
    };
    loadPosts();
  }, []);

  // Gestion de la sélection de fichiers
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
    );
    
    setNewPost(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles].slice(0, 10)
    }));
  };

  // Publication
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload des fichiers
      const uploadedFiles = await Promise.all(
        newPost.files.map(file => 
          storage.createFile(BUCKET_ID, uuidv4(), file)
        )
      );

      // Création du post
      const post = await databases.createDocument(
        '67bb32ca00157be0d0a2',
        POSTS_COLLECTION,
        uuidv4(),
        {
          user_id: user.$id,
          files: uploadedFiles.map(f => f.$id),
          caption: newPost.caption,
          type: newPost.files[0]?.type.split('/')[0]
        }
      );

      setPosts(prev => [post, ...prev]);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Modification de publication
  const handleEdit = async () => {
    if (!editPost) return;

    try {
      const updatedPost = await databases.updateDocument(
        '67bb32ca00157be0d0a2',
        POSTS_COLLECTION,
        editPost.$id,
        { caption: editPost.caption }
      );

      setPosts(prev => 
        prev.map(p => p.$id === updatedPost.$id ? updatedPost : p)
      );
      setEditPost(null);
    } catch (error) {
      console.error('Erreur modification:', error);
    }
  };

  // Suppression de publication
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      // Supprimer les fichiers associés
      await Promise.all(
        deleteConfirm.files.map(fileId => 
          storage.deleteFile(BUCKET_ID, fileId)
        )
      );

      // Supprimer le document
      await databases.deleteDocument(
        '67bb32ca00157be0d0a2',
        POSTS_COLLECTION,
        deleteConfirm.$id
      );

      setPosts(prev => prev.filter(p => p.$id !== deleteConfirm.$id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const resetForm = () => {
    setNewPost({ files: [], caption: '' });
    fileInputRef.current.value = '';
  };

  // Composant de fichier
  const FilePreview = ({ fileId, type }) => {
    const [fileUrl, setFileUrl] = useState('');

    useEffect(() => {
      const getUrl = async () => {
        const url = storage.getFilePreview(BUCKET_ID, fileId);
        setFileUrl(url);
      };
      getUrl();
    }, [fileId]);

    if (type === 'image') {
      return <img src={fileUrl} alt="Post" className="w-full h-64 object-cover rounded-lg" />;
    }

    if (type === 'video') {
      return (
        <video controls className="w-full h-64 rounded-lg">
          <source src={fileUrl} type="video/mp4" />
        </video>
      );
    }

    return (
      <a href={fileUrl} download className="p-4 bg-gray-100 rounded-lg flex items-center">
        <FaFileDownload className="mr-2" />
        Télécharger PDF
      </a>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Formulaire de création */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newPost.caption}
            onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
            placeholder="Quoi de neuf ?"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaImage className="text-blue-500 text-xl" />
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept={ALLOWED_TYPES.join(',')}
                />
              </button>
              <span className="text-gray-500 text-sm">
                {newPost.files.length} fichier(s) sélectionné(s)
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || (!newPost.caption && !newPost.files.length)}
              className={`px-6 py-2 rounded-full ${
                isLoading || (!newPost.caption && !newPost.files.length)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : 'Publier'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des publications */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.$id} className="bg-white rounded-lg shadow-md p-4">
            {/* En-tête */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <img
                  src={storage.getFilePreview(BUCKET_ID, user.profile_image)}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Profile"
                />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.$createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {post.user_id === user.$id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditPost(post)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaEdit className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(post)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="mb-4">
              <p className="text-gray-800">{post.caption}</p>
            </div>

            {/* Fichiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.files.map((fileId, index) => (
                <FilePreview key={index} fileId={fileId} type={post.type} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {editPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Modifier la publication</h3>
            <textarea
              value={editPost.caption}
              onChange={(e) => setEditPost({ ...editPost, caption: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              rows="3"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditPost(null)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-4">Êtes-vous sûr de vouloir supprimer définitivement cette publication ?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialUpload;
