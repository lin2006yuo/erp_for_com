<template>
    <span v-if="!edit">
        {{value_}}
    </span>
    <input  v-else class="min-width el-input__inner"  type="number" min="0" v-model="value_" @change="change"  :disabled="disabled" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
    <!--<el-input v-else v-model="value_" @change="change"  :disabled="disabled" type="number"></el-input>-->
</template>
<style>

</style>
<script>

    export default {
        data(){
            return {
                value_:this.value,
            }
        },
        methods:{
            change(){
                this.$emit('change',...arguments);
            }
        },
        watch:{
            value(val){
                this.value_ = val;
            },
            value_(val){
                this.$emit('input',val);
            }
        },
        props:{
            value:{},
            edit:{
                default(){
                    return true;
                }
            },
            disabled:{
                default(){
                    return false;
                }
            }
        },
    }

</script>