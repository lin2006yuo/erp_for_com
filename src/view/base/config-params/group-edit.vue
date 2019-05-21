<template>
    <page-dialog v-model="show" :title="title">
        <el-form label-width="160px" class="group-edit">
            <el-form-item label="分组CODE：">
                <el-input v-model="group.code"></el-input>
            </el-form-item>
            <el-form-item label="分组标题：">
                <el-input v-model="group.title"></el-input>
            </el-form-item>
            <el-form-item label="分组排序：">
                <el-input type="number" v-model="group.sort"></el-input>
            </el-form-item>
            <el-form-item label="分组备注：">
                <el-input type="textarea" v-model="group.remark"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button v-if="edit" size="mini" type="primary" @click.native="save">确定</el-button>
            <el-button v-else size="mini" type="primary" @click.native="add">确定</el-button>
            <el-button size="mini" @click.native="show=false">取消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .group-edit{
        padding-right:160px;
    }
</style>
<script>

    import {api_mdf_group, api_add_group} from '../../../api/config-params';
    export default{
        data(){
            return{
                show:this.value,
//                show:true,
            }
        },
        methods:{
            save(){
                this.$http(api_mdf_group, this.group).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message||res
                    });
                    this.show = false;
                    let context = this.$options._parentVnode && this.$options._parentVnode.context;
                    context.init();
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            add(){
                this.$http(api_add_group, this.group).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message||res
                    });
                    this.show = false;
                    let context = this.$options._parentVnode && this.$options._parentVnode.context;
                    context.init();
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        computed:{
            title(){
                if(this.group.id > 0){
                    return `编辑分组--${this.group.title}`;
                }else{
                    return `添加分组`;
                }
            },
            edit(){
                return this.group.id > 0;
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            group:{}
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>
