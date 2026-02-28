import React from 'react';
import { Link } from 'react-router-dom';
import "./css/NotFound.css"; 



const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="glitch-wrapper">
        <h1 className="glitch" data-text="404">404</h1>
      </div>
      
      <div className="terminal-output">
        <p>{'>'} ERROR_CODE: 0x00000404</p>
        <p>{'>'} TARGET_COORDINATES_MISSING</p>
      </div>

      <Link to="/" className="cy-button">
        {'>'} INITIATE_RECOVERY_PROTOCOL (GO HOME)
      </Link>
    </div>
  );
};


export default NotFound;