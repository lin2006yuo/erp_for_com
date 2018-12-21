<template>
    <div class="tab-item">
        <div class="head" @click="show">{{label}}
                <slot name="header"></slot>
                <i :class="buttonClass" class="button-class"></i>
        </div>
        <div v-if="isShow" class="body">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="stylus">
    .tab-item{
        /*margin-bottom:5px;*/
        /*padding:5px;*/
        >.head{
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            box-sizing: border-box;
            padding-left:15px;
            padding-right:15px;
            width:100%;
            height:33px;
            font-size:1.3rem;
            line-height:33px;
            font-weight:bold;
            color:#1f2d3d;
            border-top-left-radius :3px;
            border-top-right-radius :3px;
            box-shadow:-10px 10px 60px 0 rgba(29,36,31,0.09);
            transition:all .2s;
            background-color: rgba(228,232,241,1);
            &:hover{
                background-color: rgba(228,232,241,0.8);
            }
            .button-class{
                line-height:33px;
                float: right;
                padding:0 12px;
                &:hover{
                    border-radius:3px;
                    background-color: #00acac;
                    color:#fff;
                    transition:background-color 0.4s linear
                }
            }
        }
        .body{
            border-bottom-left-radius :3px;
            border-bottom-right-radius :3px;
            background-color:rgba(227,232,234,0.3);
            box-sizing: border-box;
            padding:10px;
            overflow: auto;
        }
    }
</style>
<script>
    export default{
        name:'tab-item',
        data(){
            return{
                isShow:true
            }
        },
        mounted(){
            this.$nextTick(()=>{
                this.isShow = !!this.def;
            });
        },
        watch:{
            show(val){
                this.$emit("input",val);
            },
            def(val){
                this.$nextTick(()=>{
                    this.isShow = !!val;
                });
            }
        },
        methods:{
            show(){
                this.isShow = !this.isShow;
                this.$parent.caluc_show_all();
            }
        },
        computed:{
            buttonClass(){
//                return this.isShow ? 'el-icon-minus' : 'el-icon-plus';
                return this.isShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up';
            }
        },
        props:{
            id:{
                required:true
            },
            label:{
                required:true,
                type:String
            },
            def:{
                default(){
                    return true;
                }
            }
        },
        components:{

        }
    }
</script>
