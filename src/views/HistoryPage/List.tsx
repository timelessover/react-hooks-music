import React from 'react'
import Scroll from '../../components/Scroll'
import style from './style/list.module.scss'
import { inject, observer } from 'mobx-react'

const List = (props: any) => {
    const { list } = props
    const { currentSong } = props.appStore
    const onSelectSong = (index) => {
        props.appStore.onSelectSong({
            songlist: props.list,
            index
        })
    }
    const remove = (index, item, e) => {
        e.stopPropagation()
        props.remove(index, item)
    }
    return (
        <Scroll>
            <ul className={style.list}>
                {
                    list && list.map((item, index) => <li key={item.id} className={item.id === currentSong.id ? style.active : ''} onClick={() => onSelectSong(index)}>
                        <div>
                            <h3>{item.name}</h3>
                            <p>{item.ar.map(i => i.name).join('/')}</p>
                        </div>
                        <div onClick={(e) => remove(index, item, e)}>
                            <span className={style.icon}>×</span>
                        </div>
                    </li>)
                }
            </ul>
        </Scroll>
    )
}




export default inject('appStore')(observer(List))
