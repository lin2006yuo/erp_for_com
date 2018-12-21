<template>
    <div class="p-ui-tip"  >
        <a :class="[isLink?'link':'',isOperate?'cur-operate':'','inline',hiLite?'hiLine':'']"
           :title="getTitle()"
           v-copy  ref="ahtml"
           :style="styles"
           @click="cur_click">{{content}}</a>
        <span :class="[isLink?'operate':'','inline']"
              ref="content"
              @click="cur_click"> {{content}}</span>
    </div>
</template>
<style lang="stylus">
    .p-ui-tip{
        display: inline-block;
        position: relative;
        >span{
             visibility: hidden;
             position: absolute;
             left: -999px;
             top: 0;
         }
        >a{
             font-size: 12px!important;
             display: inline-block;
             white-space: nowrap;
             overflow: hidden;
             z-index: 10;
             text-overflow: ellipsis;
            &.hiLine{
                color: red !important;
            }
            &.nhiLine{
                color: black;
            }
            &:hover{
                 font-size: 12px!important;
                 color: black;
             }
            &:active{
                 font-size: 12px!important;
                 color: black;
             }
            a:link{
                font-size: 12px!important;
                color: black;
            }
            a:visited{
                font-size: 12px!important;
                color: black;
            }
            &.link{
                 color: #6699FF !important;
                &:active{
                     color: #397180!important;
                 }
            }
            &.cur-operate{
                 color: #6699FF !important;
                 cursor: pointer;
                 /* ps：物流商下单页面 要求包裹号可以复制
                 user-select: none;
                 -ms-user-select: none;
                 -moz-user-select: none;
                 -webkit-user-select: none;*/
                &:hover{
                     color: #074791 !important;
                 }
            }
        }
    }
</style>
<script>

    export default{
        data(){
            return {
                parentWidth:0,
                length:0,
                style:{}
            }
        },
        created(){
            this.get_length();
            this.get_parent_length();
        },
        computed: {
            styles(){
                let width = parseInt(this.parentWidth * this.width / 100);
                if(this.length>=width){
                    return  {width:  width+"px"}
                }else {
                    return {}
                }
            },
        },
        methods: {
            cur_click(){
                this.$emit("cur-click");
            },
            getTitle(){
                let width = this.parentWidth * this.width / 100;
                if(this.length>=width){
                    return this.content
                }else {
                    return ""
                }
            },
            get_length(){
                this.$nextTick(() => {
                    let el = this.$refs.content.getBoundingClientRect();
                    this.length = parseInt(el.width);
                })
            },
            get_parent_length(){
                this.$nextTick(() => {
                    let style = window.getComputedStyle(this.$el.parentNode);
                    this.parentWidth = parseInt(style.width);
                })
            }
        },
        props: {
            width: {
                type: Number,
                default(){
                    return 80;
                },
            },
            content:{
                required: true,
            },
            isLink:{
                default(){
                    return false
                }
            },
            isOperate:{
                default(){
                    return false
                }
            },
            hiLite:{
                default(){
                    return false;
                },
            }
        },
        components: {}
    }
</script>
