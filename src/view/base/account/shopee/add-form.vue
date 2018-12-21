<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="addEditData"
                 :rules="rules"
                 label-width="190px"
                 ref="addEditData">
            <el-form-item label="简称：" prop="code">
                <el-col :span="14">
                    <el-input v-if="edit" v-model="addEditData.code"></el-input>
                    <span v-if="!edit">{{addEditData.code}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="账号名称：" prop="name">
                <el-col :span="14">
                    <el-input v-if="edit" :disabled="isDisabled" v-model="addEditData.name"></el-input>
                    <span v-if="!edit">{{addEditData.name}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="站点：" prop="site">
                <el-col :span="14">
                    <el-select v-if="edit" v-model="addEditData.site">
                        <el-option v-for="item in addEditSiteList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-if="!edit">{{addEditData.site}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="shopId：" prop="shop_id">
                <el-col :span="14">
                    <el-input type="danger" v-if="edit" v-model="addEditData.shop_id"></el-input>
                    <span v-if="!edit">{{addEditData.shop_id}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="partnerId：" prop="partner_id">
                <el-col :span="14">
                    <el-input v-if="edit" v-model="addEditData.partner_id"></el-input>
                    <span v-if="!edit">{{addEditData.partner_id}}</span>

                </el-col>
            </el-form-item>
            <el-form-item label="secretKey：" prop="key">
                <el-col :span="14">
                    <el-input v-if="edit" v-model="addEditData.key"></el-input>
                    <span class="break-word" v-if="!edit">{{addEditData.key}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Shopee订单功能：">
                <el-col :span="14">
                    <el-select v-if="edit" v-model="addEditData.download_order">
                        <el-option v-for="item in crawl"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-if="!edit">{{addEditData.download_order | filterHour}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到Shopee功能：">
                <el-col :span="14">
                    <el-select v-if="edit" v-model="addEditData.sync_delivery">
                        <el-option v-for="item in station"
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
            <el-form-item label="是否Shopee泰国仓发货：">
                <el-col :span="14">
                    <el-select v-if="edit" v-model="addEditData.is_TH">
                        <el-option v-for="item in selectOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <span v-if="!edit">{{+addEditData.is_TH ? '是' : '否'}}</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addFormShopee" v-if="edit" @click.native="keep">确定</request-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .break-word{
        word-wrap:break-word;
    }
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
                    name:[
                        {required: true, message: '账号名称为必填项', trigger: 'change' }
                    ],
                    site:[
                        {required: true, message: '站点为必填项', trigger: 'change'}
                    ],
                    shop_id:[
                        {required: true, message: 'shopId为必填项', trigger: 'change'}
                    ],
                    partner_id:[
                        {required: true, message: 'partnerId为必填项', trigger: 'change'}
                    ],
                    key:[
                        {required: true, message: 'secretKey为必填项', trigger: 'change'}
                    ],
                },
                crawl:[
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                    {label:"5小时",value:300},
                    {label:"6小时",value:360},
                    {label:"8小时",value:480},
                    {label:"10小时",value:600},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440}
                ],
                station:[
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                    {label:"5小时",value:300},
                    {label:"6小时",value:360},
                    {label:"8小时",value:480},
                    {label:"10小时",value:600},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440}
                ],
                downloadList:[
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                ],
                selectOptions:[
                    {label: '否', value: 0},
                    {label: '是', value: 1}
                ]
            }
        },
        methods:{
            open(){

            },
            cloce(){

            },
            keep(){
                this.$refs.addEditData.validate((bool)=>{
                    if(bool){
                        this.$emit('add-shopee');//-------事件抛出
                    }else{
                        setTimeout(() => {
                            this.$reqKey('addFormShopee', false);
                        }, 300)
                    }
                });
            },
        },
        filters:{
            filterHour(val){
                if(!val)return '未启用';
                return `${Number(val)/60}小时`
            }
        },
        computed:{
            isDisabled(){
                return !this.title.includes('添加');
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            addEditData:{
                required:true,
                type:Object
            },
            title:{
            	type:String,
            },
            edit:{
            	type:Boolean,
            },
            addEditSiteList:{
                required:true,
                type:Array
            },
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
