<template>
    <div class="c-conjoined-button">
        <ul>
            <li v-for="(data,index) in dataList" :class="['button-color',type]" @click="click(data)">{{data.label}}</li>
        </ul>
    </div>
</template>
<style lang="stylus" scoped>
    .c-conjoined-button{
        cursor:pointer;
        li:first-child{
            color:#fff;
            border-top-left-radius:2px;
            border-bottom-left-radius:2px;
        }
        .button-color{
            float:left;
            padding:1px 10px;
            border:1px solid #33B2FC;
            border-right:1px solid #ddd;
            box-sizing:border-box;
            color:#fff;
        }
        li:last-child{
            border-top-right-radius:2px;
            border-bottom-right-radius:2px;
            border-right:1px solid #33B2FC;
        }
        .cus-parimary{
            background-color:#33B2FC;
            &:hover{
                background-color:#4DC1FB;
            }
            &:active{
                background-color: #13A1D5

            }
        }

    }
</style>
<script>

    export default {
        data() {
            return {}
        },
        methods:{
            click(data){
                this.$emit('click',data);
            },
        },
        props:{
            dataList:{
                required:true,
                type:Array
            },
            type:{
                type:String,
                default(){
                    return 'cus-parimary'
                }
            }
        },
        components: {}
    }
</script>