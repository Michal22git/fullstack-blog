import React, {useContext} from 'react'
import AuthContext from '../../context/AuthContex'

const Login = () => {

  let {loginUser} = useContext(AuthContext)

  return (
    <div className="login-form">
        <h2>Login to your account</h2>
        <form onSubmit={loginUser}>
            <div>
                <input type="text" name="username" placeholder="username" required />
            </div>
            <div>
                <input type="password" name="password" placeholder="password" required />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default Login