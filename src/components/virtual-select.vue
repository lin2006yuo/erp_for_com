<template>
    <el-select v-model="select" v-if="!edit"
               filterable
               remote
               @change="change"
               :placeholder="placeholder"
               :loading="loading">
        <el-option v-for="option in options"
                   :key="option"
                   :label="option[lab]"
                   :value="option[val]">
        </el-option>
    </el-select>
    <span v-else>
        {{title}}
    </span>
</template>
<style lang="stylus" scoped>
</style>
<script>
    export default{
        data(){
            return{
                loading:false,
                // select:this.newValue(),
                // coptions:this.option()
            }
        },
        methods:{
            change(...argvs){
                this.$emit('change',...argvs);
            },
            option(){
                const find = this.options.find(row=>this.value === row[this.val]);
                return find ? [find] : [];
            },
            newValue(){
                if (!!this.options.find(row => this.value === row[this.val])) {
                    return this.value;
                } else {
                    return '';
                }
            }
        },
        computed:{
            title(){
                const find = this.option().find(row=>row[this.val] === this.value);
                if(find){
                    return find[this.lab];
                }else{
                    return ``
                }
            }
        },
        watch:{
            value(val){
                this.select = val;
            },
            select(val){
                this.$emit('input', val);
            }
        },
        props:{
            value:{
                required:true,
            },
            options:{
                required:true,
                type:Array
            },
            lab:{
                type:String,
                default:'label'
            },
            val:{
                type:String,
                default:'value'
            },
            placeholder:{
                default(){
                    return `请输入选择...`
                }
            },
            edit:{
            }
        },
        components:{
        }
    }
</script>