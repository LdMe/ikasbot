import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CreateExercise from './pages/teacher/CreateExercise.jsx'
import loggedInContext from './context/loggedInContext';
import Exercise from './pages/student/Exercise.jsx'
import Login from './pages/Login.jsx'
import './App.css'
import router from './routes/Router.jsx'
import { RouterProvider } from 'react-router-dom'
import { refreshAuth } from './util/apiCalls.js'
import { set } from 'mongoose';

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
  const loggedInContextValue = {
    isLogged,
    login,
    logout,
    getUserName,
    getUserRole,
    getUser,
    getEmail,
    user
  }


  return (
    <loggedInContext.Provider value={loggedInContextValue}>
      <h1>Hola {user?.name}</h1>
      
      <RouterProvider router={router} />
    </loggedInContext.Provider>
  )
}

export default App
