<template>
   <page-dialog v-model="dialog" :title="title" size="large">
      <!--头部-->
      <!--条件组件-->
      <condition-components v-for="(item,index) in basicData.child"
                            class='mb-sm' :key="index"
                            :source-data="item"
                            :show-title="index===0"></condition-components>
      <div slot="footer">
         <el-button @click.native='submit' type="primary" size="mini" class="inline">确定</el-button>
         <el-button @click.native='cancel' size="mini" class="inline">取消</el-button>
      </div>
   </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_virtual_rule_items,api_virtual_rules_resources} from '@/api/api-virtual-rules';
    export default {
        data() {
            return {
                dialog:this.value,
                basicData:[],
            }
        },
        mounted(){
            this.init_items();
        },
        methods:{
            /*左侧数据
            * 初始化条件资源
            */
            init_items(){
                this.$http(api_virtual_rule_items).then(res => {
                    res[0].child.forEach(async row=>{
                        let item = await this.init_resources(row.code);
                        this.$set(row,'detail',item);
                    });
                    this.basicData = res[0];
                    console.log(this.basicData,'this.basicData');
                }).catch(code => {
                    console.log(code,'code');
                })
            },
            /*右侧数据
            *获取条件资源信息
            */
            init_resources(code){
                return this.$http(api_virtual_rules_resources,{code:code}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            /*保存规则
            * */
            submit(){
                this.dialog = false;
            },
            cancel(){
                this.dialog = false;
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            value:{},
            title:{},
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            conditionComponents:require('./condition-components.vue').default,
        }
    }
</script>