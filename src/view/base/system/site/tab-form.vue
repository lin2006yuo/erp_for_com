<template>
    <div class="p-tab-form">
        <div class="site-form">
           <slot></slot>
        </div>
    </div>
</template>
<style lang="stylus">
    .site-form{
        margin: 0;
        padding: 0;
        tr{
            background: url(/static/hr.png) 0 bottom repeat-x;
        }
        tr:hover{
            background: #EDF5FA;
        }
        th{
            width: 120px;
            padding: 7px 10px;
            border: 1px solid #eee;
            border-right: 1px solid #e5e3e3;
        }
        td{
            padding: 7px 10px 9px 15px;
            color: #666;
            border: 1px solid #eee;
        }
        .submit{
            padding: 10px 20px 10px;
            background: #eaeaea url(/static/btn_wrap.png) repeat-x;
            border: 1px solid #d8d8d8;
            margin-top: 3px;
        }
    }
</style>
<script>

    export default{
        data(){
            return {}
        },
        created(){
        },
        mounted(){
        },
        methods: {},
        filters: {},
        watch: {},
        computed: {},
        props: {},
        components: {}
    }
</script>