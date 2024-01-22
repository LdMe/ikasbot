// router de react router dom

// Path: client/ejercicios_client/src/components/Router.jsx

import { createBrowserRouter } from "react-router-dom";

import CreateExercise from "../pages/teacher/CreateExercise";
import StudentExercise from "../pages/student/Exercise";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Root from "../pages/Root";
import TeacherCourses from "../pages/teacher/Courses";
import TeacherCourse from "../pages/teacher/Course";
import TeacherSubject from "../pages/teacher/Subject";
import TeacherExercise from "../pages/teacher/Exercise";
import StudentCourse from "../pages/student/Course";
import StudentSubject from "../pages/student/Subject";
import StudentProfile from "../pages/student/Profile";
import Users from "../pages/admin/Users";
import StudentRoot from "../pages/student/Root";
import TeacherRoot from "../pages/teacher/Root";


import { getExercises,getExercise,getSubject } from "../util/apiCalls";
import {getUserData,getAllUsers} from "../util/api/user";
import {getCourses,getCourse} from "../util/api/course";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <NotFound/>,
        children:[
            {
                path: "notfound",
                element: <NotFound/>,
            },
            {
                path: "login",
                element: <Login/>,
            },
            {
                path: "/aula",
                element: <StudentRoot/>,
                loader: getUserData,
                children: [
                    {
                        path: "",
                        element: <StudentProfile/>,
                    },
                    {
                        path: "cursos/:id",
                        element: <StudentCourse/>,
                        loader: ({params}) => getCourse(params.id),
                    },
                    {
                        path: "temas/:id",
                        element: <StudentSubject/>,
                        loader: ({params}) => getSubject(params.id),
                    },
                    {
                        path: "ejercicios/:id",
                        element: <StudentExercise/>,
                        loader: ({params}) => getExercise(params.id),
                    },
                ]
            },
            {
                path: "profesorado",
                element: <TeacherRoot/>,
                children: [
                    {
                        path: "",
                        element: <h2>Area profesorado</h2>,
                    },
                    {
                        path: "cursos",
                        element: <TeacherCourses/>,
                        loader: getCourses,
                    },
                    {
                        path: "cursos/:id",
                        element: <TeacherCourse/>,
                        loader: ({params}) => getCourse(params.id),
                    },
                    {
                        path: "temas/:id",
                        element: <TeacherSubject/>,
                        loader: ({params}) => getSubject(params.id),
                    },
                    {
                        path: "ejercicios/:id",
                        element: <TeacherExercise/>,
                        loader: ({params}) => getExercise(params.id),
                    },
                    {
                        path: "ejercicios/nuevo",
                        element: <CreateExercise/>,
                    },
                    {
                        path: "usuarios",
                        element: <Users/>,
                        loader: () => getAllUsers(),
                    }
                ]
            },
            {
                path: "admin",
                element: <h2>Area admin</h2>,
            },
            
            /* {
                path: "temas/:subjectId/ejercicios/nuevo",
                element: <CreateExercise/>,
            },
            {
                path: "temas/:subjectId/ejercicios/:id",
                element: <Exercise/>,
                loader: ({params}) => getExercise(params.id),
            },
            {
                path: "usuarios",
                element: <Users/>,
                loader: () => getAllUsers(),
            } */
            
        ]
    },
    
]);

export default router;

