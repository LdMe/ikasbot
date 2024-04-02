import { updateUser } from "../../util/api/user"
import TextShowHide from "../TextShowHide";
const PasswordChange = ({user,isAdmin=false}) => {
    // componente que permite cambiar la contraseña del usuario, si es admin solo pide la contraseña nueva, si no pide la antigua y la nueva

    const handleUpdatePassword = async (event) => {
        event.preventDefault();
        const oldPassword = event.target.oldPassword?.value || null;
        const newPassword = event.target.newPassword.value;
        if(!newPassword){
            alert("la contraseña nueva es obligatoria");
            return;
        }
        const data ={
            password:newPassword
        }

        if(oldPassword){
            data.oldPassword = oldPassword;
        }
        const response = await updateUser(user._id,data)
        if(response.error){
            alert(response.error);

            event.target.reset();
            return;
        }
        alert("contraseña actualizada!");
        event.target.reset();
    }
    return (
        <div>
            <TextShowHide title={isAdmin ? <h2>Cambiar contraseña de {user.name}</h2> : <h2>Cambiar contraseña</h2>} >
            
            <form onSubmit={handleUpdatePassword}>

                {!isAdmin &&<label htmlFor="oldPassword">Contraseña antigua</label> }
                {!isAdmin && <input type="password" name="oldPassword" id="oldPassword" />}

                <label htmlFor="newPassword">Contraseña nueva</label>
                <input type="password" name="newPassword" id="newPassword" />
                <button type="submit" >Actualizar</button>
            </form>

            </TextShowHide>
            
        </div>
    )
}

export default PasswordChange

