const express = require('express');
const router = express.Router();

// Récupérer take commentaires à partir de la position skip
router.get('/', (req, res) => {
  const { take, skip } = req.query;
  // Code pour récupérer les commentaires avec les paramètres spécifiés
});

// Récupérer un commentaire ayant l'id donné
router.get('/:id', (req, res) => {
  const { id } = req.params;
  // Code pour récupérer le commentaire avec l'id spécifié
});

// Ajouter un nouveau commentaire
router.post('/', (req, res) => {
  const commentData = req.body;
  // Code pour ajouter un nouveau commentaire à partir des données envoyées
});

// Mettre à jour le commentaire
router.patch('/', (req, res) => {
  const updatedCommentData = req.body;
  // Code pour mettre à jour le commentaire avec les données envoyées
});

// Supprimer le commentaire ayant l'id donné
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    // Code pour supprimer le commentaire avec l'id spécifié
  });
  
  module.exports = router;
