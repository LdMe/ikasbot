import { resaveAttempts } from "../util/api/attempt";


export default function Resave() {
    resaveAttempts();
    return (
        <div>
            <h1>Resave</h1>
        </div>
    )
}