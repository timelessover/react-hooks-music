import React, { Suspense, lazy } from 'react'
import style from './style/index.module.scss'
import { inject, observer } from 'mobx-react'
import { NavLink, Route, Switch, Redirect } from 'react-router-dom'
// import Loading from '../../components/Loading/index'
// import Player from '../Player'

const MyPage = lazy(() => import('../../views/MyPage/index'));
const FindPage = lazy(() => import('../../views/FindPage/index'));
const ToplistPage = lazy(() => import('../../views/ToplistPage/index'));
const SearchPage = lazy(() => import('../../views/SearchPage/index'));
const SheetPage = lazy(() => import('../../views/SheetPage/index'));
const SingerPage = lazy(() => import('../../views/SingerPage/index'));
const AlbumPage = lazy(() => import('../../views/AlbumPage/index'));
const PlayListsPage = lazy(() => import('../../views/PlayListsPage/index'));
const MVPage = lazy(() => import('../../views/MVPage/index'));
const HistoryPage = lazy(() => import('../../views/HistoryPage/index'));
const ArtistsPage = lazy(() => import('../../views/ArtistsPage/index'));

interface MainProps {
    appStore?: any
    staticContext?: any
}



const Main = (props: MainProps) => {
    
    const { isExpandSider, playlist = [],toggleExpand } = props.appStore

    return (
        <div className={style.container} style={{ transform: `translateX(${isExpandSider ? '80%' : 0})` }}>
            <div className={style.header}>
                <span className={'icon-weibiaoti12 iconfont'} onClick={toggleExpand} />
            </div>
            <ul className={style['navigation-menu']}>
                <li><NavLink to={'/my'} activeClassName={style.active}>我的</NavLink></li>
                <li><NavLink to={'/find'} activeClassName={style.active}>发现</NavLink></li>
                <li><NavLink to={'/toplist'} activeClassName={style.active}>排行榜</NavLink></li>
                <li><NavLink to={'/search'} activeClassName={style.active}>搜索</NavLink></li>
            </ul>
            <div className={style.content} style={{ bottom: playlist.length ? 60 : 0 }}>
                <Suspense fallback={''}>
                    <Switch>
                        <Route path={'/my'} component={MyPage} />
                        <Route path={'/find'} component={FindPage} />
                        <Route path={'/toplist'} component={ToplistPage} />
                        <Route path={`/sheet/:id`} component={SheetPage} />
                        <Route path={`/search`} component={SearchPage} />
                        <Route path={`/singer/:id`} component={SingerPage} />
                        <Route path={`/album/:id`} component={AlbumPage} />
                        <Route path={`/playlists`} component={PlayListsPage} />
                        <Route path={`/artists`} component={ArtistsPage} />
                        <Route path={`/mv/:id`} component={MVPage} />
                        <Route path={`/history`} component={HistoryPage} />

                        <Redirect exact from={'/'} to={'/find'} />
                    </Switch>
                </Suspense>
            </div>
            {/* <Player/> */}

            {isExpandSider && <div className={style.mask} onClick={toggleExpand} />}
        </div>
    )

}


export default inject("appStore")(observer(Main))