<template>
    <page-dialog v-model="show"
                 :inner-style="{width:'600px'}"
                 :title="title">
        <filter-node :filter="filter"
                     :datas="datas"
                     :roleid="roleid"
        >
        </filter-node>
        <div slot="footer">
            <el-button type="primary"
                       size="mini"
                       @click.native="save">
                保存
            </el-button>
            <el-button size="mini"
                       @click.native="show=false;">
                取消
            </el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    import {api_get_node_setting, api_get_node_config, api_get_filter_params, api_set_role_acess, api_get_role_acess} from '../../../api/role';
    export default{
        data(){
            return{
                show:this.value,
                filter:{
                },
                datas:{},
                filterParams:{},
                pageParams:[]
            }
        },
        methods:{
            async save(){
                try{
                    for(const nodeid in this.datas){
                        if(this.datas.hasOwnProperty(nodeid)){
                            await this.$http(api_set_role_acess, this.roleid, nodeid, {filter:this.datas[nodeid]});
                        }
                    }
                    this.$message('保存成功');
                    this.show = false;
                }catch (e){
                    this.$message({type:'error',message:e.message || e});
                }
            },
        },
        computed:{
            title(){
                if(this.node.path){
                    return `给节点：${this.node.path} 设置过滤器`;
                }else{
                    return '';
                }
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            async value(val){
                if(val && this.node.id){
                    let config = await this.$http(api_get_node_config, this.node.id);
                    this.filter = config;
                }
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            node:{
                type:Object
            },
            roleid:{

            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelPanel:require('../../../components/label-panel.vue').default,
            nodeParam:require('./node-param.vue').default,
            filterNode:require('./filter-node.vue').default
        }
    }
</script>