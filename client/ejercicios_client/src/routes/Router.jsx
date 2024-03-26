// router de react router dom

// Path: client/ejercicios_client/src/components/Router.jsx

import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/login/Login";
import NotFound from "../pages/NotFound";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Resave from "../pages/Resave";
import StudentRouter from "./Student";
import TeacherRouter from "./Teacher";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <NotFound/>,
        children:[
            {
                path: "",
                element: <Home/>,
            },
            {
                path: "notfound",
                element: <NotFound/>,
            },
            {
                path: "login",
                element: <Login/>,
            },
            StudentRouter,
            TeacherRouter,
            {
                path: "admin",
                element: <h2>Area admin</h2>,
            },
            
        ]
    },
    
]);

export default router;

