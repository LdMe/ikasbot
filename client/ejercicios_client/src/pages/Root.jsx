import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"

const Root = () => {
    return (
        <div>
            <NavBar />
            <section className="outlet-container">
                <Outlet />
            </section>
        </div>
    )
}

export default Root