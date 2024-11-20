import React from 'react';
import '../Femininomenon.css'; // Make sure to create and import the correct CSS file for your styles
import { useOutletContext } from 'react-router-dom';

const Femininomenon = () => {
  const [searchInput, setSearchInput, userId, theme, setTheme] = useOutletContext(); // Get theme state from context

  return (
    <div className={`banner ${theme}`}> {/* Apply theme class to root element */}
      <div className="slider" style={{ '--quantity': 10 }}>
        <div className="item" style={{ '--position': 1 }}><img src="src/femninimages/activist.jpg" alt="" /></div>
        <div className="item" style={{ '--position': 2 }}><img src="src/femninimages/babygurlintech.jpg" alt="" /></div>
        <div className="item" style={{ '--position': 3 }}><img src="src/femninimages/femininomenon.jpg" alt="" /></div>
        <div className="item" style={{ '--position': 4 }}><img src="src/femninimages/divine ascension.jpg" alt="" /></div>
        <div className="item" style={{ '--position': 5 }}><img src="src/femninimages/helpwomen.jpg" alt="" /></div>
        <div className="item" style={{ '--position': 6 }}><img src="src/femninimages/Fight for whats right! ✊.jpg" alt="" /></div>
        <div className="item" style={{ '--position': 7 }}><img src="src/femninimages/MULHERES.jpg" alt="" /></div>
        <div className="item" style={{ '--position': 8 }}><img src="src/femninimages/steminist.jpg" alt="" /></div>
        <div className="item" style={{ '--position': 9 }}><img src="src/femninimages/This Is a Love Letter for Any Uterus That Bleeds.jpg" alt="" /></div>
        <div className="item" style={{ '--position': 10 }}><img src="src/femninimages/neveradress.jpg" alt="" /></div>
      </div>
      <div className="content">
        <h1 data-content="Femininomenon">Femininomenon</h1>
        <div className="author">
          <h2>WOMEN IN STEM</h2>
          <p><b>YOUR ALL IN 1 PLATFORM</b></p>
          <p>Create, Collaborate</p>
          <p>........................Empower</p>
        </div>
        <div className="model"></div>
      </div>
    </div>
  );
};

export default Femininomenon;
