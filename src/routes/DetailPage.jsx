import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../client';

const DetailPage = () => {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    fetchPost().catch(console.error);
    fetchComments().catch(console.error);
  }, []);

  const navigate = useNavigate();

  const fetchPost = async () => {
    setLoading(true);
    const {data} = await supabase
      .from('posts')
      .select()
      .eq('id', params.id);

    setPost(data[0]);
    setLoading(false);
  };

  const fetchComments = async () => {
    setLoading(true);
    const {data} = await supabase
      .from('comments')
      .select()
      .eq('post_id', params.id)
      .order('created_at', { ascending: true });

    setComments(data.map(item => item.comment));
    setLoading(false);
  };

  const increaseUpvote = () => {
    setPost({
      ...post,
      upvotes: post.upvotes + 1
    });
    updateUpvotes().catch(console.error);
  };

  const updateUpvotes = async () => {
    const {error} = await supabase
      .from('posts')
      .update({ upvotes: parseInt(post.upvotes + 1) })
      .eq('id', params.id);
  };

  const deletePost = async () => {
    await supabase
      .from('comments')
      .delete()
      .eq('post_id', params.id);

    await supabase
      .from('posts')
      .delete()
      .eq('id', params.id);

    alert("Post and its comments are deleted successfully!");
    navigate(`/`, {replace: true});
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const createComment = () => {
    insertComment().catch(console.error);
    setComments([
      ...comments,
      comment
    ]);
    setComment("");
  };

  const insertComment = async () => {
    const {error} = await supabase
      .from('comments')
      .insert({ post_id: params.id, comment: comment});
  }

  const formatTime = (time) => {
    let postedTime = (Date.now() - Date.parse(time))/1000;

    if (postedTime <= 60)
      return `${Math.floor(postedTime)} seconds`;
    if (postedTime <= 60*60)
      return `${Math.floor(postedTime/60)} minutes`;
    if (postedTime <= 60*60*24)
      return `${Math.floor(postedTime/(60*60))} hours`;
    if (postedTime <= 60*60*24*7)
      return `${Math.floor(postedTime/(60*60*24))} days`;
    if (postedTime <= 60*60*24*30)
      return `${Math.floor(postedTime/(60*60*24*7))} weeks`;
    if (postedTime <= 60*60*24*7*52)
      return `${Math.floor(postedTime/(60*60*24*30))} months`;
    if (postedTime > 60*60*24*7*52)
      return `${Math.floor(postedTime/(60*60*24*7*52))} years`;
  };

  return (
    <div className="detail-page">
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading...
        </div>
      ) : (
        post && (
          <div className="detail-container">
            <div className="time">Posted {formatTime(post.created_at)} ago</div>
            <div className="title">{post.title}</div>
            <div className="content">{post.content}</div>
            <div>
              {post.imageUrl && post.imageUrl !== "" ? 
                <img className="post-img" src={post.imageUrl} alt="image" /> :
                <div></div>
              }
            </div>
            <div className="edit-section">
              <div className="upvote">
                <span onClick={increaseUpvote}><i className="bi bi-hand-thumbs-up"></i></span>
                <span>{post.upvotes} upvotes</span>
              </div>
              <div className="action">
                <Link to={`/edit/${params.id}`}><span className="edit"><i className="bi bi-pencil"></i></span></Link>
                <span onClick={deletePost} className="delete"><i className="bi bi-trash3"></i></span>
              </div>
            </div>

            <div className="comment-section">
              <div>{comments && comments.length > 0 && 
                (<ul>
                  {comments.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>)}
              </div>
              <div className="send-comment">
                <input name="comment" type="text" placeholder="Leave a comment..." value={comment} onChange={handleChange} />
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