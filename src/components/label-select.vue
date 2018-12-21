<template>
    <div class="c-label-select">
        <label v-if="label" class="inline" :style="labelStyle"><span class="red mr-xs" v-if="showRequired">*</span>{{label}}</label>
        <el-select class="inline" ref="all"  v-mouse-side.mousewheel="()=>{$refs.all.visible=false}" v-if="edit" v-model="value_" :placeholder="placeholder"  @change="change" :disabled="isDisabled" :filterable="filterable" :clearable="clearable">
            <el-option v-for="(item,index) in lists" :key="item.value || item.id||item.customer_id" :label="item.label || item.name||item.realname" :value="item.value || item.id||item.customer_id" :disabled="item.disabled"></el-option>
        </el-select>
        <span v-else>{{title}}</span>
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
            },
        },
        computed:{
            title(){
                if(this.lists instanceof Array){
                   let ret = this.lists.findRet(row=>{
                        if(row.value===this.value_ || row.id===this.value_){
                            return row.label || row.name;
                        }
                    });
                    return ret;
                }
            },
            labelStyle(){
                let style = {
                    textAlign: this.labelAlign || 'right',
                    fontWeight:this.fontWeight || "normal"
                };
                if(this.labelWidth){
                    style.width = `${this.labelWidth}px`
                }
                return style;
            },
        },
        methods:{
            change(val){
                this.$emit("change",val);
            }
        },
        props:{
            value:{},
            lists:{
                required:true,
                type:Array,
            },
            edit:{
                default(){
                    return true;
                }
            },
            placeholder:{
                default(){
                    return "请选择"
                }
            },
            labelAlign:{},
            labelWidth:{},
            fontWeight:{},
            label:{
                default(){
                    return '';
                }
            },
            isDisabled:{
                default(){
                    return false
                }
            },
            showRequired:{
                default(){
                    return false
                }
            },
            clearable:{
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
        components: {
        }
    }
</script>