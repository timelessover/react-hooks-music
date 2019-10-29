import React, { useState, useEffect } from 'react'
import { get } from '../../utils/request'
import { SearchBar } from 'antd-mobile'
import style from './style/index.module.scss'
import ResultTabs from './ResultTabs'
import Loading from '../../components/Loading/index'

const Index = () => {
    const [hotlist, setHostlist] = useState([])
    const [isFocus, setFocus] = useState(false)
    const [keywords, setKeywords] = useState('')
    const [suggestList, setSuggestList] = useState([])
    const [searchHistory, setSearchHistory] = useState(JSON.parse(localStorage.getItem('searchHistory')) || [])
    const [isSearch, setIsSearch] = useState(false)

    useEffect(() => {
        getHotlist()
    },[])

    const getHotlist = async () => {
        const res = await get('/search/hot')
        setHostlist(res.result ? res.result.hots : [])
    }

    const getSuggestList = async (keywords) => {
        if (!keywords) {
            return
        }
        const res = await get(`/search/suggest`, {
            keywords,
            type: 'mobile'
        })
        setSuggestList(res.result ? res.result.allMatch : [])
    }

    const handleChange = async (keywords) => {
        getSuggestList(keywords)
        setKeywords(keywords)
        setIsSearch(false)
    }

    const search = async (keywords) => {
        setKeywords(keywords)
        setIsSearch(true)
        addHistory(keywords)
    }

    const addHistory = (keywords) => {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
        const index = searchHistory.findIndex(item => item === keywords)

        if (index !== -1) {
            searchHistory.splice(index, 1)
        }

        searchHistory.unshift(keywords)
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

        setSearchHistory(searchHistory)
    }
    const removeHistory = (index) => {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []

        searchHistory.splice(index, 1)
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory))

        setSearchHistory(searchHistory)
    }
    const FocusBox = () => <div>
        {
            isSearch ? <div>
                <ResultTabs keywords={keywords} />
            </div> : <div>
                    <ul className={style['suggest-box']}>
                        {suggestList && suggestList.map(item => <li key={item.keyword} onClick={() => search(item.keyword)}>
                            <div className={'iconfont icon-sousuo1'} />
                            <div>{item.keyword}</div>
                        </li>)}
                    </ul>
                </div>
        }
    </div>

    const BlurBox = () => <div>
        <div className={style['hot-list-box']}>
            <div style={{ display: hotlist.length ? '' : 'none' }}>热门搜索</div>
            <ul>
                {hotlist && hotlist.map(hot => <li key={hot.first} onClick={() => search(hot.first)}>{hot.first}</li>)}
            </ul>
            <ol style={{ display: hotlist.length ? '' : 'none' }}>
                {searchHistory && searchHistory.map((item, index) => <li key={item}>
                    <div className={'iconfont icon-lishibisai'} />
                    <div onClick={() => search(item)}>{item}</div>
                    <div className={'iconfont icon-lvzhou_shanchu_lajitong'} onClick={() => removeHistory(index)} />
                </li>)}
            </ol>
            <Loading loading={!hotlist.length} />
        </div>
    </div>

    return (
        <div className={style.container}>
            <div>
                <SearchBar
                    value={keywords}
                    onSubmit={search}
                    onChange={handleChange}
                    placeholder={'搜索歌手、歌曲、专辑'}
                    onBlur={() => setFocus(false)}
                    onFocus={() => setFocus(true)} />
            </div>
            <div>
                {(keywords || isFocus) ? <FocusBox /> : <BlurBox />}
            </div>
        </div>
    )
}


export default Index