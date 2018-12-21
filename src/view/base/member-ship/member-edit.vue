<template>
    <div class="p-member-edit">
        <page-dialog v-model='show' size="large" @open="open"
                     :close-on-click-modal="false" :title="title">
            <div>
                <div class="mb-sm" v-if="isAdd">
                    <el-button size="mini" type="primary" @click.native="add_member">添加</el-button>
                    <el-button size="mini" type="primary" @click.native="rem_member">删除</el-button>
                </div>
                <el-table
                        class="scroll-bar"
                        :data="devData"
                        @selection-change="select_change"
                        height="200">
                    <el-table-column
                            type="selection"
                            width="35">
                    </el-table-column>
                    <el-table-column label="平台" inline-template>
                        <div>
                            <ui-select :value="row.channel_id" placeholder="请选择" @input="(val)=>{change_channel(row,val)}">
                                <el-option
                                        :key="item.id"
                                        v-for="item in channel"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </ui-select>
                        </div>
                    </el-table-column>
                    <el-table-column label="账号" inline-template>
                        <div>
                            <ui-params  v-model="row.account_id"
                                        :type="row.type"
                                        :options="row.param">
                            </ui-params>
                        </div>
                    </el-table-column>
                    <el-table-column label="销售员与仓库类型" inline-template width="300">
                        <div>
                            <div v-for='(it,index) in row.info' :key='index'>
                                <param-account
                                        class="inline"
                                        style="width: 100px"
                                        ref="paramSale"
                                        v-model="row.info[index].seller_id"
                                        :param="{type:'sales',data:{content:''}}"
                                        :fixUrl="true"
                                        :fixResult="sale_fix_result"
                                        type="memberShipSales"
                                        url="get|user/:type/staffs">
                                </param-account>
                                <ui-select v-model="row.info[index].warehouse_type"
                                           style="width:150px"
                                           placeholder="请选择"
                                           @change="change_house(row)"
                                           class="inline">
                                    <el-option
                                            :key="item.value"
                                            v-for="item in row.warehouse"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.isCheck">
                                    </el-option>
                                </ui-select>
                                <i class="el-icon-close" v-if="row.info.length>1" @click="del_house(row,index)"> </i>
                                <i class="el-icon-plus" v-if="show_add_icon(row)" @click="add_house(row, $index)"> </i>
                            </div>
                        </div>
                    </el-table-column>
                    <el-table-column label="客服" inline-template>
                        <div>
                            <param-account
                                    ref="paramCustomer"
                                    v-model="row.customer_id"
                                    :param="{type:'customer',data:{content:''}}"
                                    :fixUrl="true"
                                    :fixResult="sale_fix_result"
                                    type="memberShipCustomer"
                                    url="get|user/:type/staffs">
                            </param-account>
                        </div>
                    </el-table-column>
                    <el-table-column label="操作" inline-template v-if="isAdd">
                        <span class="operate" @click="delete_single(row)">删除</span>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer">
              <permission tag="request-button" :route="apis.url_member_add" reqKey="memberEdit"
                          :mintime='300' v-if="isAdd" @click="add_save">确定</permission>
              <permission tag="requestButton" :route="apis.url_member_update" reqKey="updateMember"
                          v-else @click="save">确定</permission>
            <el-button size="mini" @click.native="canel">取消</el-button>
        </span>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
</style>
<script>
    import { api_product_person} from "../../../api/product-class"
    import {api_member_add, api_member_update,api_product_account,api_channels,url_member_add,url_member_update} from "../../../api/member"
    import {mapGetters} from 'vuex';
    export default{
    	  permission:{
          url_member_add,
          url_member_update
        },
        data(){
            return {
                show: false,
                selected: [],
                channel: [],
                sellerData: [],
                customerData: [],
            }
        },
        created(){
        },
        mounted(){
            this.$http(api_channels).then(res => {
                this.channel = res.map(row=>{
                    return {id:row.value,name:row.label}
                });
            }).catch(code => {
                this.$message({
                    type:"error",
                    message: code.message || code
                });
            })
        },
        computed: {
            ...mapGetters({accounts: 'params/channelAccount'}),
            ...mapGetters({getParamAccount:'api/getParamAccount'})
        },
        methods: {
            open(){

            },
            sale_fix_result(res){
                return res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            callback(row){
                return function () {
                    if(!row.channel_id){
                        return true
                    }else {
                        return false
                    }
                }
            },
            add_member(){
                let obj = {
                    channel_id: "",
                    account_id: "",
                    info: [{seller_id: "", warehouse_type: ""}],
                    customer_id: "",
                    id: Date.now(),
                    type:'',
                    param:[],
                    warehouse: [
                        {label: "全部", value: 0, isCheck: false},
                        {label: "本地", value: 1, isCheck: false},
                        {label: "海外", value: 2, isCheck: false},
                    ]
                };
                this.devData.push(obj);
            },
            select_change(sels){
                this.selected = sels;
            },
            isChannel(row){
                if (row.channel_id) {
                    return false;
                }
                return true;
            },
            show_add_icon(row){
                if (row.info.length >= 2) {
                    return false;
                } else {
                    let flag = true;
                    row.info.forEach(item => {
                        if (item.warehouse_type == 0) {
                            flag = false;
                        }
                    });
                    return flag;
                }
            },
            //更改渠道
            change_channel(row,val){
                if(row.channel_id===val){
                    return ;
                }
                row.channel_id=val;
                row.account_id='';
                let find=this.channel.find(item=>{
                    return item.id===val
                });
               if(!row.type||!this.accounts(`channel${find.id}`).length){
                   this.$http(api_product_account, {channel_id:row.channel_id}).then(res => {
                       console.log('res',res);
                       this.$set(row,'param',res.account);
                           row.type=`channel${find.id}`;
                   }).catch(code => {
                       this.$message({type:"error", message: code.message || code});
                   });
               }else {
                   row.type=`channel${find.id}`;
               }
            },
            //获取账号
            get_account(id){
             return this.$http(api_product_account, {channel_id:id}).then(res => {
                    return Promise.resolve(res.account)
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                })
            },
            //多个删除
            rem_member(){
                this.selected.forEach(row => {
                    this.delete_single(row)
                })
            },
            //单个删除
            delete_single(row){
                let index = this.devData.indexOfFun(row, function (old, row) {
                    return old.id === row.id;
                });
                this.devData.splice(index, 1)
            },
            //改变仓库类型
            change_house(row){
                row.warehouse.forEach(item => {
                    item.isCheck = false
                });
                let warehouse = row.info.map(item => {
                    return item.warehouse_type
                });
                if (warehouse.indexOf(0) !== -1) {
                    let index = warehouse.indexOf(0);
                    if (index === 0) {
                        row.info.splice(1, 1)
                    } else {
                        row.info.splice(0, 1)
                    }
                } else {
                    warehouse.forEach(item => {
                        let index = row.warehouse.indexOfFun(old =>{
                            return old.value === item
                        });
                        if (index !== -1) {
                            row.warehouse[index].isCheck = true;
                        }
                    })
                }

            },
            //删除仓库
            del_house(row, index){
                let house = row.info[index].warehouse_type;
                let i = row.warehouse.indexOfFun(house, function (old, house) {
                    return old.value === house;
                });
                if (i !== -1) {
                    row.warehouse[i].isCheck = false;
                }
                row.info.splice(index, 1)
            },
            //添加仓库类型
            add_house(row, index){
                row.info.push({warehouse_type: "", seller_id: ""});
                console.log("test", this.devData[index]);
                this.devData[index].warehouse.forEach(item=>{
                    //item.value
                   let find = this.devData[index].info.find(row=>{
                      return row.warehouse_type === item.value;
                    });
                   if(!!find){
                       item.isCheck = true;
                   }
                })
            },
            delete_single(row){
                let index = this.devData.indexOfFun(row, function (old, row) {
                    return old.id === row.id;
                });
                this.devData.splice(index, 1);
            },
            add_save(){
                if(this.devData.length === 0){
                    this.$message({type:"info", message: "请添加账号"});
                    return this.$reqKey('memberEdit',false);
                }
                let data = window.clone(this.devData);
                data.forEach(row => {
                    delete row.warehouse
                });
                let jurge=data.map(row=>{
                    return row.channel_id+''+row.account_id;
                });
                let repeat=[...new Set(jurge)];
                if(jurge.length!==repeat.length){
                    this.$message({type:"info", message: "同平台请勿添加相同账号"});
                    return this.$reqKey('memberEdit',false);
                }
                delete data.param;
                delete data.type;
                this.$http(api_member_add, {detail: data}).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.show = false;
                    data.forEach((item, index)=>{
                        let findChannel = this.channel.find(row=> {return row.id===item.channel_id});
                        if(!!findChannel){
                            item.channel_id = this.filter_channel(findChannel.name);
                        }
                        item.info.forEach(inner_row=>{
                            inner_row.seller_id = this.getParamAccount("memberShipSales",inner_row.seller_id);
                        });
                        item.account_id = this.getParamAccount("memberShipAccount",item.account_id);
                        item.customer_id = this.getParamAccount("memberShipCustomer",item.customer_id);
                        item.code = !!res.data ? res.data[index].code: '';
                        this.$set(item,'id', !!res.data ? res.data[index].id:'');
                    });
                    this.$emit("add-update",data);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(()=>{
                    this.$reqKey('memberEdit',false);
                })
            },
            save(){
                let data = window.clone(this.devData[0]);
                delete data.warehouse;
                delete data.id;
                delete data.code;
                delete data.type;
                delete data.param;
                this.$http(api_member_update, this.devData[0].id, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.show = false;
                    data.id = res.data[0].id;
                    let findChannel = this.channel.find(row=> {return row.id===data.channel_id});
                    if(!!findChannel){
                        data.channel_id = this.filter_channel(findChannel.name);
                    }
                    data.account_id = res.data[0].code;
                    data.info.forEach(row=>{
                        row.seller_id = this.getParamAccount("memberShipSales",row.seller_id);
                    });
                    data.customer_id = this.getParamAccount("memberShipCustomer",data.customer_id);
                    // 需要返回修改后的新的id
                    this.$emit("add-update",data);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                }).finally(()=>{
                    this.$reqKey('updateMember',false)
                })
            },
            canel(){
                this.show = false
            },
            filter_channel(val){
                switch(val){
                    case "eBay平台":
                        return "ebay";
                        break;
                    case "亚马逊平台":
                        return "amazon";
                        break;
                    case "Wish平台":
                        return "wish";
                        break;
                    case "速卖通平台":
                        return "aliExpress";
                        break;
                }
            }
        },
        filters: {},
        watch: {
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit("input", val)
            },
            devData(val){
                val.forEach((row)=>{
                    if(row.customer_id === 0){
                        row.customer_id = '';
                    }
                    row.info.forEach(item=>{
                        if(item.seller_id === 0){
                            item.seller_id = '';
                        }
                    })
                })
            }
        },
        props: {
            value: {},
            isAdd:{
                required:true,
                type:Boolean
            },
            title:{
                required:true,
                type:String
            },
            devData:{
                required:true,
                type:Array
            }
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            paramAccount:require("../../../api-components/param-account.vue").default,
            uiParams:require("../../../components/ui-params.vue").default,
            uiSelect:require('../../../components/ui-select.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
