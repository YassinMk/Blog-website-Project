const express = require('express');
const router = express.Router();

// Récupérer take articles à partir de la position skip
router.get('/', (req, res) => {
  const { take, skip } = req.query;
  // Code pour récupérer les articles avec les paramètres spécifiés
});

// Récupérer un article ayant l'id donné
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.send(id);
});

// Ajouter un nouveau article
router.post('/', (req, res) => {
  const articleData = req.body;
  // Code pour ajouter un nouvel article à partir des données envoyées
});

// Mettre à jour l'article
router.patch('/', (req, res) => {
  const updatedArticleData = req.body;
  // Code pour mettre à jour l'article avec les données envoyées
});

// Supprimer l'article ayant l'id donné
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // Code pour supprimer l'article avec l'id spécifié
});

module.exports = router;
