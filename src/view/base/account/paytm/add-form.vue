<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="addEditData"
                 :rules="rules"
                 label-width="190px"
                 ref="addEditData">
            <el-form-item label="账号类型：">
                <el-col :span="14">
                    <el-select v-if="edit" v-model="addEditData.mode" :disabled="isDisabled">
                        <el-option v-for="item in typeOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-if="!edit">{{addEditData.mode === 0 ? '本地仓' : '海外仓' }}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="简称：" prop="code">
                <el-col :span="14">
                    <el-input v-if="edit" v-model="addEditData.code" disabled></el-input>
                    <span v-if="!edit">{{addEditData.code}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="账号名称：" prop="account_name">
                <el-col :span="14">
                    <el-input v-if="edit" :disabled="isDisabled" v-model="addEditData.account_name"></el-input>
                    <span v-if="!edit">{{addEditData.account_name}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Paytm订单功能：">
                <el-col :span="14">
                    <el-select v-if="edit" v-model="addEditData.download_order">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-if="!edit">{{addEditData.download_order | filterHour}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到Paytm功能：">
                <el-col :span="14">
                    <el-select v-if="edit" v-model="addEditData.sync_delivery">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-if="!edit">{{addEditData.sync_delivery | filterHour}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Listing数据：">
                <el-col :span="14">
                    <el-select v-if="edit" v-model="addEditData.download_listing">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-if="!edit">{{addEditData.download_listing | filterHour}}</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button v-if="edit" req-key="addFormpaytm" :timeout="300"
                            @click.native="keep" type="primary">确 定</request-button>
            <el-button v-if="edit" size="mini" @click.native="show=false">取 消</el-button>
            <el-button v-if="!edit" size="mini" @click.native="show=false">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    code:[
                        {required: true, message: '简称为必填项', trigger: 'change'}
                    ],
                    account_name:[
                        {required: true, message: '账号名称为必填项', trigger: 'change' }
                    ],
                },
                typeOptions: [
                    {label: '本地仓', value: 0},
                    {label: '海外仓', value: 1}
                ],
                downloadList:[
                    {label:"未启用",value:0},
                    {label: "30分钟", value: 30},
                    {label: "1小时", value: 60},
                    {label: "2小时", value: 120},
                    {label: "3小时", value: 180},
                    {label: "4小时", value: 240},
                    {label: "5小时", value: 300},
                    {label: "6小时", value: 360},
                    {label: "7小时", value: 420},
                    {label: "8小时", value: 480},
                    {label: "9小时", value: 540},
                    {label: "10小时", value: 600},
                    {label: "11小时", value: 660},
                    {label: "12小时", value: 720},
                    {label: "24小时", value: 1440}
                ],
            }
        },
        methods:{
            open(){

            },
            close(){
                Object.keys(this.addEditData).forEach(key=>{
                    this.addEditData[key] = "";
                });
            },
            keep(){
                this.$refs.addEditData.validate((bool)=>{
                    if(bool){
                        this.$emit('add-paytm');//-------事件抛出
                    }else{
                        setTimeout(() => {
                            this.$reqKey('addFormpaytm', false);
                        }, 300)
                    }
                });
            },
        },
        computed:{
            isDisabled(){
                return !this.title.includes('添加');
            },
        },
        filters:{
            filterHour(val){
                if(!val)return '未启用';
                if(val === 30)return `${Number(val)}分钟`;
                return `${Number(val)/60}小时`
            },
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
            addEditData:{
                required:true,
                type:Object,
            },
            value:{
                required:true,
                type:Boolean
            },
            title:{
                type:String
            },
            edit:{
                type:Boolean
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
