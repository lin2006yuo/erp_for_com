<template>
    <page-dialog :title="editData.title"
                 size="small"
                 @open="open"
                 v-model="visible"
                 :close-on-click-modal="false">
        <el-form :model="editData" :rules="rules" ref="editForm" label-width="200px">
            <el-form-item label="平台：" required prop="channel_id">
                <super-select
                    storageKey="order_channel"
                    v-model="editData.channel_id" class="width-super" @change="channel_change"
                    :is-paging="true"
                    :options='channelList'
                ></super-select>
                <!--<el-select v-model="editData.channel_id" class="width-super" @change="channel_change">-->
                    <!--<el-option v-for="(item, index) in channelList"-->
                               <!--:key="index"-->
                               <!--:label="item.label"-->
                               <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            </el-form-item>
            <el-form-item label="账号简称：">
                <super-select
                    storageKey="order_account"
                    class="width-super"
                    v-model="editData.account_id"
                    :disabled="accountOptions.length===0"
                    :placeholder="'请选择或输入搜索...'"
                    :is-paging="true"
                    :options='accountOptions'
                ></super-select>
                <!--<el-select :disabled="accountOptions.length===0"  旧版-->
                           <!--filterable-->
                           <!--clearable-->
                           <!--remote-->
                           <!--class="width-super"-->
                           <!--:remote-method="remoteMethod"-->
                           <!--placeholder="请选择或输入搜索..."-->
                           <!--v-model="editData.account_id">-->
                    <!--<el-option v-for="item in accountOptions"-->
                               <!--:label="item.label"-->
                               <!--:value="item.value"-->
                               <!--:key="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            </el-form-item>
            <el-form-item label="订单号：" required prop="order_number">
                <el-input type="textarea" class="width-super"
                          placeholder="多个订单号请使用空格或换行隔开"
                          :autosize="{ minRows: 6, maxRows: 10}"
                          v-model="editData.order_number"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <request-button req-key='managementKey' @click="save" :mintime="300">保存</request-button>
            <el-button @click.native="visible = false" size="mini">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_channel, api_account_list, api_add_order, api_updata_order} from '../../../api/order-number-management'
    export default {
        data(){
            return {
                visible: this.value,
                accountOptions:[],
                accountLists:[],
                rules: {
                    channel_id: [
                        { required: true, message: '请选择平台', trigger: 'change', type:'number', min:1 }
                    ],
                    order_number: [
                        { required: true, message: '请输入虚拟订单号', trigger: 'change blur', type:'string'}
                    ]
                }
            }
        },
        methods: {
            open(){
                if(this.editData.channel_id===''){
                    this.accountOptions = [];
                    this.accountLists = [];
                }
            },
            remoteMethod(query){
                if (query !== '') {
                    this.accountOptions = this.accountLists.filter(item => {
                        return typeof query === 'string' ?item.label.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1:item.value === query;
                    });
                } else {
                    this.accountOptions = this.accountLists.length>100? this.accountLists.filter((row,index)=>index<100) : this.accountLists;
                }
            },
            get_account(channel_id){
                if(!channel_id){
                    this.accountOptions = [];
                    this.accountLists = [];
                    return
                }
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accountLists = window.clone(res);
                        this.accountOptions = this.accountLists.length>100? this.accountLists.filter((row,index)=>index<100) : res;
                    }else{
                        this.accountOptions = [];
                        this.accountLists = [];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            save(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let data = {
                            channel_id: this.editData.channel_id,
                            account_id: this.editData.account_id,
                        };
                        if(this.editData.order_number){
                            let order_number = this.editData.order_number.replace(new RegExp(' ','gm'), '\n');
                            let orderList = order_number.split('\n').filter(row=>!!row).map(row=>row.trim());
                            this.$set(data,'order_number',JSON.stringify(orderList));
                        }else{
                            this.$set(data,'order_number','');
                        }
                        if(this.editData.type === 'add'){
                            this.$http(api_add_order, data).then(res=>{
                                this.$emit('update', res.data, 'add');
                                this.$message({type:"success",message:res.message||res});
                                this.visible = false;
                                return Promise.resolve();
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                this.$reqKey('managementKey',false);
                            })
                        } else {
                            this.$http(api_updata_order, this.editData.id, data).then(res=>{
                                this.$emit('update', res.data, 'edit');
                                this.$message({type:"success",message:res.message||res});
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                this.$reqKey('managementKey',false);
                            })
                        }
                    } else {
                        this.$message({type:"warning", message:"信息未填写完整！"});
                        return this.$reqKey('managementKey',false);
                    }
                });
            },
            channel_change(){
                this.editData.account_id = '';
                this.accountOptions = [];
                this.get_account(this.editData.channel_id);
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
            'editData.channel_id':{
                immediate:true,
                handler(val){
                    if(val){
                        this.get_account(val);
                    }
                }
            }
        },
        props: {
            value:{
                required:true,
                type:Boolean
            },
            channelList:{
                required:true,
                type:Array
            },
            action:{},
            editData:{
                required:true,
                type:Object
            }
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
            orderInput:require('@/components/order-input.vue').default,
        },
    }
</script>
