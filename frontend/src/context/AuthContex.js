import { createContext, useState, useEffect, useCallback } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'


const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)

    const navigate = useNavigate()

    let loginUser = async (e) => {
        e.preventDefault()
        let response = await fetch('/api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        let data = await response.json()
        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/')
        }else{
            alert('Something went wrong!')
        }
    }


    const logoutUser = useCallback(() => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
      }, [setAuthTokens, setUser, navigate]);


    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }


    useEffect(() => {

        const updateToken = async () => {
            try {
                let response = await fetch('/api/token/refresh/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 'refresh': authTokens.refresh })
                });
                let data = await response.json();

                if (response.ok) {
                    setAuthTokens(data);
                    setUser(jwtDecode(data.access));
                    localStorage.setItem('authTokens', JSON.stringify(data));
                    return true
                } else {
                    return false
                }
            } catch (err) {
                return false
            }
        }

        const refresher = 1000 * 60 * 14
        const interval = setInterval(() => {
            if (authTokens) {
                console.log('updating tokens...')
                if (!updateToken()) {
                    logoutUser()
                }
            }
        }, refresher)

        return () => clearInterval(interval)
    }, [authTokens, logoutUser]);

    return(
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}