<template>
    <div class="c-cut-input">
        <el-input :value="get_data(data)" @input="(val)=>{set_data(val)}"></el-input>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                data:this.value,
            }
        },
        watch:{
            data(val){
                this.$emit('input',val)
            },
            value(val){
                this.data = val;
            },
        },
        methods:{
            get_data(val){
                let cur = '';
                cur = val.includes('\n')?val.split('\n')[0]:val;
                return cur;
            },
            set_data(val){
                this.data = val;
            },
        },
        props:{
            value:{},
        },
        components: {}
    }
</script>