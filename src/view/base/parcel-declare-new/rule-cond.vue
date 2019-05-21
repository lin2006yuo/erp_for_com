<template>
    <div class="c-rule-cond">
        <label class="rule-title" v-if="config.title"><span>{{config.title}}</span></label>
        <div class="rule-content">
            <rule-form :config="config" :data="data"></rule-form>
            <label class="rule-profile" v-if="config.profile">{{config.profile}}</label>
        </div>
    </div>
</template>
<style lang="stylus">
    .rule-content{
        padding-top:10px;
    }
    .rule-title{
        font-size:12px;
        >span{
            color: #5e8fce;
            margin-left:8px;
        }
    }
    .rule-desc{
        display: inline-block;
        color: #ff0000;
    }
    .rule-profile{
        color: #ce7e0f;
    }
    .label-width{
        max-width:150px;
    }
</style>
<script>

   /* import {api_get_resource} from '../../../api/order-rules';*/
    export default{
        data(){
            return{

            }
        },
        computed:{
        },
        props:{
            data:{},
            title:{},
            code:{},
            config:{}
        },
        components:{
            ruleForm:require('./rule-form').default,
        }
    }
</script>
