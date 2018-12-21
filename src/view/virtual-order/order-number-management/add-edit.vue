<template>
    <page-dialog :title="action.title"
                 size="small" @open="open"
                 v-model="visible"
                 :close-on-click-modal="false">
        <el-form :model="editData" :rules="rules" ref="editForm" label-width="200px">
            <el-form-item label="平台：" required prop="channel_id">
                <el-select v-model="editData.channel_id" class="width-super" @change="channel_change">
                    <el-option v-for="(item, index) in channelList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账号简称：" required prop="account_id">
                <el-select :disabled="accoutOptions.length<=1"
                           filterable clearable
                           class="width-super"
                           :placeholder="accountPlaceholder"
                           v-model="editData.account_id">
                    <el-option v-for="item in accoutOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
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
                visible: false,
                accountPlaceholder:'请选择平台',
                accoutOptions:[{label:"",value:""}],
                channelList:[],
                newOrder:{},
                rules: {
                    channel_id: [
                        { required: true, message: '请选择平台', trigger: 'change', type:'number', min:1 }
                    ],
                    account_id: [
                        { required: true, message: '请选择账号简称', trigger: 'change blur', type:'number', min:1}
                    ],
                    order_number: [
                        { required: true, message: '请输入虚拟订单号', trigger: 'change blur', type:'string'}
                    ]
                },
            }
        },
        mounted(){
            this.channel_remote();
        },
        methods: {
            open(){
                this.get_account(this.editData.channel_id);
            },
            channel_remote(){
                this.$http(api_get_channel,{}).then(res=>{
                    this.channelList = res;
                }).catch(code=>{
                    this.$message({message:code.message, type:'error'});
                });
            },
            get_account(channel_id){
                if(!channel_id)return this.accoutOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accoutOptions = res;
                    }else{
                        this.accoutOptions = [{label:"",value:""}];
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
                        if(this.action.value === 'add'){
                            this.$http(api_add_order, data).then(res=>{
                                this.newOrder = res.data;
                                this.$emit('newData', this.newOrder);
                                this.$message({type:"success",message:res.message||res});
                                this.$parent.refresh();
                                this.visible = false;
                                return Promise.resolve();
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                this.$reqKey('managementKey',false);
                            })
                        } else {
                            this.$http(api_updata_order, this.editData.id, data).then(res=>{
                                this.newOrder = res.data;
                                this.$emit('newData', this.newOrder);
                                this.$message({type:"success",message:res.message||res});
                                this.$parent.refresh();
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                this.$reqKey('managementKey',false);
                            })
                        }
                    } else {
                        this.$message({type:"error", message:"信息未填写完整！"});
                        return this.$reqKey('managementKey',false);
                    }
                });
            },
            channel_change(){
                this.editData.account_id = '';
                this.accoutOptions = [{label:"",value:""}];
                this.get_account(this.editData.channel_id);
            }
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{},
            action:{},
            editData:{},
            searchData:{}
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
