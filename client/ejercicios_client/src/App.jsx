import { useState, useEffect } from 'react'
import loggedInContext from './context/loggedInContext';
import './App.css'
import router from './routes/Router.jsx'
import { RouterProvider } from 'react-router-dom'
import { refreshAuth } from './util/api/auth'

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    refreshAuth().then((data) => {
      if (!data.error) {
        setIsLogged(true);
        setUser(data.user);
      }
    })
  }, [])

  const login = (user) => {
    setIsLogged(true);
    setUser(user);
  }
  const logout = () => {
    setIsLogged(false);
    setUser(null)
  }
  const getUserName = () => {
    return user?.name;
  }
  const getEmail = () => {
    return user?.email;
  }
  const getUserRole = () => {
      return user?.role;
  }
  const getUser = () => {
    return user;
  }
  const getBasePath = () => {
    return getUserRole() === "student" ? "/aula" : "/profesorado";
  }

  const loggedInContextValue = {
    isLogged,
    login,
    logout,
    getUserName,
    getUserRole,
    getUser,
    getEmail,
    user,
    getBasePath
  }


  return (
    <loggedInContext.Provider value={loggedInContextValue}>
      <h1>Hola {user?.name}</h1>
      
      <RouterProvider router={router} />
    </loggedInContext.Provider>
  )
}

export default App
