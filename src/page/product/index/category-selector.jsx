import React from 'react';
import MUtil from '../../../util/index.jsx';
import Product from '../../../service/product-service.jsx';

const _index = new MUtil();
const _product = new Product();

import './category-selector.scss';

// 品类选择器
class CategorySelect extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            firstCategoryList   : [],
            firstCategoryId     : 0,
            secondCategoryList  : [],
            secondCategoryId    : 0
        }
    }
    componentDidMount() {
        this.loadFirstCategory();
    };
    componentWillReceiveProps(nextProps){
        let categoryIdChange        = this.props.categoryId !== nextProps.categoryId,
            parentCategoryIdChange  = this.props.parentCategoryId !== nextProps.parentCategoryId;
        // 数据没有发生变化的时候，直接不做处理
        if(!categoryIdChange && !parentCategoryIdChange) {
            return ;
        }
        // 只有一级
        if(nextProps.parentCategoryId === 0) {
            this.setState({
                firstCategoryId : nextProps.categoryId,
                secondCategoryId : 0
            });
        }else{
            this.setState({
                firstCategoryId:nextProps.parentCategoryId,
                secondCategoryId : nextProps.categoryId
            },() => {
                parentCategoryIdChange && this.loadSecondCategory();
            });
        }
    }
    // 加载一级菜单
    loadFirstCategory() {
        _product.getCategoryList().then(res => {
            this.setState({
                firstCategoryList : res
            },errMsg => {
                _index.errorTips(errMsg);
            });
        });
    }
    // 加载二级分类
    loadSecondCategory() {
        _product.getCategoryList(this.state.firstCategoryId).then(res => {
            this.setState({
                secondCategoryList = res
            },errMsg => {
                _index.errorTips(errMsg);
            });
        });
    }
    // 选择一级品类
    onFirstCategoryChange(e) {
        if(this.props.readOnly) {
            return ;
        }
        let newValue = e.target.value || 0;
        this.setState({
            firstCategoryId : newValue,
            secondCategoryId : 0,
            secondCategoryList:[]
        },() => {
            // 更新二级品类
            this.loadSecondCategory();
            this.onPropsCategoryChange();
        });
    }
    // 选中二级品类
    onSecondCategoryChange() {
        if(this.props.readOnly) {
            return;
        }
        let newValue = e.target.value || 0;
        this.setState({
            secondCategoryId : newValue
        },() => {
            this.onPropsCategoryChange();
        });
    }
    // 传给父组件选中的结果
    onPropsCategoryChange(){
        // 判断props里的回调函数存在
        let categoryChangable = typeof this.props.onCategoryChange === 'function';
        // 有二级品类
        if(this.state.secondCategoryId) {
            categoryChangable && this.props.onCategoryChange(this.state.secondCategoryId,this.state.firstCategoryId);
        }else{
            // 只有一级
            categoryChangable && this.props.onCategoryChange(this.state.firstCategoryId,0);
        }
    }
    render() {
        return (
            <div className="col-md-10">
                <select className="form-control cate-select"
                    value={this.state.firstCategoryId}
                    onChange={(e) => this.onFirstCategoryChange(e)}
                    readOnly={this.props.readOnly}>
                        <option value="">请选择一级分类</option>
                        {
                            this.state.firstCategoryList.map(
                                (category,index) => <option value={category.id} key={index}>{category.name}</option>
                            )
                        }
                    </select>
                    {
                        this.state.secondCategoryList.length ? 
                            <select className="form-control cate-select"
                                value={this.state.secondCategoryId}
                                onChange={(e) => this.onFirstCategoryChange(e)}
                                readOnly={this.props.readOnly}>
                                    <option value="">请选择二级分类</option>
                                    {
                                        this.state.secondCategoryList.map(
                                            (category, index)=> <option value={category.id} key={index}>{category.name}</option>
                                        )
                                    }
                            </select>
                            : null
                    }
            </div>
        );
    }
}

export default CategorySelector;