import Profile from "../pages/student/Profile";
import Course from "../pages/student/Course";
import Subject from "../pages/student/Subject";
import Exercise from "../pages/student/Exercise";
import Root from "../pages/student/Root";
import { getExercise } from "../util/api/exercise";
import { getSubject } from "../util/api/subject";
import { getCourse } from "../util/api/course";
import { getUserData } from "../util/api/user";


const router =
{
    path: "/aula",
    element: <Root />,
    loader: getUserData,
    children: [
        {
            path: "",
            element: <Profile />,
            loader: getUserData,
        },
        {
            path: "cursos/:id",
            element: <Course />,
            loader: async({ params }) => {
                return { course: await getCourse(params.id), user:  await getUserData()}
            }
        },
        {
            path: "temas/:id",
            element: <Subject />,
            loader: async({ params }) => {
                return { subject: await getSubject(params.id), user:  await getUserData()}
            }
        },
        {
            path: "ejercicios/:id",
            element: <Exercise />,
            loader: async({ params }) => {
                return { exercise: await getExercise(params.id), user:  await getUserData() }
            }
        },
    ]
}

export default router;