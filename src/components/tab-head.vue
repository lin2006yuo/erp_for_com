<template>
    <div class="tab-head">
        <div v-if="navs.length > 0" :class="['head',isFixed?'fixed':'']" :style="headWidht">
            <i class="button-icon" :class="showIcon" @click="showAll" v-if="needShowAll"></i>
            <!--<a class="nav" @click="show(nav)" v-for="nav in navs" :href="`#${nav.action}`">{{nav.label}}</a>-->
            <span class="nav" v-for="(nav,index) in navs" :key="nav.action">
                <span @click="show(nav,index)">{{nav.label}}</span>
                <i class="close" v-if="showClose" @click="delete_curnav(index)"></i>
            </span>
        </div>
        <div v-if="$slots.default" class="body" ref="body">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="stylus">
    .tab-head{
        margin-bottom :5px;
        /*overflow-x hidden*/
        .fixed{
            position fixed;
            z-index 99
        }
        >.head{
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-color:rgba(228,232,241,1);
            /*width:100%;*/
            /*height:35px;*/
            line-height:35px;
            font-size:1.35rem;
            font-weight:bold;
            color:#1f2d3d;
            border-top-left-radius:3px;
            border-top-right-radius:3px;
            &:hover{
                background-color: rgba(228,232,241,0.8);
            }
            .button-icon{
                box-sizing: border-box;
                margin-left:10px;
            }
            .nav{
                box-sizing:border-box;
                user-select: none;
                display: inline-block;
                padding: 0 14px 0 12px;
                margin-right:8px;
                cursor: pointer;
                border-bottom:1px solid transparent;
                position:relative;
                &:hover{
                    border-bottom:1px solid #33B2FC;
                    color:#33B2FC;
                }
                .close {
                    position: absolute;
                    top: 8px;
                    right: -3px;
                    width:12px;
                    height:12px;
                    border:1px solid transparent;
                    display:inline-block;
                    background:url(../../images/close.png) no-repeat;
                    &:hover{
                        border-radius:8px;
                        background-color:#FF9340;
                        background-image:url(../../images/close-hover.svg);
                        background-size:12px 12px;
                        background-position:center center;
                    }
                }
            }

        }
        .body{
            padding-top :40px;
            border-bottom-left-radius:3px;
            border-bottom-right-radius :3px;
            border:1px solid #dcdcdc;
            border-top:none;
            padding-right:5px;
            padding-bottom :5px;
            padding-left:5px;
            width: calc(100% - 12px)
        }
    }
</style>
<script>
    export default{
        name:'tab-head',
        data(){
            return{
                isShowAll:true,
                headWidht:{
                    width:'80%'
                },
                timer:null
            }
        },
        created(){
            this.get_width()
        },
        methods:{
            delete_curnav(index){
                this.$emit('delete-curnav',index);
            },
            show(item,index){
                this.$parent.show_item(item);
                this.$emit('click-nav',item,index);
            },
            showAll(){
                this.isShowAll = !this.isShowAll;
                this.$parent.show_all(this.isShowAll);
            },
            get_width(){
                this.$nextTick(()=>{
                    let el=this.$el;
                    let parent=window.getComputedStyle(el);
                    if(parent.width.includes('px')){
                        setTimeout(()=>{
                            let width=parseInt(parent.paddingLeft)+parseInt(parent.paddingRight)+parseInt(parent.width)+parseInt(parent.borderRightWidth)+parseInt(parent.borderLeftWidth)
                            this.$set(this.headWidht,'width',`${width}px`)
                        },100)
                    } else {
                        this.timer=setInterval(()=>{
                            if(parent.width.includes('px')){
                                let width=parseInt(parent.paddingLeft)+parseInt(parent.paddingRight)+parseInt(parent.width)+parseInt(parent.borderRightWidth)+parseInt(parent.borderLeftWidth)
                                this.$set(this.headWidht,'width',`${width}px`)
                                clearInterval(this.timer);
                                this.timer=null;
                            }
                        },50)
                    }
                })
            }
        },
        computed:{
            showIcon(){
                return this.isShowAll ? 'el-icon-minus' : 'el-icon-plus';
            }
        },
        props:{
            navs: {
                type: Array,
                default() {
                    return []
                }
            },
            showClose:{
                type: Boolean,
                default() {
                    return false
                }
            },
            needShowAll:{
                type: Boolean,
                default() {
                    return true
                }
            },
            isFixed:{
                type: Boolean,
                default:true
            }
        },
        components:{

        }
    }
</script>
