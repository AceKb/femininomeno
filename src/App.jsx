import { Link, Outlet } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons

const App = () => {
  const [searchInput, setSearchInput] = useState("");
  const [theme, setTheme] = useState('light'); // Add theme state

  useEffect(() => {
    document.body.className = theme; // Apply the theme to the body element
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app ${theme}`}> {/* Apply theme class to root element */}
      <div className="navbar">
      <Link to="/femininomenon">
          <h3>femininomenon</h3>
        </Link>
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <nav>
          <Link to="/">Home</Link>
          <Link to="/create">Create New Post</Link>
        </nav>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <FaMoon className="theme-icon" /> : <FaSun className="theme-icon" />}
        </button>
      </div>
      <div className="outlet-container">
        <Outlet context={[searchInput, setSearchInput, theme, setTheme]} /> {/* Pass theme state through context */}
      </div>
    </div>
  );
};

export default App;