import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import CourseStats from "../../components/stats/CourseStats";
import loggedInContext from "../../context/loggedInContext";
const Course = () => {
    //const course=useLoaderData();
    const {course,user} = useLoaderData();
    const {getBasePath} = useContext(loggedInContext)
    if (!course) return (<div>cargando...</div>)
    return (
        <div>
            <h1>Curso {course.name}</h1>
            <CourseStats course={course} students={[user.user]} />
        </div>
    );
}

export default Course;