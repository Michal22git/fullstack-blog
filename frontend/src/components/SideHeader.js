import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContex'

const SideHeader = () => {
  let {user, logoutUser} = useContext(AuthContext)

  return (
    <div>
        <Link to='/'>Home</Link>
        <span> | </span>
        {user ? (
          <p onClick={logoutUser}>Logout</p>
        ): (
          <Link to='/login'>Login</Link>
        )}
        
        <span> | </span>
        <Link to='/register'>Register</Link>

        {user && <p>Hello {user.username}</p>}

    </div>
  )
}

export default SideHeader