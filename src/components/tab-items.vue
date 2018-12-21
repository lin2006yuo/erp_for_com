<template>
    <div class="tab-items">
        <div class="head">{{label}}</div>
        <div class="body">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="stylus">
    .tab-items{
        border: 1px solid gainsboro;
        margin-bottom:1px;
        .head{
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            box-sizing: border-box;
            padding-left:15px;
            padding-right:15px;
            width:100%;
            height:26px;
            font-size:1.2rem;
            line-height:26px;
            border-bottom: 1px solid gainsboro;
            background-color: #A9CDEB;
            /*color: #;*/
            .button-class{
                font-size:12px;
                line-height:26px;
                float: right;
            }
        }
        .body{
            box-sizing: border-box;
            padding:10px;
        }
    }
</style>
<script>

    export default{
        name:'tab-items',
        data(){
            return{}
        },
        props:{
            label:{
                required:true,
                type:String
            },
            def:{}
        },
        components:{

        }
    }
</script>