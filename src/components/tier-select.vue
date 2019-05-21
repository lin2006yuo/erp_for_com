<template>
    <div class="c-tier-select">
        <ui-select v-model="value_">
            <el-option></el-option>
        </ui-select>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return {
                value_:this.value,
            }
        },
        watch:{
            value_(val){
                this.$emit("input",val);
            },
            value(val){
                this.value_ = val;
            }
        },
        props:{
            value:{}
        },
        components: {
            uiSelect:require('../components/ui-select.vue').default,
        }
    }
</script>