<template>
    <page-dialog v-model="show" :title="title">
        <el-form label-width="160px" class="param-edit">
            <el-form-item label="参数CODE：">
                <el-input v-model="param.code" @change="change_code"></el-input>
            </el-form-item>
            <el-form-item label="参数标题：">
                <el-input v-model="param.title"></el-input>
            </el-form-item>
            <el-form-item label="参数类型：">
                <el-select v-model="type">
                    <el-option v-for="type in types"
                               :label="type.label"
                               :value="type.value"
                               :key="type.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数内容：">
                <el-input v-if="type === 1" v-model="data"></el-input>
                <input-format v-else
                              :check="check"
                              v-model="data"
                >
                </input-format>
            </el-form-item>
            <el-form-item label="参数排序：">
                <el-input type="number" v-model="param.sort"></el-input>
            </el-form-item>
            <el-form-item label="参数备注：">
                <el-input type="textarea" v-model="param.remark"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button v-if="edit" size="mini" type="primary" @click.native="save">确定</el-button>
            <el-button v-else size="mini" type="primary" @click.native="add">添加</el-button>
            <el-button size="mini" @click.native="show=false">取消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .param-edit{
        padding-right:160px;
    }
</style>
<script>

    import {api_add_param, api_mdf_param} from '../../../api/config-params';
    import {types} from './define';
    export default{
        data(){
            return{
                show:this.value,
                types:types
            }
        },
        methods:{
            check(val){
                let match = /([\d\w]+):([\d\w]+)/i.exec(val);
                if(match){
                    return Promise.resolve(val)
                }else{
                    return Promise.reject("格式不正确: /([\\d\\w]+):([\\d\\w]+)/i");
                }
            },
            change_code(code){
                if(/[\u4E00-\u9FA5]/.test(code)){
                    this.$message({
                        type:'error',
                        message:'CODE 不允许中文'
                    })
                }
            },
            save(){
                this.$http(api_mdf_param, this.param).then(res=>{
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
                this.$http(api_add_param, this.param).then(res=>{
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
                if(this.param.id > 0){
                    return `编辑参数--${this.param.title}`;
                }else{
                    return `添加参数`;
                }
            },
            edit(){
                return this.param.id > 0;
            },
            type:{
                get(){
                    let params = this.param.params || {};
                    return params.type || 1;
                },
                set(val){
                    if(!this.param.params){
                        this.$set(this.param, 'params', {});
                    }
                    this.$set(this.param.params, 'type', val);
                }
            },
            data:{
                get(){
                    let params = this.param.params || {};
                    return params.data || '';
                },
                set(val){
                    if(!this.param.params){
                        this.$set(this.param, 'params', {});
                    }
                    this.$set(this.param.params, 'data', val);
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            param:{}
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            inputFormat:require('../../../components/input-format.vue').default
        }
    }
</script>
