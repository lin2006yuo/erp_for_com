<template>
    <page-dialog v-model="show" size="small"
                 @open="open"
                 :title="title" class="c-shopee-add">
        <el-form ref="form" :model="form" :rules="rules" label-width="220px">
            <el-form-item label="平台账号：" prop="name">
                <el-input v-model="form.name" :disabled="isLook" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="账号简称：" prop="code">
                <el-input v-model="form.code" :disabled="isLook" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="公司名称：" prop="company">
                <el-input v-model="form.company" :disabled="isLook" class="inline"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addshopee" @click="keep('form')" v-if="!isLook">确定</request-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import { api_shopee_list_add,api_shopee_list_edit,api_shopee_list_look,api_shopee_list_update} from "../../../../api/shopee"
    export default{
        data(){
            return{
                show:this.value,
                form:{
                    name:"",
                    code:"",
                    company:"",
                },
                rules: {
                    name: [
                        { required: true, message: '请输入账号名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入账号简称', trigger: 'blur' },
                    ],
                    company: [
                        { required: true, message: '请输入公司名称', trigger: 'blur' },
                        { min: 3, message: '长度最少 3 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        mounted(){
//            this.init();
        },
        methods:{
            open(){
                this.form = {
                    name:"",
                    company:"",
                };
                this.init();
            },
        	init(){
        		let url="";
                if(this.id){
                    if(this.isLook){
                        url = api_shopee_list_look;
                    }else{
                        url = api_shopee_list_edit;
                    }
                    this.$http(url,this.id).then(res=>{
                        this.form.name = res.name;
                        this.form.company = res.company;
                        this.form.code = res.code;
                    }).catch(code=>{
                        this.$message({type:"error", message: code.message || code});
                    })
                }
            },
            // 保存
            keep(formName){
                    this.$refs[formName].validate((valid) => {
                        if (valid){
                            if(this.id){
                                return this.update();
                            }else{
                                return this.add();
                            }
                        } else {
                            this.$reqKey('addshopee',false)
                        }
                    });
            },
            // 添加
            add(){
                let data = {
                    name:this.form.name,
                    company:this.form.company,
                    code:this.form.code,
                }
                Object.keys(data).forEach(key=>{
                    if(typeof data[key] === 'string'){
                        data[key] = data[key].trim();
                    }
                })
                this.$http(api_shopee_list_add,data).then(res=>{
                    this.show = false;
                    let params= res.data;
                    params.total = 0;
                    params.status = params.status === 1 ? true : false;
                    params.platform_status = params.platform_status === 1 ? true : false;
                    this.$emit('add-update-shopee',res.data);
                    this.$message({type:"success",message:"添加成功！"});
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addshopee', false);
                    }, 300)
                })
            },
            // 更新
            update(){
                let data = {
                    name:this.form.name.trim(),
                    company:this.form.company.trim(),
                    code:this.form.code.trim(),
                }
                this.$http(api_shopee_list_update,this.id,data).then(res=>{
                    this.show = false;
                    data.id = this.id;
                    let timestamp = Date.parse(new Date());
                    timestamp = timestamp / 1000;
                    data.update_time = timestamp;
                    this.$emit('add-update-shopee',data);
                    this.$message({type:"success",message:"修改成功！"});
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addshopee', false);
                    }, 300)
                })
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
                required:true,
            },
            isLook:{
            	default(){
            		return false;
                }
            },
            id:{}
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
