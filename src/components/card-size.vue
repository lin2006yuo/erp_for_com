<template>
    <div class="card-size" @click="click">
        <span class="checkbox" :class="{active:size.status}"></span>
        <span>{{size.label}}</span>
    </div>
</template>
<style lang="stylus">
    .card-size{
        width:120px;
        height:40px;
        display: inline-block;
        line-height:40px;
        margin-left: 10px;
        user-select: none;
        cursor: pointer;
    }
    .checkbox{
        width:15px;
        height:15px;
        display: inline-block;
        border: 1px solid gray;
        border-radius: 50%;
        padding: 1px;
        &.active{
            background-color: green;
            border-color: #fff;
        }
    }
</style>
<script>

    export default{
        data(){
            return {}
        },
        methods:{
            click(){
                this.size.status = !this.size.status;
            }
        },
        props:{
            size:{}
        },
        components: {}
    }
</script>
