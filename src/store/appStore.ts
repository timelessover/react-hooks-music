import {observable, action} from 'mobx'

class AppStore {
    @observable isExpandSider:boolean = false
      /**
     * 切换侧边栏的折叠展开
     */
    @action
    toggleExpand = () => {
        this.isExpandSider = !this.isExpandSider
    }
}

export default new AppStore()