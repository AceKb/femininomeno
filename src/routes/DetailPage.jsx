import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../client';

const DetailPage = () => {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]); // Initialize comments as an empty array
  const [secretKey, setSecretKey] = useState("");
  const [referencedPost, setReferencedPost] = useState(null); // Add state for referenced post
  const [loading, setLoading] = useState(true); // Add loading state

  const navigate = useNavigate();

  useEffect(() => {
    fetchPost().catch(console.error);
    fetchComments().catch(console.error);
  }, [params.id]);

  const fetchPost = async () => {
    setLoading(true); // Set loading to true when fetching starts
    const { data } = await supabase
      .from('posts')
      .select()
      .eq('id', params.id);

    setPost(data[0]);

    if (data[0].referencePostId) {
      const { data: refData } = await supabase
        .from('posts')
        .select()
        .eq('id', data[0].referencePostId);

      setReferencedPost(refData[0]);
    }
    setLoading(false); // Set loading to false when fetching ends
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select()
      .eq('post_id', params.id)
      .order('created_at', { ascending: true });

    setComments(data || []); // Ensure comments is always an array
  };

  const increaseUpvote = async () => {
    const updatedPost = { ...post, upvotes: post.upvotes + 1 };
    setPost(updatedPost);
    await updateUpvotes(updatedPost);
  };

  const updateUpvotes = async (updatedPost) => {
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: updatedPost.upvotes })
      .eq('id', params.id);
    if (error) console.error("Error updating upvotes:", error);
  };

  const deletePost = async () => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', params.id)
      .eq('secretKey', secretKey);
    
    if (error) {
      console.error("Error deleting post:", error);
      return;
    }
    alert("Post deleted successfully!");
    navigate("/", { replace: true });
  };

  const deleteComment = async (commentId) => {
    const key = prompt("Enter secret key to delete comment:");
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('secretKey', key);

    if (error) {
      alert("Invalid secret key. Comment not deleted.");
      return;
    }

    setComments(comments.filter((_, index) => index !== commentId));
    alert("Comment deleted successfully!");
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const createComment = async () => {
    if (comment.trim() === "") return;
    await insertComment();
    setComments([...comments, comment]);
    setComment("");
  };

  const insertComment = async () => {
    const { error } = await supabase
      .from('comments')
      .insert({ post_id: params.id, comment: comment });

    if (error) {
      console.error("Error inserting comment:", error);
    }
  };

  const formatTime = (time) => {
    let postedTime = (Date.now() - Date.parse(time)) / 1000;
    if (postedTime <= 60) return `${Math.floor(postedTime)} seconds`;
    if (postedTime <= 3600) return `${Math.floor(postedTime / 60)} minutes`;
    if (postedTime <= 86400) return `${Math.floor(postedTime / 3600)} hours`;
    if (postedTime <= 604800) return `${Math.floor(postedTime / 86400)} days`;
    return `${Math.floor(postedTime / 604800)} weeks`;
  };

  return (
    <div className="detail-page">
      {loading ? (
        <div className="loading">Loading...</div> // Display loading animation
      ) : (
        post && (
          <div className="detail-container">
            {referencedPost && (
              <div className="referenced-post">
                <h4>Referenced Post:</h4>
                <Link to={`/${referencedPost.id}`}>
                  <div className="title">{referencedPost.title}</div>
                </Link>
              </div>
            )}
            <div className="time">Posted {formatTime(post.created_at)} ago by {post.userId}</div>
            <div className="title">{post.title}</div>
            <div className="content">{post.content}</div>
            {post.imageUrl && <img className="post-img" src={post.imageUrl} alt="Post image" />}
            {post.videoUrl && <div className="video-url"><a href={post.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a></div>}
            {post.flags && <div className="flags">Flags: {post.flags}</div>}
            <div className="edit-section">
              <div className="upvote">
                <span onClick={increaseUpvote}><i className="bi bi-hand-thumbs-up"></i></span>
                <span>{post.upvotes} upvotes</span>
              </div>
              <div className="action">
                <span onClick={() => {
                  const key = prompt("Enter secret key to edit:");
                  if (key === post.secretKey) {
                    navigate(`/edit/${params.id}`);
                  } else {
                    alert("Invalid secret key.");
                  }
                }} className="edit"><i className="bi bi-pencil"></i></span>
                <span onClick={() => {
                  const key = prompt("Enter secret key to delete:");
                  setSecretKey(key);
                  deletePost();
                }} className="delete"><i className="bi bi-trash3"></i></span>
              </div>
            </div>

            <div className="comment-section">
              {comments.length > 0 && (
                <ul>
                  {comments.map((item, index) => (
                    <li key={index}>
                      {item.comment} by {item.userId}
                      <span onClick={() => deleteComment(index)} className="delete-comment">
                        <i className="bi bi-trash3"></i>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="send-comment">
                <input
                  name="comment"
                  type="text"
                  placeholder="Leave a comment..."
                  value={comment}
                  onChange={handleChange}
                />
                <button type="button" onClick={createComment}>Send</button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default DetailPage;
