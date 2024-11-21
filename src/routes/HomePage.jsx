import { useEffect, useState } from "react";
import Post from "../components/Post";
import { supabase } from '../client';
import { useOutletContext } from "react-router-dom";

const HomePage = () => {
  const [searchInput, setSearchInput] = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchInput("");
    fetchPosts().catch(console.error);
  }, []);

  useEffect(() => {
    searchPosts();
  }, [searchInput]);

  const fetchPosts = async () => {
    setLoading(true);
    const {data} = await supabase
      .from('posts')
      .select()
      .order('created_at', { ascending: false });

    setPosts(data);
    setFilteredPosts(data);
    setSortBy('date');
    setLoading(false);
  };

  const searchPosts = () => {
    let filteredResults = posts;

    if (searchInput !== "") {
      filteredResults = filteredResults.filter((item) =>
        item.title.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    setFilteredPosts(filteredResults);
  };

  const sortPostsByDate = () => {
    let temp = filteredPosts.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    setPosts(temp);
    setSortBy('date');
  };

  const sortPostsByVote = () => {
    let temp = filteredPosts.sort((a, b) => parseInt(b.upvotes) - parseInt(a.upvotes));
    setPosts(temp);
    setSortBy('vote');
  };

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
    <div className="home-page">
      <div className="sort-container">
        Order by:
        <span onClick={sortPostsByDate} className={sortBy == 'date' ? 'selected' : ''}>Newest</span>
        <span onClick={sortPostsByVote} className={sortBy == 'vote' ? 'selected' : ''}>Most Popular</span>
      </div>
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading...
        </div>
      ) : (
        filteredPosts && filteredPosts.length > 0 ? (
          <div>
            {filteredPosts.map((item) => (
              <Post
                key={item.id}
                id={item.id}
                time={formatTime(item.created_at)}
                title={item.title}
                upvotes={item.upvotes}
                updatedTime={formatTime(item.updated_at)} // Add updated time
              />
            ))}
          </div>
        ) : (
          <div>There is no post.</div>
        )
      )}
    </div>
  );
};

export default HomePage;