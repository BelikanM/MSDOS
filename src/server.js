
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration MySQL
const dbConfig = {
  host: '127.0.0.1',
  user: 'Belikan',
  password: 'Dieu19961991??!',
  database: 'MSDOS',
};

// Configuration de multer pour gérer les fichiers
const upload = multer({ dest: 'uploads/' });

// Récupération des uploads
app.get('/uploads', async (req, res) => {
  const userId = req.query.userId;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM uploads WHERE userId = ?', [userId]);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des uploads:", error);
    res.status(500).send("Erreur serveur");
  }
});

// Téléversement des fichiers
app.post('/uploads', upload.fields([{ name: 'video' }, { name: 'image' }, { name: 'pdf' }]), async (req, res) => {
  const { title, description, textContent, userId } = req.body;

  try {
    const fileUrls = {};

    if (req.files.video) {
      const videoFile = req.files.video[0];
      fileUrls.videoUrl = `http://localhost:5000/uploads/${videoFile.filename}`;
    }

    if (req.files.image) {
      const imageFile = req.files.image[0];
      fileUrls.imageUrl = `http://localhost:5000/uploads/${imageFile.filename}`;
    }

    if (req.files.pdf) {
      const pdfFile = req.files.pdf[0];
      fileUrls.pdfUrl = `http://localhost:5000/uploads/${pdfFile.filename}`;
    }

    const connection = await mysql.createConnection(dbConfig);
    await connection.query('INSERT INTO uploads (title, description, textContent, userId, videoUrl, imageUrl, pdfUrl) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      title,
      description,
      textContent,
      userId,
      fileUrls.videoUrl || null,
      fileUrls.imageUrl || null,
      fileUrls.pdfUrl || null
    ]);
    await connection.end();
    res.status(201).send();
  } catch (error) {
    console.error("Erreur lors du téléversement:", error);
    res.status(500).send("Erreur lors du téléversement");
  }
});

// Suppression d'un upload
app.delete('/uploads/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM uploads WHERE id = ?', [id]);

    if (rows.length > 0) {
      ['videoUrl', 'imageUrl', 'pdfUrl'].forEach((key) => {
        if (rows[0][key]) {
          const filePath = path.join(__dirname, 'uploads', path.basename(rows[0][key]));
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }

    await connection.query('DELETE FROM uploads WHERE id = ?', [id]);
    await connection.end();
    res.sendStatus(204);
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    res.status(500).send("Erreur serveur");
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

