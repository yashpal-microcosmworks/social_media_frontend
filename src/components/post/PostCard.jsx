import { useState } from "react";
import commentHandler from "./postComments";
import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "../utils/auth";
import styles from "./PostCard.module.css";

const reactionEmojis = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  sad: "😢",
  angry: "😡",
};

const token = getAuthToken();
const currentUser = token ? jwtDecode(token) : null;

const getReactionsSummary = (reactions) => {
  const uniqueReactions = new Set();
  reactions.forEach((reaction) => {
    Object.keys(reactionEmojis).forEach((key) => {
      if (reaction[key] > 0) {
        uniqueReactions.add(reactionEmojis[key]);
      }
    });
  });
  const emojisArray = Array.from(uniqueReactions).slice(0, 3);

  return {
    emojis: emojisArray.join(" "),
  };
};

const PostCard = ({ post, likeHandler, setPosts }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [comment, setComment] = useState("");
  const { emojis } = getReactionsSummary(post.reactions || []);

  const userReaction = post.reactions?.find(
    (reaction) => reaction.user.id === currentUser?.user.id
  );

  const getUserReactionType = (userReaction) => {
    if (!userReaction) return "like";

    return (
      Object.keys(reactionEmojis).find((key) => userReaction[key] > 0) || "like"
    );
  };

  const [reaction, setReaction] = useState(getUserReactionType(userReaction));

  const toggleComments = async () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() === "") return;
    const newComment = await commentHandler(post.id, comment);
    setComments([...comments, newComment]);
    setComment("");
  };

  const selectReaction = async (reaction) => {
    setShowReactions(false);
    setReaction(reaction);
    await likeHandler(post.id, reaction, setPosts);
  };

  return (
    <div className={styles.postCard}>
      <p className={styles.postContent}>{post.content}</p>
      {post.media &&
        post.media.map((file, index) => (
          <img
            key={index}
            src={file.media_files}
            alt="Post Media"
            className={styles.postImage}
          />
        ))}

      <div className={styles.reactionSummary}>
        {post.totalReactions > 0 && (
          <span>
            {emojis} {post.totalReactions}
          </span>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <div
          className={styles.likeContainer}
          onMouseEnter={() => setShowReactions(true)}
          // onMouseLeave={() => setShowReactions(false)}
        >
          <button className={styles.likeButton}>
            {emojis.length > 0
              ? `${reactionEmojis[reaction]} ${reaction}`
              : "👍like"}
          </button>

          {showReactions && (
            <div className={styles.reactionPopup}>
              {Object.entries(reactionEmojis).map(([key, emoji]) => (
                <span
                  key={key}
                  className={styles.reactionIcon}
                  onClick={() => selectReaction(key)}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        <button className={styles.commentButton} onClick={toggleComments}>
          💬 {comments.length}
        </button>
      </div>

      {showCommentBox && (
        <div
          className={`${styles.commentSection} ${
            showCommentBox ? styles.show : ""
          }`}
        >
          <input
            type="text"
            className={styles.commentInput}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button
            className={styles.commentSubmitButton}
            onClick={handleCommentSubmit}
          >
            Post
          </button>

          <div className={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.commentItem}>
                <span className={styles.commentAuthor}>{comment.user}:</span>
                <span className={styles.commentText}>{comment.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
