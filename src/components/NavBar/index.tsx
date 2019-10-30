import React from 'react'
import style from './style/index.module.scss'
import { useHistory } from 'react-router-dom'

interface NavBarProps {
    children?: React.ReactNode
}

const NavBar = (props: any) => {
    const history = useHistory();
    const goBack = () => {
        history.goBack()
    }
    return (
        <div className={style.navbar}>
            <div className={`iconfont icon-zuojiantou ${style.iconfont}`} onClick={goBack} />
            <div className={style.title}>{props.children.name}</div>
        </div>
    )
}



export default NavBar