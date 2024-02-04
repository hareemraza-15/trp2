import React, { useState } from 'react';
import './PhotosetComponent.css'; // Create a CSS file for your component's styles

function PhotosetComponent() {
  const [cornersChecked, setCornersChecked] = useState(false);
  const [shadowsChecked, setShadowsChecked] = useState(false);
  const [bordersChecked, setBordersChecked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCornersChange = () => {
    setCornersChecked(!cornersChecked);
  };

  const handleShadowsChange = () => {
    setShadowsChecked(!shadowsChecked);
  };

  const handleBordersChange = () => {
    setBordersChecked(!bordersChecked);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div className={`ps-container ${hovered ? 'ps-photoset-hover' : ''}`}>
      <section className="ps-photoset" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <img className={`ps-photo ${hovered ? 'ps-photo-hover' : ''}`} src="https://assets.codepen.io/76888/01.jpg" alt="Photo 1" />
        <img className={`ps-photo ${hovered ? 'ps-photo-hover' : ''}`} src="https://assets.codepen.io/76888/02.jpg" alt="Photo 2" />
        <img className={`ps-photo ${hovered ? 'ps-photo-hover' : ''}`} src="https://assets.codepen.io/76888/05.jpg" alt="Photo 3" />
      </section>
      <footer className="ps-controls">
        <div className="block">
          <input
            type="checkbox"
            id="corners"
            name="corners"
            checked={cornersChecked}
            onChange={handleCornersChange}
          />
          <label className="option-label bg-dark" htmlFor="corners">
            Rounded corners
          </label>
        </div>
        <div className="block">
          <input
            type="checkbox"
            id="shadows"
            name="shadows"
            checked={shadowsChecked}
            onChange={handleShadowsChange}
          />
          <label className="option-label" htmlFor="shadows">
            Shadows
          </label>
        </div>
        <div className="block">
          <input
            type="checkbox"
            id="borders"
            name="borders"
            checked={bordersChecked}
            onChange={handleBordersChange}
          />
          <label className="option-label" htmlFor="borders">
            Borders
          </label>
        </div>
      </footer>
    </div>
  );
}

export default PhotosetComponent;
