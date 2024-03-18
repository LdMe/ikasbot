import {useRef,useEffect,useState} from 'react';
import './HealthBar.css';
const MEDIUM_HP = 50;
const LOW_HP = 34;
const HealthBar = ({maxHp=100,hp=0,showHp=true})=>{
    const currentWidthRef = useRef((hp/maxHp)*100 || 0);
    const prevWidthRef = useRef((hp/maxHp)*100 || 0);
    const [isAnimated,setIsAnimated] = useState(true);
    const [prevWidth,setPrevWidth] = useState(prevWidthRef.current);
    const [currentWidth,setCurrentWidth] = useState(currentWidthRef.current);
    useEffect(()=>{
        prevWidthRef.current = currentWidthRef.current;
        currentWidthRef.current = (hp/maxHp)*100;
        setIsAnimated(false);
        const timeout = setTimeout(()=>{
            setIsAnimated(true);
        },100);
        return ()=>{
            clearTimeout(timeout);
        }
    },[hp])
    useEffect(()=>{
        setPrevWidth(prevWidthRef.current);
    },[prevWidthRef.current]);
    useEffect(()=>{
        setCurrentWidth(currentWidthRef.current);
    },[currentWidthRef.current]);
    const width = prevWidth;
    const green ="#31e054";
    const yellow ="#d2e031";
    const red ="#e03a31";
    const toColor = currentWidth > MEDIUM_HP ? green : currentWidth > LOW_HP ? yellow : red
    const style = {width: prevWidth+"%", "--to-width":currentWidth+"%", "--from-width":prevWidth+"%","--to-color":toColor}
    const speed = prevWidth - currentWidth;
    const duration = Math.min(Math.abs(speed/10),0.5);
    style["--duration"] = duration+"s";
    const isAnimatedClass = isAnimated ? " animated" : "";
    
    return (
        <div className="health-bar">
            <div className={"health-bar-fill " + isAnimatedClass } style={style}/>
            {showHp && <div className="health-bar-text">{hp}/{maxHp}</div>}
        </div>
    )
}

export default HealthBar;