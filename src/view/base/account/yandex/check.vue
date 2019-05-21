<template>
    <page-dialog v-model="dialog" size="small" :close-on-click-modal="false" :title="title">
        <el-form :model="form" label-width="200px" :rules="rules" ref="form">
            <el-form-item label="简称：" prop="code">
                <el-col :span="14">
                    <span>{{form.code}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="账号名称：" prop="name">
                <el-col :span="14">
                    <span>{{form.account_name}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="账号ID：" >
                <el-col :span="14" >
                    <span>{{form.id}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取yandex订单功能：">
                <el-col :span="14">
                    <span>{{renderBody(form.download_order)}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到yandex功能：">
                <el-col :span="14">
                    <span>{{renderBody(form.sync_delivery)}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Listing功能：">
                <el-col :span="14">
                    <span>{{renderBody(form.download_listing)}}</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button size="mini" class="inline" @click.native="dialog = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                rules:{
                    code:[
                        {required: true, message: '简称为必填项', trigger: 'change'}
                    ],
                    account_name:[
                        {required: true, message: '账号名称为必填项', trigger: 'change' }
                    ],
                },
                dialog:this.value,
                timeList:[
                    {label:"未启用",value:0},
                    {label:'30分钟',value:30},
                    {label:'1小时',value:60},
                    {label:'2小时',value:120},
                    {label:'3小时',value:180},
                    {label:'4小时',value:240},
                    {label:'5小时',value:300},
                    {label:'6小时',value:360},
                    {label:'7小时',value:420},
                    {label:'8小时',value:480},
                    {label:'9小时',value:540},
                    {label:'10小时',value:600},
                    {label:'11小时',value:660},
                    {label:'12小时',value:720},
                    {label:'24小时',value:1440},
                ],
            }
        },
        methods:{
            submit(){
                this.$emit('update');
            },
            renderBody(val) {
                let obj = this.timeList.find(item => item.value === val);  
                if (!!obj) {
                    return obj.label;
                } else {
                    return '';
                }                          
            }
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
            }            
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
            form:{
                type:Object,
                required:true,
            },
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