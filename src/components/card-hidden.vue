<template>
    <el-row class="c-card-hidden">
        <div class="box">
            <div class="box-header pointer" @click="trigger">
                <span class="fr" v-bind:class="[show__? 'minus':'plus']"></span>
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
    .box{
        margin:2px 0px;
        border:1px solid #A1B7CD;
        .box-header{
            box-sizing:border-box;
            padding:3px 8px;
            height:26px;
            line-height:20px;
            background-color:#ACCDED;
            border-bottom:1px solid #ddd;
        }
        .box-content{
            padding:5px 10px;
        }
    }
</style>
<script>

    export default{
        data(){
            return {
                show__:this.value,
            }
        },
        mounted(){
        },
        methods:{
            trigger(){
                this.show__ = !this.show__;
            }
        },
        watch:{
            show(val){
                this.show__ = val;
                this.hidden__=!val;
            },
            value(val){
                this.show__ = val;
            },
            show__(val){
                this.$emit('input', val);
            }
        },
        props:{
            show:{
                type:Boolean,
                default:false
            },
            value:{
            }

        },
        components: {}
    }
</script>