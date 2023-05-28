import React, { useEffect, useState } from 'react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/categories'); // Replace with your API endpoint
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Categories</h2>
      <ul style={{
    display: "flex",
    listStyle: "none",
    flexWrap: "wrap",
    gap: "8px",
}}>
        {categories.map(category => (
          <li key={category.id} style={{
            
    background: "#777474",
    color: "white",
    borderRadius: "5px",
    padding: "8px",

          }}>
            {category.name} - {category.article.length} articles
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
