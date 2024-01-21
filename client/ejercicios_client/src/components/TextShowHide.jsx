import {useState} from 'react';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

const TextShowHide = ({title,children})=>{
    const [show,setShow] = useState(false);
    const toggleShow = ()=>{
        setShow(!show);
    }
    return (
        <div className="text-show-hide">
            <section className="text-show-hide-title" onClick={toggleShow}>
                {title}
                {show ? <FaAngleUp onClick={toggleShow}/> : <FaAngleDown onClick={toggleShow}/>}
            </section>
            
            {show && <div className="text-show-hide-content">{children}</div>}
        </div>
    )
}

export default TextShowHide;