<template>
    <select :size="size" class="cus-select">
        <option v-for="item in options" @click="select(item.id)" :value="item.id" class="cus-options">{{item.title?item.title:item.name}}</option>
    </select>
</template>
<style lang="stylus">
.cus-select{
    border-radius:3px;
    &:hover{
         border-color:#8492A6;
    }
    .cus-options{
        font-size: 1.2rem;
        padding:5px 8px;
        &:hover{
            background-color:#EFF2F7;
        }
    }
}
</style>
<script>
    export default{
        data(){
            return {
                selected:''
            }
        },
        methods:{
            select(id){
                this.selected = id;
            }
        },
        watch:{
            selected(new_){
                this.$emit('select',new_);
            }
        },
        props:{
            options:{
                required:true,
                type:Array
            },
            size:{
                default:function(){
                    return 5;
                }
            }
        },
        components: {}
    }
</script>
