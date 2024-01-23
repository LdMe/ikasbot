import { useLoaderData } from "react-router-dom";
import SubjectComponent from "../../components/subject/SubjectComponent";
const Subject = () => {
    const subject = useLoaderData();

    return (
        <SubjectComponent subject={subject} />
    );
}

export default Subject;