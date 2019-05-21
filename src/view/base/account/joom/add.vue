<template>
    <page-dialog v-model="show" size="small"
                 @open="open"
                 :title="title" class="c-joom-add">
        <el-form ref="form" :model="form" :rules="rules" label-width="220px">
            <el-form-item label="平台账号：" prop="name">
                <el-input v-model="form.name" :disabled="!!id" class="inline"></el-input>
            </el-form-item>
            <el-form-item  label="账号状态："  prop="site_status">
                <el-select class="add_site_status"
                           :disabled="isLook"
                           v-model="form.site_status">
                    <el-option v-for="item in accountStatus"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账号简称：" prop="code">
                <el-input v-model="form.code" :disabled="!!id" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="公司名称：" prop="company">
                <el-input v-model="form.company" :disabled="isLook" class="inline"></el-input>
            </el-form-item>
            <!--<el-form-item label="抓取Joom订单功能：">-->
                <!--<el-col :span="14">-->
                    <!--<el-select v-model="form.download_order">-->
                        <!--<el-option v-for="item in listingOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"-->
                                   <!--:key="item.value"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                <!--</el-col>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="同步发货状态到Joom功能：">-->
                <!--<el-col :span="14">-->
                    <!--<el-select v-model="form.sync_delivery">-->
                        <!--<el-option v-for="item in listingOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"-->
                                   <!--:key="item.value"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                <!--</el-col>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="抓取Joom Listing功能：">-->
                <!--<el-col :span="14">-->
                    <!--<el-select v-model="form.download_listing">-->
                        <!--<el-option v-for="item in listingOptions"-->
                                   <!--:label="item.label"-->
                                   <!--:value="item.value"-->
                                   <!--:key="item.value"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                <!--</el-col>-->
            <!--</el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addJoom" @click="keep('form')" v-if="!isLook">确定</request-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .add_site_status{
        width:150px
    }
</style>
<script>
    import { api_joom_list_add,api_joom_list_edit,api_joom_list_look,api_joom_list_update} from "../../../../api/joom"
    export default{
        data(){
            return{
                show:this.value,
                form:{
                    name:"",
                    code:"",
                    company:"",
                    site_status:''
                },
                accountStatus:[
                    {label:'未分配',value:0},
                    {label:'运营中',value:1},
                    {label:'回收中',value:2},
                    {label:'冻结中',value:3},
                    {label:'申诉中',value:4},
                ],
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
                    site_status: [
                        { required: true, message: '请选择账号状态', trigger: 'change' ,type:'number'},
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
                        url = api_joom_list_look;
                    }else{
                        url = api_joom_list_edit;
                    }
                    this.$http(url,this.id).then(res=>{
                        this.form.name = res.name;
                        this.form.company = res.company;
                        this.form.code = res.code;
                        this.form.site_status=res.site_status;
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
                            this.$reqKey('addJoom',false)
                        }
                    });
            },
            // 添加
            add(){
                let data = {
                    name:this.form.name,
                    company:this.form.company,
                    code:this.form.code,
                    site_status:this.form.site_status,
                };
                Object.keys(data).forEach(key=>{
                    if(typeof data[key] === 'string'){
                        data[key] = data[key].trim();
                    }
                });
                this.$http(api_joom_list_add,data).then(res=>{
                    this.show = false;
                    let params= res.data;
                    params.total = 0;
                    params.status = params.status === 1 ? true : false;
                    this.$emit('add-update-joom',params);
                    this.$message({type:"success",message:"添加成功！"});
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addJoom', false);
                    }, 300)
                })
            },
            // 更新
            update(){
                let data = {
                    name:this.form.name.trim(),
                    company:this.form.company.trim(),
                    code:this.form.code.trim(),
                    site_status:this.form.site_status,
                };
                this.$http(api_joom_list_update,this.id,data).then(res=>{
                    this.show = false;
                    data.id = this.id;
                    let timestamp = Date.parse(new Date());
                    timestamp = timestamp / 1000;
                    data.update_time = timestamp;
                    this.$emit('add-update-joom',data);
                    this.$message({type:"success",message:"修改成功！"});
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addJoom', false);
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
