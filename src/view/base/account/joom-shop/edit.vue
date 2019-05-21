<template>
    <el-row class="p-edit">
        <page-dialog :title="title"
                     v-model="editFormVisible"
                     @open="open"
                     size="small"
                     :close-on-click-modal="false">
            <el-form :model="editData" :rules="rules" ref="editData" label-width="200px">
                <el-form-item label="平台账号：" prop="joom_account_id">
                    <el-col :span="spanWidth">
                        <el-select v-model="editData.joom_account_id"
                                   :disabled="!isAdd"
                                   v-if="!isView">
                            <el-option v-for="(item,i) in accountList"
                                       :key="`${i}c`"
                                       :label="item.label"
                                       :value="item.value"
                            ></el-option>
                        </el-select>
                        <span v-if="isView">{{show_account(editData.joom_account_id)}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="平台店铺：" prop="shop_name">
                    <el-col :span="spanWidth">
                        <el-input v-model="editData.shop_name"
                                  v-if="!isView">
                        </el-input>
                        <span v-if="isView">{{editData.shop_name}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="店铺简称：" prop="code">
                    <el-col :span="spanWidth">
                        <el-input v-model="editData.code"
                                  v-if="!isView">
                        </el-input>
                        <span v-if="isView">{{editData.code}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="商户ID：" prop="merchant_id">
                    <el-col :span="spanWidth">
                        <el-input v-model="editData.merchant_id"
                                  v-if="!isView">
                        </el-input>
                        <span v-if="isView">{{editData.merchant_id || ''}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取Listing数据：">
                    <el-col :span="spanWidth">
                        <el-select v-model="editData.download_listing" v-if="!isView">
                            <el-option v-for="item in dowloadLists"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                        <span v-if="isView">{{editData.download_listing | filterHour}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取Joom订单功能：">
                    <el-col :span="spanWidth">
                        <el-select v-model="editData.download_order" v-if="!isView">
                            <el-option v-for="item in dowloadLists"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                        <span v-if="isView">{{editData.download_order | filterHour}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步发货状态到Joom功能：">
                    <el-col :span="spanWidth">
                        <el-select v-model="editData.sync_delivery" v-if="!isView">
                            <el-option v-for="item in dowloadLists"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <span v-if="isView">{{editData.sync_delivery | filterHour}}</span>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button
                            v-if="!isView && !isAdd"
                            req-key="updateJoom"
                           @click="update_wish"
                           :disabled="canEdit">确定</request-button>
                <request-button
                           req-key="addJoom"
                           v-if="!isView && isAdd"
                           @click="add_wish">确定</request-button>
                <el-button size="mini"
                           :type="!isView?'':'primary'"
                           @click.native="editFormVisible = false">
                    {{!isView ? '取 消':'关 闭'}}
                </el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import  pageDialog from '../../../../components/page-dialog.vue';
    import {api_joom_shop_accounts,api_joom_shop_add,api_joom_shop_update} from '../../../../api/joom'
    export default{
        data(){
            return {
                spanWidth:14,
                editFormVisible:false,
                dowloadLists:[
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
                rules:{
                    joom_account_id:[
                        {required:true,type:'number',message:"平台账号为必填项",trigger:"blur change"},
                    ],
                    shop_name:[
                        {required:true,message:"平台店铺为必填项",trigger:"blur change"},
                    ],
//                    merchant_id:[
//                        {required:true,message:"商户ID为必填项",trigger:"blur change"},
//                    ],
                    code:[
                        {required:true,message:"账号简称为必填项",trigger:"blur change"},
                    ]
                },
                accountList:[],
                accoun_name:"",
            }
        },
        created(){
        },
        methods:{
            open(){
                this.shopList = [];
                this.get_accounts();
            },
            get_accounts(){
            	this.$http(api_joom_shop_accounts).then( res =>{
                    this.accountList = res;
                }).catch( code =>{
                    this.$message({type:"error", message: code.message || code});
                });
            },
            update_wish(){//--------------------更新编辑按钮
                this.$refs.editData.validate((bool)=>{
                    Object.keys(this.editData).forEach(key=>{
                       if(typeof this.editData[key] === 'string'){
                           this.editData[key] = this.editData[key].trim();
                       }
                    });
                    if(bool){
                        let params = window.clone(this.editData);
                        delete params.id;
                        this.$http(api_joom_shop_update,this.editData.id,params).then(res=>{
                            this.$message({
                                type: 'success',
                                message: res.message||res
                            });
                            this.editFormVisible = false;
                            this.$emit('update-wish',this.editData.id,params);
                        }).catch(code=>{
                            this.$message({
                                type: 'error',
                                message: code.message||code,
                            });
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('updateJoom', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('updateJoom',false);
                    }
                });
            },
            add_wish(){//------------------添加按钮
                this.$refs.editData.validate((bool)=>{
                    Object.keys(this.editData).forEach(key=>{
                        if(typeof this.editData[key] === 'string'){
                            this.editData[key] = this.editData[key].trim();
                        }
                    });
                    if(bool){
                        let params = window.clone(this.editData);
                        this.$http(api_joom_shop_add,params).then(res=>{
                            this.$message({type: "success", message: res.message || res});
                            this.editFormVisible = false;
                            let data = res.data;
                            let find = this.accountList.find(row=>row.value === params.joom_account_id);
                            data.account_name = find ? find.label : "";
                            data.is_invalid = true;
                            this.$emit('add-update-wish',data);
                        }).catch(code=>{
                            this.$message({
                                type: 'error',
                                message: code.message||code,
                            });
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addJoom', false);
                            }, 300)
                        });
                    }else{
                        this.$reqKey('addJoom', false);
                    }
                });
            },
            // 过滤账号
            show_account(id){
                let find = this.accountList.find(row=>row.value === id);
                return find ? find.label : "";
            }
        },
        watch:{
            editFormVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.editFormVisible = val;
            },
        },
        computed:{
            canEdit(){//---------------添加按钮禁用
                return !this.editData.code;
            },
            isView(){
                return this.action.name === 'view';
            },
            isAdd(){
                return this.action.name === 'add';
            },
            code(){
            	let find = this.accountList.find(row=>{row.value === this.editData.joom_account_id});
                if(!find){
            		return "";
                }
                return find.label;
            }
        },
        filters:{
            filterHour(val){
                if(!val)return '未启用';
                if(val === 30)return `${Number(val)}分钟`;
                return `${Number(val)/60}小时`
            },
        },
        props:{
            value:{},
            editData:{
                required:true,
                type:Object
            },
            title:{
                required:true,
                type:String
            },
            action:{
                require:true,
                type:Object
            }
        },
        components: {
            pageDialog,
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
