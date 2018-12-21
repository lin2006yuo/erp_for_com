<template>
    <span  v-if="!edit" style="display:inline-block;word-break:break-all" v-html="filterLog(value_)"></span>
    <el-input v-else v-model="value_" @change="change" @blur="blur" :type="type" :min="min" :max="max" :disabled="disabled"></el-input>
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
            },
            blur(){
                this.$emit('blur');
            },
            filterLog(val) {
                return val?val.toString().replace(/(\r|\n)+/gm, `<br>`):val;
            }
        },
        watch:{
            value(val){
                this.value_ = val.toString().trim();
            },
            value_(val){
                this.$emit('input',val.trim());
            }
        },
        props:{
            value:{},
            edit:{
                default(){
                    return true;
                }
            },
            min:{
                type:Number
            },
            max:{
                type:Number
            },
            type:{
                default(){
                    return 'text'
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
