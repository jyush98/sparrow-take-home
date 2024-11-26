import React from 'react';
import headerImage from '../../assets/pizza.png'; 
import './HeaderImage.css'; 

const HeaderImage: React.FC = () => {
    return (
        <div className="header-image-container">
            <img src={headerImage} alt="Header" className="header-image" />
        </div>
    );
};

export default HeaderImage;