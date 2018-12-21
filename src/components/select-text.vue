<template>
    <label v-if="!edit">{{titleName}}</label>
    <el-select v-else v-model="value_" :disabled="disabled" @change="change" filterable="filterable">
        <slot></slot>
    </el-select>
</template>
<style>
</style>
<script>0
    export default{
        data(){
            return{
                value_:this.value,
            }
        },
        computed:{
            titleName(){
               if(this.$slots.default instanceof Array){
                  let ret = this.$slots.default.findRet(row=>{
                     if(!row.componentOptions){
                         return;
                     }
                     let options = row.componentOptions;
                     if(options.tag !== 'el-option'){
                        return;
                     }
                     let props = options.propsData;
                     if(this.value_ === props.value){
                        return props.label;
                     }
                  });
                    return ret;
               }
            }
        },
        watch:{
            value_(val){
                this.$emit('input',val);
            },
            value(val){
                this.value_ = val;
            }
        },
        methods:{
            change(val){
                this.$emit("change",val);
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
            },
            filterable:{
                default(){
                    return false;
                }
            }
        },
        components:{
        uiSelect:require('./ui-select.vue').default,
        }
    }

</script>