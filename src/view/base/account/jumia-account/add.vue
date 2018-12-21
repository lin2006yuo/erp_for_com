<template>
    <page-dialog v-model="show" size="small"
                 @open="open"
                 :title="title" class="c-joom-add">
        <el-form ref="form" :model="form" :rules="rules" label-width="220px">
            <el-form-item label="简称：" prop="code">
                <el-input v-model="form.code" :disabled="isLook" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="账号名称：" prop="account_name">
                <el-input v-model="form.account_name" :disabled="isLook" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="client_id：" prop="client_id">
                <el-input v-model="form.client_id" :disabled="isLook" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="client_secret：" prop="client_secret">
                <el-input v-model="form.client_secret" :disabled="isLook" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="同步发货状态到jumia功能：" prop="sync_delivery">
                <el-select v-model="form.sync_delivery"
                           :disabled="isLook"
                           class="inline mr-sm"
                           filterable>
                    <el-option
                            v-for="res in taskTime"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="抓取jumia订单功能：" prop="download_order">
                <el-select v-model="form.download_order"
                           :disabled="isLook"
                           class="inline mr-sm"
                           filterable>
                    <el-option
                            v-for="res in taskTime"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="抓取Listing功能：" prop="down_listing">
                <el-select v-model="form.download_listing"
                           :disabled="isLook"
                           class="inline mr-sm"
                           filterable>
                    <el-option
                            v-for="res in taskTime"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
                <!--<el-input v-model="form.down_listing" :disabled="isLook" class="inline"></el-input>-->
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addJoom" @click="keep('form')" v-if="!isLook">确定</request-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import { api_joom_list_add,api_joom_list_edit,api_joom_list_look,api_joom_list_update} from "../../../../api/joom"
    import { api_jumia_account_add,api_jumia_account_look,api_jumia_account_edit,api_jumia_account_states} from "../../../../api/jumia-account"
    export default{
        data(){
            return{
                show:this.value,
                form:{
                    code:'',
                    account_name:'',
                    client_id:'',
                    client_secret:'',
                    download_listing:0,
                    sync_delivery:0,
                    download_order:0,
                },
                taskTime:[
                    {label: "未启用", value: 0},
                    {label: "1小时", value: 60},
                    {label: "2小时", value: 120},
                    {label: "3小时", value: 180},
                    {label: "5小时", value: 300},
                    {label: "6小时", value: 360},
                    {label: "8小时", value: 480},
                    {label: "10小时", value: 600},
                    {label: "12小时", value: 720},
                    {label: "24小时", value: 1440},
                ],
                sync_status:[
                    {label:"同步",value:1},
                    {label:"不同步", value:0}
                ],
                rules: {
                    account_name: [
                        { required: true, message: '请输入账号名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入账号简称', trigger: 'blur' },
                    ],
                    // company: [
                    //     { required: true, message: '请输入公司名称', trigger: 'blur' },
                    //     { min: 3, message: '长度最少 3 个字符', trigger: 'blur' }
                    // ],
                }
            }
        },
        mounted(){
//            this.init();
        },
        methods:{
            open(){
                this.form = {
                    code:'',
                    account_name:'',
                    client_id:'',
                    client_secret:'',
                    download_listing:0,
                    sync_delivery:0,
                    download_order:0,
                };
                this.init();
            },
        	init(){
        		let url="";
                if(this.id!==0){
                    // if(this.isLook){
                    //     url = api_jumia_account_look;
                    // }else{
                    //     url = api_joom_list_edit;
                    // }
                    url = api_jumia_account_look;
                    this.$http(url,this.id).then(res=>{
                        this.form = res;
                    }).catch(code=>{
                        this.$message({type:"error", message: code.message || code});
                    })
                }
            },
            // 保存
            keep(formName){
                    this.$refs[formName].validate((valid) => {
                        if (valid){
                            if(this.id!==0){
                                console.log('更新');
                                return this.update();
                            }else{
                                console.log('添加');
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
                    id:this.id,
                    code:this.form.code,
                    account_name:this.form.account_name,
                    client_id:this.form.client_id,
                    client_secret:this.form.client_secret,
                    download_listing:this.form.download_listing,
                    sync_delivery:this.form.sync_delivery,
                    download_order:this.form.download_order,
                }
                Object.keys(data).forEach(key=>{
                   if(typeof data[key] === 'string'){
                       data[key] = data[key].trim();
                   }
                });
                this.$http(api_jumia_account_add,data).then(res=>{
                    this.show = false;
                    let params= res.data;
                    params.total = 0;
                    params.status = params.status === 1 ? true : false;
                    params.platform_status = params.platform_status === 1 ? true : false;
                    this.$emit('add-update-joom',res.data);
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
                    id:this.id,
                    code:this.form.code,
                    account_name:this.form.account_name,
                    client_id:this.form.client_id,
                    client_secret:this.form.client_secret,
                    download_listing:this.form.download_listing,
                    sync_delivery:this.form.sync_delivery,
                    download_order:this.form.download_order,
                }
                Object.keys(data).forEach(key=>{
                   if(typeof data[key] === 'string'){
                       data[key] = data[key].trim();
                   }
                });
                this.$http(api_jumia_account_edit,data).then(res=>{
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
