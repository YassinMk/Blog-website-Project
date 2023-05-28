import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentForm from "./CommentBox";

export default function Post({ article }) {
  const backendBaseUrl = "http://localhost:3001/";
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };
  const categoryNames = article.categories.map((category) => category.name);
  const categoryList = categoryNames.join(", ");
  return (
    <div className="post">
      <div className="image">
        {article.image.startsWith("https://loremflickr.com/") ? (
          <img
            src={article.image + "?random=" + article.id}
            alt="Article Image"
          />
        ) : (
          <img
            src={`${backendBaseUrl}${article.image.replace("../public/", "")}`}
            alt="Article Image"
          />
        )}
      </div>
      <div className="texts">
        <h2>{article.titre}</h2>
        <p className="info">
          <FontAwesomeIcon icon={faCircleUser} className="icon-post" />
          <a className="author">{article.author.nom}</a>{" "}
          <time>
            {new Date(article.createdAt).toLocaleString("en-US", {
              timeZone: "Africa/Casablanca",
              dateStyle: "long",
              timeStyle: "medium",
            })}
          </time>
          <div className="categories">{categoryList}</div>
        </p>
        {article.contenu.includes("<p>") ? (
          <div dangerouslySetInnerHTML={createMarkup(article.contenu)} />
        ) : (
          <p>{article.contenu}</p>
        )}
      </div>
    </div>
  );
}
