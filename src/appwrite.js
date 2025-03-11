// appwrite.js

import { Client, Storage } from "appwrite";

// Configuration directe des paramètres
const API_ENDPOINT = "https://cloud.appwrite.io/v1";
const PROJECT_ID = "67bb24ad002378e79e38";
const BUCKET_ID = "67c698210004ee988ef1";
const API_KEY = "standard_3f73de9c98e0013d3f9474426e8fced16bd8b783a1c18b056d34713cd9776621781ac96561cc0e8959ec86b484952d265eb6c5b070334e400eaa91174db365f044904d82ca94cd0f5efceebe6adfd188b2502cfb6d3721ac6a3b1bd14dafda2eaa00713133b050fbc3095fc92bda0b64ddf27cef1d1737f810497aa56fd4a289";

// Initialisation du client Appwrite
const client = new Client()
  .setEndpoint(API_ENDPOINT)   // Définir l'endpoint
  .setProject(PROJECT_ID);     // Définir le project ID

// Création du service de stockage
const storage = new Storage(client);

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

// Nouvelle fonction pour lister les fichiers dans le bucket
export const listFiles = async () => {
  try {
    const files = await storage.listFiles(BUCKET_ID);
    return files.files;  // Retourne la liste des fichiers
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des fichiers :", error);
    throw error;
  }
};

export default { uploadFile, getFileURL, deleteFile, listFiles };
