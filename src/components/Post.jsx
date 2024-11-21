import { Link } from "react-router-dom";

const Post = ({id, time, title, upvotes}) => {
  return (
    <Link to={`/${id}`}>
      <div className="post-container">
        <div className="time">Posted {time} ago</div>
        <div className="title">{title}</div>
        <div className="upvote">{upvotes} upvotes</div>
      </div>
    </Link>
  );
};

export default Post;
