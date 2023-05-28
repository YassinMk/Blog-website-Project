import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function CommentBox({ comments, articleId }) {
  const [comment, setComment] = useState('');
  const [token, setToken] = useState('');
  const [commentList, setCommentList] = useState(comments);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [commentEdit, setCommentEdit] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    async function getUser(storedToken) {
      try {
        const userResponse = await fetch('http://localhost:3001/users/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${storedToken}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserEmail(userData.email);
        }
      } catch (error) {
        console.error(error);
      }
    }

    getUser(storedToken);
  }, []);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3001/commentaires/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        setCommentList(commentList.filter((comment) => comment.id !== commentId));
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitComment = async () => {
    try {
      const userResponse = await fetch('http://localhost:3001/users/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserEmail(userData.email);

        const response = await fetch('http://localhost:3001/commentaires', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({ email: userData.email, contenu: comment, articleId }),
        });

        if (response.ok) {
          const newComment = await response.json();
          console.log('Submitted comment:', newComment);

          setComment('');
          setCommentList([...commentList, newComment]);
        } else {
          alert('Failed to submit comment');
        }
      } else {
        alert('Please log in to comment');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitComment();
  };

  function extractNameFromEmail(email) {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
      return email.substring(0, atIndex);
    } else {
      return email;
    }
  }

  function handleCommentEditChange(e) {
    setCommentEdit(e.target.value);
  }

  async function handleEdit(id, email) {
    console.log(commentEdit, id, email);
    try {
      const response = await fetch(`http://localhost:3001/commentaires/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ articleId, contenu: commentEdit, email }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setCommentList((prevComments) =>
          prevComments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment))
        );
      } else {
        alert('Failed to update comment');
      }
    } catch (error) {
      console.error(error);
    }

    setShowEdit(false);
  }

  return (
    <div>
      <hr className="comment-line" />
      <form onSubmit={handleSubmit} className="comment-forum">
        <div style={{ marginBottom: '10px' }}>
          <textarea
            style={{
              width: '95%',
              minHeight: '50px',
              padding: '10px',
              marginLeft: '17px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              resize: 'vertical',
            }}
            value={comment}
            onChange={handleCommentChange}
            placeholder="Enter your comment..."
            required
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '8px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            width: '80px',
            maxHeight: '30px',
            marginTop: '-10px',
            marginLeft: '88%',
          }}
        >
          Add
        </button>
      </form>
      {commentList && commentList.length > 0 && (
        <div className="comments-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <hr className="comment-separator" />
          {commentList.map((comment, index) => (
            <div className="comment" key={comment.id}>
              <FontAwesomeIcon icon={faCircleUser} className="icon-profil-comment" />
              <span style={{ marginLeft: '2px', fontWeight: 'bold' }}>
                {extractNameFromEmail(comment.email)}
              </span>
              <p className="comment-content">{comment.contenu}</p>
              {comment.email === userEmail && (
                <div>
                  {showEdit && (
                    <div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleEdit(comment.id, comment.email);
                        }}
                        className="comment-forum"
                      >
                        <div style={{ marginBottom: '10px' }}>
                          <textarea
                            style={{
                              width: '95%',
                              minHeight: '50px',
                              padding: '10px',
                              marginLeft: '17px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              resize: 'vertical',
                            }}
                            onChange={handleCommentEditChange}
                            placeholder="Enter your edited comment..."
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          style={{
                            padding: '8px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            width: '80px',
                            maxHeight: '30px',
                            marginTop: '-10px',
                            marginLeft: '88%',
                          }}
                        >
                          Edit
                        </button>
                      </form>
                    </div>
                  )}

                  {!showEdit && (
                    <>
                      <button
                        className="edit-button"
                        onClick={() => setShowEdit(true)}
                        style={{
                          padding: '8px',
                          backgroundColor: 'rgb(0, 123, 255)',
                          border: 'none',
                          borderRadius: '9px',
                          width: '50px',
                          marginTop: '-29px',
                          marginLeft: '85%',
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="delete-button" onClick={() => deleteComment(comment.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </>
                  )}
                </div>
              )}
              {index !== commentList.length - 1 && <hr className="comment-separator" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
