<template>
    <input type="text" v-model="value_" @dbclick="dbclick" @click="click" @change="change">
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                value_:this.value
            }
        },
        methods:{
            change(){
                this.$emit('change', ...arguments);
            },
            click(){
                this.$emit('click', ...arguments);
            },
            dbclick(){
                this.$emit('dbclick', ...arguments);
            }
        },
        watch:{
            value_(val){
                this.$emit('input', val);
            },
            value(val){
                this.value_ = val;
            }
        },
        props:{
            value:{}
        },
        components:{

        }
    }
</script>