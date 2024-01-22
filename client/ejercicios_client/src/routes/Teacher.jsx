import Root from "../pages/teacher/Root";
import Courses from "../pages/teacher/Courses";
import Course from "../pages/teacher/Course";
import Subject from "../pages/teacher/Subject";
import Exercise from "../pages/teacher/Exercise";
import CreateExercise from "../pages/teacher/CreateExercise";
import Users from "../pages/teacher/Users";
import User from "../pages/teacher/User";
import {  getExercise} from "../util/apiCalls";
import { getSubject } from "../util/api/subject";
import { getAllUsers,getUserData } from "../util/api/user";
import {getCourses,getCourse} from "../util/api/course";

const router ={
    path: "profesorado",
    element: <Root/>,
    children: [
        {
            path: "",
            element: <h2>Area profesorado</h2>,
        },
        {
            path: "cursos",
            element: <Courses/>,
            loader: getCourses,
        },
        {
            path: "cursos/:id",
            element: <Course/>,
            loader: ({params}) => getCourse(params.id),
        },
        {
            path: "temas/:id",
            element: <Subject/>,
            loader: ({params}) => getSubject(params.id),
        },
        {
            path: "ejercicios/:id",
            element: <Exercise/>,
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
        },
        {
            path: "usuarios/:id",
            element: <User/>,
            loader: ({params}) => getUserData(params.id),
        }
    ]
};

export default router;