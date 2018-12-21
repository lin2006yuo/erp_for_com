<template>
    <div class="c-title-content">
        <div class="title-header">{{label}}</div>
        <div class="title-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<style lang="stylus" scoped>
    .c-title-content{
        .title-header{
            box-sizing:border-box;
            height:35px;
            line-height:35px;
            font-size:1.35rem;
            font-weight:550;
            padding-left:5px;
            /*border-bottom:1px solid #ddd;*/
        }
        .title-content{
            padding-left:15px;
        }
    }
</style>
<script>

    export default {
        data() {
            return {}
        },
        props:{
            /**组件的title
             * */
            label:{}
        },
        components: {}
    }
</script>