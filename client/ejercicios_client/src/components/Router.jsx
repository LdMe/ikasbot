// router de react router dom

// Path: client/ejercicios_client/src/components/Router.jsx

import { createBrowserRouter } from "react-router-dom";

import CreateExercise from "./CreateExercise";
import Exercise from "./Exercise";
import Exercises from "../pages/Exercises";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Root from "../pages/Root";
import Courses from "../pages/Courses";
import Course from "../pages/Course";
import Subject from "../pages/Subject";
import Profile from "../pages/Profile";


import { getExercises,getExercise,getCourses,getCourse,getSubject,getUserData } from "../util/apiCalls";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <NotFound/>,
        children:[
            {
                path: "/exercises",
                element: <Exercises/>,
                loader: () => getExercises(),
            },
            {
                path: "/notfound",
                element: <NotFound/>,
            },
            {
                path: "/login",
                element: <Login/>,
            },
            {
                path: "/profile/:id",
                element: <Profile/>,
                loader: ({params}) => getUserData(params.id),
            },
            {
                path: "/cursos",
                element: <Courses/>,
                loader: () => getCourses(),

            },
            {
                path: "/cursos/:id",
                element: <Course/>,
                loader: ({params}) => getCourse(params.id),
            },
            {
                path: "/temas/:id",
                element: <Subject/>,
                loader: ({params}) => getSubject(params.id),
            },

            {
                path: "/temas/:subjectId/exercises/:id",
                element: <Exercise/>,
                loader: ({params}) => getExercise(params.id),
            },
            {
                path: "/temas/:subjectId/exercises/new",
                element: <CreateExercise/>,
            },
            
        ]
    },
    
]);

export default router;

