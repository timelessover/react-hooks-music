import React from 'react'
import { Menu } from 'antd-mobile'
import style from './style/catMenu.module.scss'

interface CatMenuProps {
    height?: number,
    data?: any[],
    value?: any[],
    onChange?: any,
    closeMenu?: any,
    isOpen?: boolean,
}


const CatMenu = (userProps: CatMenuProps) => {
    const defaultProps = {
        height: document.documentElement.clientHeight * 0.45,
        data: [],
        value: [],
        onChange: () => { },
        closeMenu: () => { },
        isOpen: false,
    }

    const props = {
        ...defaultProps,
        ...userProps
    }

    const { height, data, value, onChange, closeMenu, isOpen } = props
    return (
        <div className={style.wrapper}>
            {
                isOpen ? <div>
                    <Menu
                        data={data}
                        value={value}
                        height={height}
                        onChange={onChange}
                    />
                    <div onClick={closeMenu} className={style.mask} />
                </div> : null
            }
        </div>
    )
}



export default CatMenu