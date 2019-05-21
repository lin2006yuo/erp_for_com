<template>
    <page-dialog size="large" v-model="show"
                 min-height="600px"
                 tag="红色字体为全局API，无需设置权限"
                 :title="`给角色：${role.name} 设置权限`">
        <node-manager :role="role"
                      ref="nodemanager">
        </node-manager>
        <span slot="footer">
            <request-button req-key='roleRule' @click="save">确定</request-button>
            <el-button size="mini" @click.native="show=false">取消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .tab-role-rule{
        width:100%;
        height:100%;
    }
</style>
<script>

    import {api_set_role_mcas} from '../../../api/role';
    export default{
        data(){
            return{
                show:this.value,
                type:'node',
            }
        },
        mounted(){
        },
        methods:{
            save(){
                let begin = new Date().getTime();
                let result = this.$refs.nodemanager.selectes;
                let end = new Date().getTime();
                this.$message(end - begin);
                this.$http(api_set_role_mcas, this.role.id, result).then(res=>{
                    let en2 = new Date().getTime();
                    this.$message(en2 - end);
                    this.$message({type: "success", message: res.message || res})
                    this.show = false;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('roleRule', false);
                    }, 300)
                })

            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            role:{
                required:true,
                type:Object
            }
        },
        components:{
            nodeManager:require('./node-manager.vue').default,
        }
    }
</script>
