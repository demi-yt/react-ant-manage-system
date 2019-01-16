import React from 'react';
import { Link } from 'react-router-dom';

import MUtil from '../../util/index.jsx';
import User from '../../service/user-service.jsx';

const _index = new MUtil();
const _user = new User();


/**
 * 首页头部
 *
 * @class NavTop
 * @extends {React.Component}
 */
class NavTop extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username : _index.getStorage('userInfo').username || ''
        }
    }

    /**
     * 退出登录
     *
     * @memberof NavTop
     */
    onLoginout() {
        _user.loginOut().then(res => {
            // 删除本地存现的登录信息
            _index.removeStorage('userInfo');
            // 跳转登录页面
            window.location.href = "/login"
        },errMsg => {
            _index.errorTips(errMsg);
        });
    }

    render() {
        return (
            <div className="navbar navbar-default top-navbar">
                <div className="navbar-header">
                    <Link className="navbar-brand" to="/">MMALL</Link>
                </div>
                <ul className="nav navbar-top-links navbar-right">
                    <li className="dropdown">
                        <a className="dropdown-toggle" href="javascript:;">
                            <i className="fa fa-user fa-fw"></i>
                            {
                                this.state.username ? <span>欢迎，{this.state.username}</span>:<span>欢迎您</span>
                            }
                        </a>
                        <ul className="dropdown-menu dropdown-user">
                            <li>
                                <a onClick={() => {this.onLoginout()}}>
                                    <i className="fa fa-sign-out fa-fw"></i>
                                    <span>退出</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
}

export default NavTop;