import PostCard from "./PostCard";
import { useState } from "react";
import handleLike from "./postLikes";

const PostList = ({ posts }) => {
  const [postDetails, setPostDetails] = useState(posts);

  return (
    <div>
      {posts.length > 0 ? (
        postDetails.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            likeHandler={handleLike}
            setPosts={setPostDetails}
          />
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostList;
