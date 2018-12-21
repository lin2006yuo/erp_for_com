<template>
    <page-dialog v-model="dialog" size="small" :close-on-click-modal="false" :title="title">
        <el-form :model="form" label-width="200px" :rules="rules" ref="form" style="margin: 0 auto">
            <el-form-item label="简称：" prop="code">
                <el-col :span="14">
                    <el-input v-if="curPage === 'add'" v-model="form.code"></el-input>
                    <span v-else>{{form.code}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="账号名称：" prop="account_name">
                <el-col :span="14">
                    <el-input v-if="curPage === 'add'" :disabled="curPage!=='add'" v-model="form.name"></el-input>
                    <span v-else>{{form.name}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="拼多多商户ID：" prop="form_id">
                <el-col :span="14" >
                    <el-input v-model="form.id"
                              :disabled="curPage!=='add'"
                              >
                    </el-input>
                    <!--<span v-else>{{form.id || ''}}</span>-->
                </el-col>

            </el-form-item>
            <el-form-item label="抓取PDD订单功能：">
                <el-col :span="14">
                    <el-select v-if="curPage === 'add'" v-model="form.download_order" default-first-option filterable >
                        <el-option
                                v-for="res in timeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                    <span v-else>{{form.download_order | filterHour}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到PDD功能：">
                <el-col :span="14">
                    <el-select v-if="curPage === 'add'" v-model="form.sync_delivery" default-first-option filterable >
                        <el-option
                                v-for="res in timeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                    <span v-else>{{form.sync_delivery | filterHour}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Listing功能：">
                <el-col :span="14">
                    <el-select v-if="curPage === 'add'" v-model="form.download_listing" default-first-option filterable >
                        <el-option
                                v-for="res in timeList"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>
                    <span v-else>{{form.download_listing | filterHour}}</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button  v-if="curPage === 'add'" type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
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
                        {required: true, message: '简称为必填项', trigger: 'blur'}
                    ],
                    account_name:[
                        {required: true, message: '账号名称为必填项', trigger: 'blur' }
                    ],
                    form_id:[
                        {required: true, message: '商户ID为必填项', trigger: 'blur' }
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
            }
        },
        methods:{
            submit(){
                this.$emit('update');
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
            }
        },
        props:{
            hiddenId:{},
            value:{},
            form:{
                type:Object,
                required:true,
            },
            curPage:{
                type:String,
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