import React from 'react';
import './css/LoadingScreen.css'; 

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="frequency-wave">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <h2 className="loading-text">SYSTEM INITIALIZING...</h2>
    </div>
  );
};

export default LoadingScreen;