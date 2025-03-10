import { useLoaderData,Link } from "react-router-dom";
import SubjectComponent from "../../components/subject/SubjectComponent";
import SubjectStats from "../../components/stats/SubjectStats";
import { useContext } from "react";
import loggedInContext from "../../context/loggedInContext";
const Subject = () => {
    const {subject,user} = useLoaderData();
    const {getBasePath} = useContext(loggedInContext)
    return (
        <section>
            <div className="breadcrumb">
                <Link to={`${getBasePath()}`}>Aula</Link>
                <span>/</span>
                <Link to={`${getBasePath()}/cursos/${subject.course._id}`}>{subject.course.name}</Link>
                <span>/</span>
                <Link to={`${getBasePath()}/temas/${subject._id}`}>{subject.name}</Link>
            </div>
        <SubjectStats id={0} subject={subject} students={[user.user]} />
        </section>
    );
}

export default Subject;