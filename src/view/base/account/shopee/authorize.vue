<template>
    <el-row class="p-authorize">
        <page-dialog :title="title" size="small" v-model="show" @open="open">
            <el-form :model="authorizeData" label-width="160px" ref="form" :rules=rules>
                <el-form-item label="简称：" prop="code">
                    <el-col :span="15">
                    <el-input v-model="authorizeData.code"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="账号名称：" prop="name">
                    <el-col :span="15">
                    <el-input v-model="authorizeData.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="站点：" prop="site">
                    <el-col :span="15">
                        <el-select v-model="authorizeData.site">
                            <el-option v-for="item of addEditSiteList"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="shopId：" prop="shop_id">
                    <el-col :span="15">
                    <el-input v-model="authorizeData.shop_id"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="partnerId：" prop="partner_id">
                    <el-col :span="15">
                        <el-input v-model="authorizeData.partner_id"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="secretKey：" prop="key">
                    <el-col :span="15">
                    <el-input v-model="authorizeData.key"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="update_authorize">确定</el-button>
                <el-button size="mini" @click="close">取消</el-button>
            </div>
        </page-dialog>

    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import {api_shopee_permit} from '@/api/shopee.js'
    export default{
        data(){
            return{
                rules:{
                    code:{required:true, message: '必填项不能为空', trigger: 'change'},
                    name:{required:true, message: '必填项不能为空', trigger: 'change'},
                    site:{required:true, message: '必填项不能为空', trigger: 'change'},
                    shop_id:{required:true, message: '必填项不能为空', trigger: 'change'},
                    partner_id:{required:true, message: '必填项不能为空', trigger: 'change'},
                    key:{required:true, message: '必填项不能为空', trigger: 'change'},
                },
                show:false,
            }
        },
        computed:{
            title(){
                return `给账号 : ${this.accountName}授权`
            }
        }
        ,
        methods:{
            open(){},
            update_authorize(){
                this.$refs['form'].validate(valid=>{
                    if(valid){
                        this.$http(api_shopee_permit,this.authorizeData)
                            .then(res=>{
                                this.$message({type:'success',message:'授权成功'});
                                this.show=false;
                                this.$emit("status-change");
                                this.clean();
                            })
                            .catch(error=>{
                                this.$message({type:'error',message:error.message||error});
                            })
                    }
                    else{
                        return false;
                    }
                })   
            },
//  -----------------------------------清空表单数据
            clean(){    
                Object.keys(this.authorizeData).forEach(item=>{
                    this.authorizeData[item]='';
                })
            },
            close(){
                this.show = false;
                this.clean();
            }
        },
        watch:{
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
            },
            accountName:{},
            addEditSiteList:{},
            authorizeData:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default
        }
    }
</script>