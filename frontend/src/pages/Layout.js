import React from 'react';
import SideHeader from '../components/SideHeader';

const Layout = ({ children }) => {
  return (
    <div>
        <div className='side-nav'>
            <SideHeader />
        </div>
        <div className='main-content'>
            {children}
        </div>
    </div>    
  );
};

export default Layout;
