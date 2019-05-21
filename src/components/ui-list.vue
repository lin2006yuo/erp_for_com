<template>
    <ul class="c-ui-list" :style="styleData">
        <li v-for="(item,index) in data"
            :class="[item.light?'high-light':'']"
            @click="click_cur(item)">{{item.label}}</li>
    </ul>
</template>
<style lang="stylus">
    .c-ui-list{
        width:100%;
        text-align:center;
        border:1px solid #e0e6ed;
        position:relative;
        >li{
            height:26px;
            cursor:pointer;
            line-height:26px;
            font-size:1.2rem;
            transition:all 0.2s;
            &:hover{
                background-color:#F2F2F2;
            }
            &.high-light{
                background-color:#20a0ff;
                color:#fff
            }
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                curChoose:this.value,
            }
        },
        methods:{
            click_cur(item){
                this.data.forEach(row=>{
                    this.$set(row,'light',false)
                });
                this.$set(item,'light',true);
                this.$emit('click-cur',item);
            },
        },
        watch:{
            curChoose(val){
                this.$emit('input',val);
            },
            value(val){
                console.log(val,'val');
                this.curChoose = val;
            },
        },
        props:{
            data:{
                required:true,
                type:Array
            },
            value:{
                required:true,
                type:String
            },
            styleData:{
                required:true,
                type:Object
            }
        },
        components: {}
    }
</script>
