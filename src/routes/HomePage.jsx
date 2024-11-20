import { useEffect, useState } from "react";
import Post from "../components/Post";
import { supabase } from '../client';
import { useOutletContext } from "react-router-dom";

const HomePage = () => {
  const [searchInput, setSearchInput, userId, theme, setTheme] = useOutletContext(); // Get theme state from context
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [filterByFlag, setFilterByFlag] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setSearchInput("");
    fetchPosts().catch(console.error);
  }, []);

  useEffect(() => {
    searchPosts();
  }, [searchInput]);

  useEffect(() => {
    filterPostsByFlag();
  }, [filterByFlag]);

  const fetchPosts = async () => {
    setLoading(true); // Set loading to true when fetching starts
    const {data} = await supabase
      .from('posts')
      .select()
      .order('created_at', { ascending: false });

    setPosts(data);
    setFilteredPosts(data);
    setSortBy('date');
    setLoading(false); // Set loading to false when fetching ends
  };

  const searchPosts = () => {
    if (searchInput !== "") {
      const filteredResults = posts.filter((item) =>
        item.title.toLowerCase().includes(searchInput.toLowerCase())
      );

      setFilteredPosts(filteredResults);
    } else {
      if (posts && posts.length > 0) {
        setFilteredPosts(posts);
      }
    }
  };

  const filterPostsByFlag = () => {
    if (filterByFlag !== '') {
      const filteredResults = posts.filter((item) =>
        item.flags && item.flags.includes(filterByFlag)
      );
      setFilteredPosts(filteredResults);
    } else {
      setFilteredPosts(posts);
    }
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
    <div className={`home-page ${theme}`}>
      <div className="sort-container">
        Order by:
        <span onClick={sortPostsByDate} className={sortBy == 'date' ? 'selected' : ''}>Newest</span>
        <span onClick={sortPostsByVote} className={sortBy == 'vote' ? 'selected' : ''}>Most Popular</span>
      </div>
      <div className="filter-container">
        Filter by flag:
        <select onChange={(e) => setFilterByFlag(e.target.value)} value={filterByFlag}>
          <option value="">All</option>
          <option value="flag1">Flag 1</option>
          <option value="flag2">Flag 2</option>
          {/* Add more options as needed */}
        </select>
      </div>
      {loading ? (
        <div className="loading">Loading...</div> // Display loading animation
      ) : (
        filteredPosts && filteredPosts.length > 0 ?
          <div>
            {filteredPosts.map((item) => (
              <Post
                key={item.id}
                id={item.id}
                time={formatTime(item.created_at)}
                title={item.title}
                upvotes={item.upvotes}
              />
            ))}
          </div> :
          <div>There is no post.</div>
      )}
    </div>
  );
};

export default HomePage;