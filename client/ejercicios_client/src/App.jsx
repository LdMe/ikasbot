import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CreateExercise from './components/CreateExercise'
import loggedInContext from './context/loggedInContext';
import Exercise from './components/Exercise'
import Login from './pages/Login.jsx'
import './App.css'
import router from './components/Router.jsx'
import { RouterProvider } from 'react-router-dom'
import { refreshAuth } from './util/apiCalls.js'
import { set } from 'mongoose';

function App() {
  const [exercises, setExercises] = useState([]);
  const [result, setResult] = useState('');
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
  useEffect(() => {
    fetch('http://localhost:3001/exercises', {
      method: 'GET',
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data)
        if (!data.error) {
          setExercises(data)
        }
      })
  }, [isLogged]);
  const login = (user) => {
    setIsLogged(true);
    setUser(user);
    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);
  }
  const logout = () => {
    setIsLogged(false);
    setUser(null)
  }
  const getUserName = () => {
    return user?.username;
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
    getUser
  }


  return (
    <loggedInContext.Provider value={loggedInContextValue}>
      <h1>Hola {user?.username}</h1>
      {/* <Login />
      <CreateExercise
        onCreate={(data) => setExercises([...exercises, data])}
       />
      {exercises && exercises.map((exercise) => (

        <Exercise
          exercise={exercise}
          onDelete={deleteExercise}
          onSubmit={handleSubmit}
          key={exercise._id}
          onUpdate={updateExercise}
        />
      ))}
      {result && (
        <section className={"result-section " + (result.success ? "correct" : "incorrect")}>
          <h1>Result</h1>

          <code dangerouslySetInnerHTML={{ __html: replaceNewLineForBr(result.message) }}></code>

        </section>
      )} */}
      <RouterProvider router={router} />
    </loggedInContext.Provider>
  )
}

export default App
