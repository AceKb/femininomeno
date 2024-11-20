import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const SettingsPage = () => {
  const [searchInput, setSearchInput, userId, theme, setTheme] = useOutletContext(); // Get theme state from context

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <form className="form-container">
        <label htmlFor="theme">Theme:</label>
        <select name="theme" id="theme" value={theme} onChange={handleThemeChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </form>
    </div>
  );
};

export default SettingsPage;