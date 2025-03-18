import { Client, Storage, Account, Databases } from "appwrite";

// Configuration des paramètres
const API_ENDPOINT = "https://cloud.appwrite.io/v1";
const PROJECT_ID = "67bb24ad002378e79e38";
const DATABASE_ID = "67bb32ca00157be0d0a2";  // Ajout de l'ID de la base de données
const BUCKET_ID = "67c698210004ee988ef1";

// Initialisation du client Appwrite
const client = new Client()
  .setEndpoint(API_ENDPOINT)
  .setProject(PROJECT_ID);

// Création des services Appwrite
const storage = new Storage(client);
const account = new Account(client);
const databases = new Databases(client);  // Ajout de la gestion des bases de données

// Fonction pour téléverser un fichier
export const uploadFile = async (file) => {
  try {
    const response = await storage.createFile(BUCKET_ID, "unique()", file);
    return response;
  } catch (error) {
    console.error("❌ Erreur lors du téléversement :", error);
    throw error;
  }
};

// Fonction pour récupérer l'URL du fichier
export const getFileURL = (fileId) => {
  return storage.getFilePreview(BUCKET_ID, fileId);
};

// Fonction pour supprimer un fichier
export const deleteFile = async (fileId) => {
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
    console.log("✅ Fichier supprimé !");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
    throw error;
  }
};

// Fonction pour lister les fichiers dans le bucket
export const listFiles = async () => {
  try {
    const files = await storage.listFiles(BUCKET_ID);
    return files.files;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des fichiers :", error);
    throw error;
  }
};

// Exportation des modules
export { client, account, storage, databases };  // Ajout de "databases"
