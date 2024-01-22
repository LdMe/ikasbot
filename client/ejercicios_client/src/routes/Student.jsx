import Profile from "../pages/student/Profile";
import Course from "../pages/student/Course";
import Subject from "../pages/student/Subject";
import Exercise from "../pages/student/Exercise";
import Root from "../pages/student/Root";
import {  getExercise, getSubject } from "../util/apiCalls";
import {getCourse} from "../util/api/course";
import { getUserData } from "../util/api/user";


const router = 
    {
        path: "/aula",
        element: <Root/>,
        loader: getUserData,
        children: [
            {
                path: "",
                element: <Profile/>,
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
        ]
    }

export default router;