
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';


export default function ProfilUser(){
    const [userData, setUserData] = useState(null);
    const [articles, setArticles] = useState([]);
    const backendBaseUrl = 'http://localhost:3001/'
    const createMarkup = (htmlContent) => {
        return { __html: htmlContent };
      };
      
    useEffect(() => {
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
          // Retrieve user ID from local storage
         
          // Fetch user data using the user ID
          const userResponse = await fetch("http://localhost:3001/users/", {
            headers: {
            'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          });
          const userData = await userResponse.json();
          setUserData(userData); 
          const articlesResponse = await fetch('http://localhost:3001/articles/byuser',{
            headers: {
            'Content-Type': 'application/json',
                Authorization: `${token}`,

                 }
            });
           const articlesData = await articlesResponse.json();
          setArticles(articlesData);
        } catch (error) {
            console.error(error);
          }
        };
        
        fetchUserData();
    }, []);
    const handleDeleteArticle = async (articleId) => {
        try {
          const token = localStorage.getItem('token');
          await fetch(`http://localhost:3001/articles/${articleId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`,
            },
          });
          
          // Remove the deleted article from the articles state
          setArticles((prevArticles) => prevArticles.filter((article) => article.id !== articleId));
        } catch (error) {
          console.error(error);
        }
    };

    return(
        <div>
      {userData && (
        <div className="profile">
          <div className="profile-info">
            <h2>{userData.nom}</h2>
            <FontAwesomeIcon icon={faCircleUser}  className='icon-profil' />
            <h5>{userData.email}</h5>
            
          </div>
          <div className="published-articles">
            <h3>Published Articles</h3>
            
            {articles.length > 0 ? (
              articles.map((article) => (
                <div className='published'>
                <div className="post" key={article.id}>
                  
                  <div className="image">
                    <img src={`${backendBaseUrl}${article.image.replace('../public/', '')}`}  alt="Article Image" />
                  </div>
                  <div className="texts">
                    <h2>{article.titre}</h2>
                    <p className="info">
                      <a className="author">{article.author.nom}</a>
                      {' '}
                      <time>{new Date(article.createdAt).toLocaleString('en-US', {
                            timeZone: 'Africa/Casablanca',
                            dateStyle: 'long',
                            timeStyle: 'medium',
                            })}</time>
                    </p>
                    <div dangerouslySetInnerHTML={createMarkup(article.contenu)} />
                  </div>
               
                 <button className="delete" onClick={() => handleDeleteArticle(article.id)}>Delete</button>
                  </div>
                  <hr className="line" />
                  </div>
                  
              ))
            ) : (
              <p>No articles found.</p>
            )}
          </div>
          </div>
         
      )}
</div>
      );
}