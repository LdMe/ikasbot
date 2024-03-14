import { useLoaderData,Link } from "react-router-dom";
import SubjectComponent from "../../components/subject/SubjectComponent";
import SubjectStats from "../../components/stats/SubjectStats";
const Subject = () => {
    const {subject,user} = useLoaderData();
    console.log("subject",subject)
    return (
        <section>
            Curso:  
            <Link to={ `/aula/cursos/${subject.course._id}`}>{subject.course.name}</Link>

        <SubjectStats id={0} subject={subject} students={[user.user]} />
        </section>
    );
}

export default Subject;