<template>
    <page-dialog v-model="dialog" size="small" :close-on-click-modal="false" :title="title" @open="open">
        <el-form :model="add_form" label-width="200px" :rules="rules" >
            <el-form-item label="简称：" prop="code">
                <el-col :span="14">
                    <el-input  v-model="add_form.code" ></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号名称：" prop="name">
                <el-col :span="14">
                    <el-input   v-model="add_form.name" ></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Umka订单功能：">
                <el-col :span="14">
                    <el-select  v-model="add_form.download_order"   >
                        <el-option
                                v-for="res in timeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到Umka功能：">
                <el-col :span="14">
                    <el-select  v-model="add_form.sync_delivery"  >
                        <el-option
                                v-for="res in timeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取listing功能：">
                <el-col :span="14">
                    <el-select  v-model="add_form.sync_listing"  >
                        <el-option
                                v-for="res in timeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button   type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
            <el-button size="mini" class="inline" @click.native="dialog = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_umka_add} from '@/api/Umka-account'
    export default {
        data() {
            return {
                rules:{
                    code:[
                        {required: true, message: '简称为必填项', trigger: 'blur'}
                    ],
                    name:[
                        {required: true, message: '账号名称为必填项', trigger: 'blur'}
                    ],
                },
                dialog:this.value,
                timeList:[
                    {label:'未启用',value:0},
                    {label:'1小时',value:60},
                    {label:'2小时',value:120},
                    {label:'3小时',value:180},
                    {label:'5小时',value:300},
                    {label:'6小时',value:360},
                    {label:'8小时',value:480},
                    {label:'10小时',value:600},
                    {label:'12小时',value:720},
                    {label:'24小时',value:1440},
                ],
                add_form:{
                    code:'',
                    name:'',
                    download_order:0,
                    sync_delivery:0,
                    sync_listing:0
                },
            }
        },
        methods:{
            open(){
                this.add_form.code = '';
                this.add_form.name = '';
                this.add_form.download_order = 0;
                this.add_form.sync_delivery = 0;
                this.add_form.sync_listing =0
            },
            submit(){
                this.$http(api_umka_add,this.add_form).then(res=>{
                    this.$message({type:'success',message:res.message||message,duration:1500});
                    setTimeout(()=>{
                        this.dialog = false;
                        this.$emit('search')
                    },1500)
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code,duration:1500})
                })
            },
        },
        computed:{
            isDisabled(){
                return !this.title.includes('添加');
            }
        },
        filters: {
            filterHour(val){
                if(!val)return '未启用';
                return `${Number(val)/60}小时`
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val
            },
        },
        props:{
            value:{},
            title:{
                type:String,
                required:true,
            },
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>