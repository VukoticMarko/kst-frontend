import React from 'react';
import './header.css'

function HeaderWithoutLogo( {children} ){

  return (
    <div className="header-main-without">
      <div className="app-name">Knowledge Space Theory Platform</div>
      {children}
    </div>
  );
};

export default HeaderWithoutLogo;
