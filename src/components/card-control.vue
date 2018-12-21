<template>
    <el-row class="c-card-control">
        <div class="control">
            <div class="control-header pointer">
                <slot name="title"></slot>
            </div>
            <div class="control-content">
                <slot name="content"></slot>
            </div>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .control{
        margin:2px 0px;
        border:1px solid #A1B7CD;
        .control-header{
            box-sizing:border-box;
            padding:3px 8px;
            height:30px;
            line-height:24px;
            background-color:#43A4DE;
            border-bottom:1px solid #ddd;
            color:#fff;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        .control-content{
            padding:5px 10px;
        }
    }
</style>
<script>

    export default{
        data(){
            return {}
        },
        porps:{


        },
        components: {}
    }
</script>