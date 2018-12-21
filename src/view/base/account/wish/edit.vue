<template>
    <el-row class="p-edit">
        <page-dialog :title="title"
                     v-model="editFormVisible"
                     size="small"
                     :close-on-click-modal="false">
            <el-form :model="addEditData" :rules="rules" ref="addEditData" label-width="160px">
                <el-form-item label="店铺名称：">
                    <el-col :span="spanWidth">
                        <el-input v-model="addEditData.shop_name" v-if="curPage!=='lookOver'"></el-input>
                        <span v-else>{{addEditData.shop_name}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="wish用户名：">
                    <el-col :span="spanWidth">
                        <el-input v-model="addEditData.account_name"
                                  :disabled="curPage!=='add'"
                                  v-if="curPage!=='lookOver'">
                        </el-input>
                        <span v-else>{{addEditData.account_name}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="wish商户ID：">
                    <el-col :span="spanWidth">
                        <el-input v-model="addEditData.merchant_id"
                                  :disabled="curPage!=='add'"
                                  v-if="editAble">
                        </el-input>
                        <span v-else>{{addEditData.merchant_id || ''}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="简称：">
                    <el-col :span="spanWidth">
                        <el-input v-model="addEditData.code"
                                  v-if="curPage!=='lookOver'"></el-input>
                        <span v-else>{{addEditData.code}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取wish订单功能：">
                    <el-col :span="spanWidth">
                        <el-select v-model="addEditData.download_order"
                                   v-if="curPage!=='lookOver'">
                            <el-option v-for="item in crawl"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                        <span v-else>{{addEditData.download_order | filterMinute}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步发货状态到wish功能：">
                    <el-col :span="spanWidth">
                        <el-select v-model="addEditData.sync_delivery"
                                   v-if="curPage!=='lookOver'">
                            <el-option v-for="item in ship"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <span v-else>{{addEditData.sync_delivery | filterMinute}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取Wish Listing数据：">
                    <el-col :span="spanWidth">
                        <el-select v-model="addEditData.download_listing"
                                   v-if="curPage!=='lookOver'">
                            <el-option v-for="item in dowloadLists"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"></el-option>
                        </el-select>
                        <span v-else>{{addEditData.download_listing | filterHour}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步健康数据：">
                    <el-col :span="spanWidth">
                        <el-select v-model="addEditData.download_health"
                                   v-if="curPage!=='lookOver'">
                            <el-option v-for="item in dowloadLists"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                        <span v-else>{{addEditData.download_health | filterHour}}</span>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div v-if='curPage!=="lookOver"'>
                    <request-button req-key="addUpdate" :mintime='300' @click="add_update">确定</request-button>
                    <el-button size="mini"  @click.native="editFormVisible = false">关闭</el-button>
                </div>
                <el-button v-else type="primary" size="mini"  @click.native="editFormVisible = false">关闭</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import  pageDialog from '../../../../components/page-dialog.vue';
    import {wish_update, wish_add} from '../../../../api/wish';
    import {phone} from '../../../../define/validator_reg';
    export default{
        data(){
            let checkPhone = (rule, value, callback) => {
                if (value) {
                    !phone.test(value)?callback(new Error('手机格式有误,请重新输入')):callback();
                }else{
                    callback();
                }
            };
            return {
                spanWidth:16,
                editFormVisible:false,
                crawl:[
                    {label:"未启用",value:0},
                    {label:"15分钟",value:15},
                    {label:"30分钟",value:30},
                    {label:"60分钟",value:60}
                ],
                dowloadLists:[
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
                ship:[
                    {label:"未启用",value:0},
                    {label:"15分钟",value:15},
                    {label:"30分钟",value:30},
                    {label:"60分钟",value:60}
                ],
                rules:{
                    account_name:[
                        {required:true,message:"Wish用户名为必填项",trigger:"blur change"},
                    ],
                    password:[
                        {required:true,message:"登录密码为必填项",trigger:"blur change"},
                    ],
                    server:[
                        {required:true,type:'number',message:"服务器IP地址为必填项",trigger:"blur change"},
                    ],
                    phone:[
                        {validator: checkPhone,trigger:"blur change"},
                    ]
                }
            }
        },
        filters:{
            filterHour(val){
                if(!val)return '未启用';
                return `${Number(val)/60}小时`
            },
            filterMinute(val){
                if(!val)return '未启用';
                return `${Number(val)}分钟`
            },
        },
        methods:{
            add_update(){//--------------------更新编辑按钮
                this.$refs.addEditData.validate((bool)=>{
                    Object.keys(this.addEditData).forEach(key=>{
                        if(typeof this.addEditData[key] === 'string'){
                            this.addEditData[key] = this.addEditData[key].trim();
                        }
                    })
                    if(bool){
                        let params = window.clone(this.addEditData);
                        delete params.id;
                        if(this.addEditData.hasOwnProperty('id')){
                            this.$http(wish_update,this.addEditData.id,params).then(res => {
                                this.$message({
                                type: 'success',
                                message: res.message||res
                            });
                            this.editFormVisible = false;
                            this.$emit('add-update',this.addEditData.id,res.data);
                            }).catch(code => {
                                this.$message({
                                    type:'error',
                                    message:code.message||code
                                })
                            }).finally(()=>{
                                this.$reqKey('addUpdate', false);
                            })
                        }else{
                            this.$http(wish_add,params).then(res=>{
                                this.$message({type: "success", message: res.message || res});
                                this.editFormVisible = false;
                                this.$emit('add-update',res.data);
                            }).catch(code=>{
                                this.$message({
                                    type: 'error',
                                    message: code.message||code,
                                });
                            }).finally(()=>{
                                this.$reqKey('addUpdate', false);

                            });
                        }
                    }else{
                            this.$reqKey('addUpdate', false);
                    }
                });
            },
        },
        watch:{
            editFormVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.editFormVisible = val;
            }
        },
        props:{
            value:{},
            addEditData:{
                required:true,
                type:Object
            },
            title:{
                required:true,
                type:String
            },
            editAble:{
                require:true,
                type:Boolean
            },
            curPage:{
                require:true,
                type:String
            }
        },
        components: {
            pageDialog,
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
