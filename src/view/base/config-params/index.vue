<template>
    <page>
        <el-tabs v-model="select" type="card">
            <el-tab-pane label="结构定义" name="define">
                <el-card>
                    <el-button @click.native="add_group" size="mini" type="primary">添加分组</el-button>
                </el-card>
                <struct-define
                        ref="define"
                        @del-group="del_group"
                        @mdf-group="mdf_group"
                        @add-param="add_param"
                        @mdf-param="mdf_param"
                        @del-param="del_param"
                >
                </struct-define>
                <group-edit v-model="showGroup" :group="group"></group-edit>
                <param-edit v-model="showParam" :param="param"></param-edit>
            </el-tab-pane>
            <el-tab-pane label="数据配置" name="config">
                ssssssssssssssssssssssssssssssssssssssssss
            </el-tab-pane>
        </el-tabs>
    </page>
</template>
<style lang="stylus">

</style>
<script>

    import {api_del_group, api_del_param} from '../../../api/config-params';
    export default{
    	page:{},
      refresh(){
    		this.group = {
          id:0,
          code:'',
          title:'',
          remark:'',
          sort:0
        };
          this. param = {
          groupid:0,
          id:0,
          code:'',
          title:'',
          params:{},
          remark:'',
          sort:0
        };
    		this.init();
      },
        data(){
            return{
                select:'define',
                showGroup:false,
                group:{
                    id:0,
                    code:'',
                    title:'',
                    remark:'',
                    sort:0
                },
                showParam:false,
                param:{
                    groupid:0,
                    id:0,
                    code:'',
                    title:'',
                    params:{},
                    remark:'',
                    sort:0
                }
            }
        },
        methods:{
            del_group(group){
                this.$alert(`删除分组《${group.title}》`, '警告',{
                    confirmButtonText: '确定',
                    type:'warning',
                    callback: action => {
                        if('confirm' === action){
                            this.$http(api_del_group, group).then(res=>{
                                this.$message({
                                    type:'success',
                                    message:res.message || res
                                });
                                this.init();
                            }).catch(code=>{
                                this.$message({
                                    type:'error',
                                    message:code.message || code
                                });
                            })
                        }
                    }
                });
            },
            mdf_group(group){
                this.group = window.clone(group);
                this.showGroup = true;
            },
            init(){
                this.$refs.define.init();
            },
            add_group(){
                this.group = {
                    group_id:0,
                    id:0,
                    code:'',
                    title:'',
                    remark:'',
                    sort:0
                };
                this.showGroup = true;
            },
            add_param(group){
                this.param = {
                    group_id:group.id,
                    id:0,
                    code:'',
                    title:'',
                    params:{
                        type:1,
                        data:""
                    },
                    remark:'',
                    sort:0
                };
                this.showParam = true;
            },
            mdf_param(param){
                this.param = window.clone(param);
                this.showParam = true;
            },
            del_param(param){
                this.$alert(`删除参数《${param.title}》`, '警告',{
                    confirmButtonText: '确定',
                    type:'warning',
                    callback: action => {
                        if('confirm' === action){
                            this.$http(api_del_param, param).then(res=>{
                                this.$message({
                                    type:'success',
                                    message:res.message || res
                                });
                                this.init();
                            }).catch(code=>{
                                this.$message({
                                    type:'error',
                                    message:code.message || code
                                });
                            })
                        }
                    }
                });
            }
        },
        components:{
            structDefine:require('./struct-define').default,
            groupEdit:require('./group-edit').default,
            paramEdit:require('./param-edit').default,
        }
    }
</script>
