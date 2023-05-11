const express = require('express');
const router = express.Router();

// Récupérer take catégories à partir de la position skip
router.get('/', (req, res) => {
  const { take, skip } = req.query;
  // Code pour récupérer les catégories avec les paramètres spécifiés
});

// Récupérer une catégorie ayant l'id donné
router.get('/:id', (req, res) => {
  const { id } = req.params;
  // Code pour récupérer la catégorie avec l'id spécifié
});

// Ajouter une nouvelle catégorie
router.post('/', (req, res) => {
  const categoryData = req.body;
  // Code pour ajouter une nouvelle catégorie à partir des données envoyées
});

// Mettre à jour la catégorie
router.patch('/', (req, res) => {
  const updatedCategoryData = req.body;
  // Code pour mettre à jour la catégorie avec les données envoyées
});

// Supprimer la catégorie ayant l'id donné
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // Code pour supprimer la catégorie avec l'id spécifié
});

module.exports = router;
