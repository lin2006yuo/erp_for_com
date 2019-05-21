<template>
    <div class="card-color" @click="click">
        <span class="checkbox" :class="{active:card.status}"></span>
        <span class="color" :style="{backgroundColor:card.color}"></span>
        <span>{{card.label}}</span>
    </div>
</template>
<style lang="stylus">
    .card-color{
        width:120px;
        height:40px;
        display: inline-block;
        line-height:40px;
        margin-left: 10px;
        user-select: none;
        cursor: pointer;
    }
    .color{
        display: inline-block;
        width:15px;
        height:15px;
        border:1px solid gainsboro;
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
            return {
            }
        },
        methods:{
            click(){
                this.card.status = !this.card.status;
            }
        },
        props:{
            card:{},
        },
        components: {}
    }
</script>
