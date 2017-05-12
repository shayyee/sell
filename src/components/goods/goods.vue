<template>
    <div class="goods">
        <!--左侧菜单类别列表-->
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" class="menu-item"
                    :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <span v-if="item.type > 0" class="icon" :class="classMap[item.type]">
                        </span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <!--右侧类别对应的菜品-->
        <div class="foods-wrapper" ref="foodWrapper">
            <ul>
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="food in item.foods" class="food-item border-1px">
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span><span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcart></shopcart>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import shopcart from '../shopcart/shopcart.vue'
    const OK = 1;

    export default {
        props:{
            seller:{
                type:Object
            }
        },
        data(){
          return{
              goods:[],
              menuScroll:'',//左侧栏菜单分类
              foodScroll:'',//右侧菜品列表
              listHeight:[],//每个区间的高度
              scrollY:0, //
          }
        },
        computed:{
          currentIndex(){
              if(this.scrollY>=0){
                  for(let i = 0; i < this.listHeight.length; i++){
                      let height1 = this.listHeight[i];
                      let height2 = this.listHeight[i+1];
                      if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
                          return i;
                      }
                  }
                  return 0;
              }
          }
        },
        created(){

            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

            this.$http.get('/api/goods').then((response)=>{
                let resData = response.body;
                if(resData.state === OK){
                    this.goods = resData.data;
                    console.log(this.goods);
                    this.$nextTick(function () { //DOM更新后在初始化获得DOM高度
                        this._initScroll();
                        this._calculateHeight();
                    });
                }
            });
        },
        methods:{
            _initScroll(){
                let _this = this;
                _this.menuScroll = new BScroll(_this.$refs.menuWrapper,{
                    click: true //是否派发click事件
                });
                _this.foodScroll = new BScroll(_this.$refs.foodWrapper,{
                    //3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
                    probeType:3
                });
                //拿到滚动的实时位置的Y值，用于与左侧对比
                _this.foodScroll.on('scroll',(pos) => {
                    _this.scrollY = Math.abs(Math.round(pos.y));
                })
            },
            _calculateHeight(){
                let _this = this;
                //拿到每个区间
                let foodList = _this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
                let height = 0;
                _this.listHeight.push(height);
                for(let i = 0; i < foodList.length; i++){
                    let item = foodList[i];
                    height += item.clientHeight;
                    _this.listHeight.push(height);
                }
            },
            selectMenu(index,evt){
                let _this = this;
                if(!evt._constructed){//原生点击事件,防止两次触发click事件
                    return;
                }
                //拿到每个区间
                let foodList = _this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
                let el = foodList[index];
                _this.foodScroll.scrollToElement(el,300);

            }
        },
        components:{
            shopcart
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">

    @import "../../common/stylus/mixin.styl"

    .goods
        display: flex
        position: absolute
        top: 174px
        bottom: 46px
        width: 100%
        overflow: hidden
        .menu-wrapper
            flex: 0 0 80px
            background: #f3f5f7
            width: 80px
            .menu-item
                display: table
                height: 54px
                width: 56px
                padding: 0 12px
                line-height: 14px
                &.current
                    position: relative
                    z-index: 10
                    margin-top: -1px
                    background: #fff
                    font-weight: 700
                    .text
                        border-none()
                .icon
                    display: inline-block
                    vertical-align: top
                    width: 12px
                    height: 12px
                    margin-right: 2px
                    background-size: 12px 12px
                    background-repeat: no-repeat
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')
                    &.guarantee
                        bg-image('guarantee_3')
                    &.invoice
                        bg-image('invoice_3')
                    &.special
                        bg-image('special_3')
                .text
                    display: table-cell
                    width: 56px
                    vertical-align: middle
                    border-1px(rgba(7, 17, 27, 0.1))
                    font-size: 12px
        .foods-wrapper
            flex: 1
            .title
                padding-left: 14px
                height: 26px
                line-height: 26px
                border-left: 2px solid #d9dde1
                font-size: 12px
                color: rgb(147, 153, 159)
                background: #f3f5f7
            .food-item
                display: flex
                margin: 18px
                padding-bottom: 18px
                border-1px(rgba(7, 17, 27, 0.1))
                &:last-child
                    border-none()
                    margin-bottom: 0
                .icon
                    flex: 0 0 57px
                    margin-right: 10px
                .content
                    flex: 1
                    .name
                        margin: 2px 0 8px 0
                        height: 14px
                        line-height: 14px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .desc, .extra
                        line-height: 10px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                    .desc
                        line-height: 12px
                        margin-bottom: 8px
                    .extra
                        .count
                            margin-right: 12px
                    .price
                        font-weight: 700
                        line-height: 24px
                        .now
                            margin-right: 8px
                            font-size: 14px
                            color: rgb(240, 20, 20)
                        .old
                            text-decoration: line-through
                            font-size: 10px
                            color: rgb(147, 153, 159)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 12px
</style>