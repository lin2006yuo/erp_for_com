<template>
    <page-dialog v-model="dialog" size="large"
                 @open="open" :title="`SPU:${title}侵权下架`"
                 :close-on-click-modal="false">
        <goods-tort-tab v-for="(item,index) in channelData.channel_data"
                        :key="index"
                        :tab-data="item"></goods-tort-tab>
        <div class="mt-sm">
            <div class="ml-md">
                <label>是否需要发送钉钉消息：</label>
                <el-checkbox v-model="channelData.isShow">是</el-checkbox>
            </div>
            <div class="channel-box  mt-sm ml-md mr-md" v-if="channelData.isShow">
                <el-row>
                    <el-checkbox v-model='checkAll' label="全部">全部</el-checkbox>
                    <el-checkbox-group v-model="channelData.notice_channel">
                        <template  v-for="(item,item_index) in channelList">
                            <el-col :span="4">
                                <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
                            </el-col>
                        </template>
                    </el-checkbox-group>
                </el-row>
            </div>
            <div class="ml-md mr-md mt-sm">
                <label class="required-sign">下架原因：</label>
                <el-input
                        class="mt-sm"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        placeholder="请输入下架原因"
                        v-model="channelData.reason">
                </el-input>
            </div>
        </div>
        <div slot="footer">
            <el-button type="primary"
                       @click.native="submit"
                       size="mini" class="inline">确定</el-button>
            <el-button size="mini" class="inline"
                       @click.native="dialog = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .channel-box{
        border:1px solid #ddd;
        padding:15px;
    }
</style>
<script>
    import {api_get_channel,api_account_list} from '@/api/order-local';
    import {api_post_goods_tort} from  "../../../api/product-library"
    export default{
        data(){
            return{
                dialog:this.value,
                channelList:[],
            }
        },
        methods:{
            submit(){
                if(!this.channelData.reason) return this.$message({type:'warning',message:"请填写下架原因!"});
                let length = this.channelData.channel_data.length;
                let channelName = this.channelData.channel_data.map(row=>row.channel_name).join('，');
                this.$confirm(`此操作将在【${channelName}】等${length}个平台，对SPU:【${this.title}】执行侵权下架操作, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = clone(this.channelData);
                    params.channel_data = params.channel_data.map(row=>{
                        let shops = row.isShow?row.shops.map(item=>Number(item.shop_id)):[];
                        return {
                            channel_id:row.channel_id,
                            channel_name:row.channel_name,
                            ban_shop_id:shops
                        }
                    });
                    delete params.isShow;
                    this.$http(api_post_goods_tort,this.id,params).then(res => {
                        let type = res.status===0?'success':'warning';
                        this.$message({type:type,message:res.message||res});
                        this.dialog = false;
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    })
                });
            },
            open(){
                let channel = sessionStorage.getItem('channelList')?JSON.parse(sessionStorage.getItem('channelList')):[];
                if(channel&&channel.length>0){
                    this.channelList = channel
                }else{
                    this.get_channel();
                }
                if(this.channelData&&this.channelData.channel_data){
                    this.channelData.channel_data.forEach(async row=>{
                        let curAccount = [];
                        let allAccountList = sessionStorage.getItem('allAccountList');
                        if(allAccountList&&JSON.parse(allAccountList)[row.channel_id]&&JSON.parse(allAccountList)[row.channel_id].length>0){
                            curAccount = JSON.parse(allAccountList)[row.channel_id];
                            if(row.shops&&row.shops.length){
                                row.shops.forEach(item=>{
                                    let find = curAccount.find(it=>it.value===Number(item.shop_id));
                                    if(find){
                                        this.$set(item,'name',find.label);
                                        this.$set(item,'isDisabled',true);
                                    }
                                })
                            }
                            this.$set(row,'curAccount',curAccount);
                        }else{
                            await this.get_account(row.channel_id).then(curAccount=>{
                                if(!curAccount.account)return this.$message({type:'warning',message:'侵权下架-》平台账号数据为空'})
                                if(row.shops&&row.shops.length){
                                    row.shops.forEach(item=>{
                                        let find = curAccount.account.find(it=>it.value===Number(item.shop_id));
                                        if(find){
                                            this.$set(item,'name',find.label);
                                            this.$set(item,'isDisabled',true);
                                        }
                                    })
                                }
                                this.$set(row,'curAccount',curAccount.account);
                            })
                        }
                    });
                }
            },
            get_account(channel_id){
                return this.$http(api_account_list,{channel_id:channel_id}).then(res => {
                    let allAccountList = sessionStorage.getItem('allAccountList')?JSON.parse(sessionStorage.getItem('allAccountList')):{};
                    allAccountList[channel_id] = res.account;
                    sessionStorage.setItem('allAccountList',JSON.stringify(allAccountList));
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            get_channel(){
                this.$http(api_get_channel).then(res => {
                    this.channelList = res;
                    sessionStorage.setItem('channelList',JSON.stringify(res));
                }).catch(code => {
                    this.$message({type:'error',message:code.mesage||code});
                })
            },
        },
        computed:{
            checkAll:{
                get(){
                    if(this.channelData && this.channelData.notice_channel){
                        return this.channelData.notice_channel.length===this.channelList.length
                    }
                },
                set(val){
                    if(val){
                        let list = this.channelList.map(row=>row.value);
                        this.channelData.notice_channel = list;
                    }else{
                        this.channelData.notice_channel = [];
                    }
                }
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            id:{
                required:true
            },
            value:{
                type:Boolean,
                required:true
            },
            channelData:{
                type:Object,
                required:true
            },
            title:{
                type:String,
                required:true
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            goodsTortTab:require('./goods-tort-tab.vue').default,
        }
    }
</script>