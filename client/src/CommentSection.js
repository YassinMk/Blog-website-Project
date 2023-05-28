import React, { useState } from 'react';
import CommentBox from './CommentBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faComment} from '@fortawesome/free-solid-svg-icons';


export default function CommentSection({ comments ,articleId,setReRender}) {
  const [showCommentBox, setShowCommentBox] = useState(false);

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
    setReRender(prev=>prev+1);
  };

  return (
          <div className='commentsection'>
          <h2 onClick={toggleCommentBox}>
            Commentaire <FontAwesomeIcon icon={faComment} size='sm' className='icon-comment' />
          </h2>
          {showCommentBox && <CommentBox comments={comments}  articleId={articleId} />}
          </div>
      );
}
