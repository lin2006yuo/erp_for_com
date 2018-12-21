<template>
    <div class="c-print-page">
    <!--此页面为打印使用-->
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return {
                dialog:this.value,
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            },
        },
        methods:{

        },
        props:{
            value:{},
        },
        components: {}
    }
</script>