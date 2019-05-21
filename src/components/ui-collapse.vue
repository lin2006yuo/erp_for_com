<template>
    <div class="ui-collapse">
        <div class="head"  @click="head_click($event)">
            <el-checkbox :disabled="disabled" v-if="showCheck" v-model="isCheck"></el-checkbox>
            <i class="button-class" :class="buttonClass" @click.stop="show_"></i>
            <slot name="title"  ></slot>
        </div>
        <div v-show="isShow" class="body">
            <slot ></slot>
        </div>
    </div>
</template>
<style lang="stylus">
    .ui-collapse{
        border: 1px solid gainsboro;
        margin-bottom:1px;
        .head{
            -webkit-user-select: inherit;
            -moz-user-select: inherit;
            -ms-user-select: inherit;
            user-select: inherit;
            box-sizing: border-box;
            padding-left:10px;
            padding-right:10px;
            width:100%;
            font-size:1.2rem;
            line-height:26px;
            border-bottom: 1px solid gainsboro;
            background-color: #EFF2F7;
            /*color: #;*/
            .button-class{
                display: inline-block;
                margin-left: 5px;
                font-size:12px;
                line-height:26px;
                vertical-align: text-top;
                cursor: pointer;
            }
        }
        .body{
            box-sizing: border-box;
            padding:5px;
        }
    }
</style>
<script >
    export default{
        data(){
            return{
                isShow:true,
                isCheck:false
            }
        },
        computed:{
            buttonClass(){
                return this.isShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right';
            }
        },
        methods:{
            show_(){
                this.isShow = !this.isShow;
            },
            head_click(e){
                if(this.showCheck&&e.target.className==='el-checkbox__inner'){
                    this.isCheck = !this.isCheck;
                    this.message&&(this.message.isCheck = this.isCheck);
                    e.preventDefault();
                    return
                }
                if(this.showCheck&&e.target.className==='el-checkbox__original'){
                    e.preventDefault();
                    return
                }
                this.$emit("head");
            }
        },
        mounted(){
            this.$nextTick(()=>{
                this.isShow = !!this.show;
            });
        },
        watch:{
            show(val){
                this.isShow = val;
            },
            'message.isCheck'(val){
                this.isCheck = val;
            }
        },
        props:{
            show:{
                default(){
                    return false
                }
            },
            message:{
                default(){
                    return null
                }
            },
            showCheck:{
                default(){
                    return false
                }
            },
            disabled:{
                type:Boolean,
                default(){
                    return false
                }
            }
        },
        components:{

        }
    }
</script>
