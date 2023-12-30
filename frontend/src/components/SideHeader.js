import React, { useContext } from 'react';
import { Nav } from 'rsuite';
import { Link } from 'react-router-dom';
import HomeIcon from '@rsuite/icons/legacy/Home';
import MemberIcon from '@rsuite/icons/Member';
import SearchIcon from '@rsuite/icons/Search';
import ExitIcon from '@rsuite/icons/Exit';
import UserPlusIcon from '@rsuite/icons/legacy/UserPlus';
import SignInIcon from '@rsuite/icons/legacy/SignIn';
import MessageIcon from '@rsuite/icons/Message';
import AuthContext from '../context/AuthContex';


const SideHeader = () => {
  let { user, logoutUser } = useContext(AuthContext);

  return (
    <Nav vertical style={{ display: 'flex', flexDirection: 'column' }} className="side-header">
      <h1>Blog</h1>

      <Nav.Item as={Link} to="/">
        <HomeIcon /> Home
      </Nav.Item>

      <Nav.Item as={Link} to="/search">
        <SearchIcon /> Search
      </Nav.Item>

      <Nav.Item as={Link} to="/chat">
        <MessageIcon /> Chat
      </Nav.Item>

      <Nav.Item as={Link} to={(user ? `/profile/${user.username}` : `/login`)} state={(user ? { user: user.username } : { user: null })}>
        <MemberIcon /> Profile
      </Nav.Item>

      {!user ? (
        <>
          <Nav.Item as={Link} to="/register">
            <UserPlusIcon /> Register
          </Nav.Item>
          <Nav.Item as={Link} to="/login">
            <SignInIcon /> Login
          </Nav.Item>
        </>
      ) : (
        <Nav.Item onClick={logoutUser}>
          <ExitIcon /> Logout
        </Nav.Item>
      )}
    </Nav>
  );
};

export default SideHeader;
