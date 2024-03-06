import { useLoaderData,Link } from "react-router-dom";
import SubjectComponent from "../../components/subject/SubjectComponent";
import SubjectStats from "../../components/stats/SubjectStats";
const Subject = () => {
    const {subject,user} = useLoaderData();
    return (
        <section>
            <Link to="/aula">Aula</Link>
        <SubjectStats id={0} subject={subject} students={[user.user]} />
        </section>
    );
}

export default Subject;