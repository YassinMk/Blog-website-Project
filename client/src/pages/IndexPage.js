import Post from "../Post";
import React, { useState, useEffect } from "react";
import CommentSection from "../CommentSection";
import CategoryList from "../CategoriesList";
export default function IndexPage() {
  const [articles, setArticles] = useState([]);
  const [reRender, setReRender] = useState(0);
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:3001/articles", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArticles();
  }, [reRender]);
  return (
    <>
            <CategoryList/>

      {articles.map((article) => (
        <React.Fragment key={article.id}>
          
          <div className="post-comment">
          <Post article={article} />
          
          <CommentSection setReRender={setReRender} comments={article.commentaire} articleId={article.id}/>
          </div>
        </React.Fragment>
      ))}
    </>
  );
}
