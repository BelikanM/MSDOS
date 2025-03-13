
// createDocument.js
const { Client, Databases, Storage } = require('appwrite');

// Initialisez le client Appwrite
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Remplacez par votre endpoint
    .setProject('67bb24ad002378e79e38') // Remplacez par votre Project ID
    .setKey('standard_3f73de9c98e0013d3f9474426e8fced16bd8b783a1c18b056d34713cd9776621781ac96561cc0e8959ec86b484952d265eb6c5b070334e400eaa91174db365f044904d82ca94cd0f5efceebe6adfd188b2502cfb6d3721ac6a3b1bd14dafda2eaa00713133b050fbc3095fc92bda0b64ddf27cef1d1737f810497aa56fd4a289'); // Utilisez votre clé API ici

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = '67bb32ca00157be0d0a2'; // ID de la base de données
const COLLECTION_ID = '67c69c970021d1518651'; // ID de la collection Boissons

const createDocument = async () => {
    try {
        // Exemple de données à insérer
        const documentData = {
            title: 'Exemple de Boisson',
            description: 'Description de la boisson.',
            email: 'example@example.com',
            fileId: 'unique-file-id', // Remplacez par un ID de fichier valide
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Créer un document dans la collection
        const response = await databases.createDocument(
            DATABASE_ID, 
            COLLECTION_ID, 
            'unique()', // ID du document, ici généré automatiquement
            documentData
        );

        console.log('Document créé avec succès:', response);
    } catch (error) {
        console.error('Erreur lors de la création du document:', error);
    }
};

// Exécutez la fonction
createDocument();

