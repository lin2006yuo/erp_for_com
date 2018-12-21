<template>
    <div class="dialog " :style="outer" v-if="show" @click="out_click">
        <transition name="page-dialog">
            <div class="inner" :style="[inner,innerSize]" @click.stop="" ref="inner">
                <div class="dialog-header">
                    <span class="title">{{title}}</span>
                    <i class="el-dialog__close el-icon el-icon-close close" @click="close"></i>
                </div>
                <div class="dialog__body"  :style="addStyle">
                    <slot></slot>
                </div>
                <div v-if="$slots.footer" class="dialog__footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>
<style lang="stylus">
    .dialog{
        position:relative;
    .inner{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        overflow:hidden;
        animation:shows  0.3s  linear;
        display: flex;
        flex-direction: column;
    }
    .dialog-header{
        box-sizing: border-box;
        padding: 0 20px;
        height: 36px;
        line-height: 36px;
        /*border-bottom:1px solid rgba(31, 45, 61, 0.38);*/
        margin-bottom: 5px;
        box-shadow:0 2px 4px 0px rgba(0, 0, 0, .12), 0px 0px 6px 0px rgba(0, 0, 0, .04)
    }
    .title{
        line-height: 1;
        font-size: 14px;
        font-weight: 500;
        color: #1f2d3d;
    }
    .close{
        float: right;
        line-height: 36px;
    }
    .dialog__body{
        padding: 5px 10px 0 10px;
        color: #475669;
        flex: 1;
        font-size: 1.2rem;
        overflow-y: auto;
        box-sizing: border-box;
    }
    .dialog__footer{
        box-sizing: border-box;
        width: 100%;
        text-align: right;
        height:36px;
        padding: 5px;
    }
    }
    @keyframes shows{
        0% {
           top:0
        }
        100% {
            top:50%
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                show:this.value,
                outer:{},
                addStyle:{},
                inner:{
                    position: `absolute`,
                    backgroundColor:'#fff',
                }
            }
        },
        mounted(){
//            window.addEventListener('resize', this.caluc_style);
//            this.caluc_style();
        },
        methods:{
            reCenter(){
                console.log(`reCenter`);
                let pageEle = document.getElementById('n-content');
                let nContent = window.getComputedStyle(pageEle);
                let rect = pageEle.getBoundingClientRect();
                this.$set(this.outer, 'width', nContent.width);
                this.$set(this.outer, 'height', nContent.height);
                this.$set(this.outer, 'position', 'fixed');
                this.$set(this.outer, 'left', `${rect.left}px`);
                this.$set(this.outer, 'top', `${rect.top}px`);
                this.$set(this.outer, 'backgroundColor', 'rgba(0,0,0,.5)');
                this.$set(this.outer, 'z-index', '1999');
            },
            caluc_style(){
                let pageEle = document.getElementById('n-content');
                let nContent = window.getComputedStyle(pageEle);
                let rect = pageEle.getBoundingClientRect();
                this.$set(this.outer, 'width', nContent.width);
                this.$set(this.outer, 'height', nContent.height);
                this.$set(this.outer, 'position', 'fixed');
                this.$set(this.outer, 'left', `${rect.left}px`);
                this.$set(this.outer, 'top', `${rect.top}px`);
                this.$set(this.outer, 'backgroundColor', 'rgba(0,0,0,.5)');
                this.$set(this.outer, 'z-index', '1999');
            },
            close(){
                this.makeSureClose__() && (this.show = false);
                this.$emit("close");
            },
            out_click(){
                this.closeOnClickModal && this.outClose && this.makeSureClose__() && (this.show = false);
            },
            makeSureClose__(){
                return true;
            },
        },
        computed:{
            innerSize(){
                if(this.isAuto){
                    return  {
                        maxWidth:(parseInt(this.outer.width)*0.9+"px")||'1000px',
                        maxHeight:(parseInt(this.outer.height)*0.9+"px")||'600px',
                    }
                }else {
                        switch (this.size){
                            case 'small':
                                return {
                                    width:this.width || `550px`,
                                    height:this.height || `auto;`,
                                    maxHeight:'500px',
                                };
                            case 'large':
                                return {

                                    width:this.width || '1000px',
                                    height:this.height || `auto`,
                                    maxHeight:'600px',
                                };
                            case 'full':
                                return {
                                    width:this.width || `65%`,
                                    height:this.height || `auto;`,
                                    maxHeight:'7250px',
                                }
                        }
                }
            },
        },
        watch:{
            show(val){
                this.$emit('input',val);
            },
            value(val){
                if(val){
                    console.log(`dialog true`);
                    window.addResizeListener(this.$refs.inner, this.reCenter);
                }else{
                    window.removeResizeListener(this.$refs.inner, this.reCenter);
                }
                this.show = val;
                this.$emit('change', val);
            }
        },
        props:{
            value:{},
            title:{
                type:String,
                default:'title'
            },
            outClose:{
                type:Boolean,
                default:function () {
                    return true;
                },
            },
            closeOnClickModal:{
                type:Boolean,
                default:function () {
                    return true;
                }
            },
            size:{
                type:String,
                default:'small',//small|large|full
            },
            makeSureClose:{
                default:function () {
                    return true;
                }
            },
            isAuto:{
                type:Boolean,
                default:function () {
                    return true;
                },
            },
            width:{
                type:String
            },
            height:{
                type:String
            },
        },
        components:{

        }
    }
</script>