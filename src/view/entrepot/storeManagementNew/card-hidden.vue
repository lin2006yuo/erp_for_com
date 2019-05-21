<template>
    <el-row class="c-card-hidden">
        <div class="xmj-box">
            <div class="box-header">
                <span @click="trigger" class="fr" v-bind:class="[show__? 'showC':'hiddenC']"></span>
                <slot name="title"></slot>
            </div>
            <div v-if="show__" class="box-content">
                <slot name="content" ></slot>
            </div>
        </div>
        <slot name="dialog"></slot>
    </el-row>
</template>
<style lang="stylus">
    .xmj-box{
        margin-left: 10px;
        border:1px solid #C2D0DF;
        .box-header{
            border: 1px solid #6495ED;
            box-sizing:border-box;
            padding:3px 8px;
            height:30px;
            line-height:24px;
            background-color:#6495ED;
            color: #fff;
            font-weight: bold;
            .fr{
                width:16px;
                height:19px;
                float:right;
                cursor: pointer;
            }
            .showC{
                background:url(../../../assets/up.png) no-repeat 0 3px;

            }
            .hiddenC{
                background:url(../../../assets/down.png) no-repeat 0 3px;
            }
        }
        .box-content{
            padding:10px 10px 0 10px;
        }
    }
</style>
<script>

    export default{
        data(){
            return {
                show__:false,
            }
        },
        mounted(){
            this.show__ = this.show;
        },
        methods:{
            trigger(){
                this.show__ = !this.show__;
            }
        },
        watch:{
            show(val){
                this.show__ = val;
                this.hidden__ = !val;
            },
        },
        props:{
            show:{
                type:Boolean,
                default:false
            }
        },
        components: {}
    }
</script>