<template>
    <div class="c-address-management">
        <el-button type="primary" @click="add_address" :disabled="addShow" size="mini" class="mb-xs">添加</el-button>
        <div class="inline c-red mr-md">提示：已添加 <span>{{addressLength}}</span>条地址，还能添加<span>{{addressAdd}}</span>条地址
        </div>
        <ui-table :heads="[
                      {label:'* 收件人',width:8},
                      {label:'* 地址1',width:10},
                      {label:'地址2',width:10},
                      {label:'* 城市',width:6},
                      {label:'* 省/州',width:6},
                      {label:'* 国家',width:10},
                      {label:'邮编',width:10},
                      {label:'* 手机号',width:10},
                      {label:'电话',width:10},
                      {label:'操作',width:10},
                      {label:'是否默认',width:10},
                    ]" :body-height="590">
            <tbody>
            <template v-for="(item,index) in addressData">
                <tr @mouseenter="()=>{$set(item,'show',true)}" @mouseout="()=>{$delete(item,'show')}" :key="index">
                    <td>
                        <div v-if="item.status"><el-input v-model="item.consignee"></el-input></div>
                        <div v-else>
                            <ui-tip :content="item.consignee" :width="98"></ui-tip>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.status"><el-input v-model="item.address"></el-input></div>
                        <div v-else>
                            <ui-tip :content="item.address" :width="98"></ui-tip>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.status"><el-input v-model="item.address2"></el-input></div>
                        <div v-else>
                            <ui-tip :content="item.address2" :width="98"></ui-tip>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.status"><el-input v-model="item.city"></el-input></div>
                        <div v-else>
                            <ui-tip :content="item.city" :width="98"></ui-tip>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.status"><el-input v-model="item.province"></el-input></div>
                        <div v-else>
                            <ui-tip :content="item.province" :width="98"></ui-tip>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.status">
                            <el-select v-model="item.country_code"
                                       placeholder="请选择国家"
                                       filterable clearable>
                                <el-option
                                    :key="item.country_code"
                                    v-for="item in countryList"
                                    :label="item.country_code"
                                    :value="item.country_code"
                                ></el-option>
                            </el-select>
                        </div>
                        <div v-else>
                            <ui-tip :content="item.country_code" :width="98"></ui-tip>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.status">
                            <el-input v-model="item.zipcode" @blur="chinese_verify(item)" :class="[item.color_zipcode?'color':'']"></el-input></div>
                        <div v-else>
                            <ui-tip :content="item.zipcode" :width="98"></ui-tip>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.status"><el-input v-model="item.mobile" @blur="chinese_verify(item)" :class="[item.color_mobile?'color':'']"></el-input></div>
                        <div v-else>
                            <ui-tip :content="item.mobile" :width="98"></ui-tip>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.status"><el-input v-model="item.tel" @blur="chinese_verify(item)" :class="[item.color_tel?'color':'']"></el-input></div>
                        <div v-else>
                            <ui-tip :content="item.tel" :width="98"></ui-tip>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.status === 1">
                            <permission tag="requestButton" :route="apis.url_add_addresses" class="operate" :request="submit(item)">确定</permission>
                            <permission tag="span" :route="apis.url_add_addresses">&nbsp;|&nbsp;</permission>
                            <span class="operate" @click="cancel(item)">取消</span>
                        </div>
                        <div v-if="item.status === 2">
                            <permission tag="requestButton" :route="apis.url_update_addresses" class="operate" :request="update(item)">确定</permission>
                            <permission tag="span" :route="apis.url_update_addresses">&nbsp;|&nbsp;</permission>
                            <span class="operate" @click="cancel(item)">取消</span>
                        </div>
                        <div v-if="item.status === undefined">
                            <span class="operate" @click="modify(item)">修改</span>
                            <permission tag="span" :route="apis.url_delete_addresses">&nbsp;|&nbsp;</permission>
                            <permission tag="span" :route="apis.url_delete_addresses" class="operate" @click="delete_address(item)">删除</permission>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.is_default===1">
                            <el-button :disabled="true" size="mini">当前默认</el-button>
                        </div>
                        <div v-else>
                            <permission tag="ElButton" :route="apis.url_buyer_addresses" type="primary" size="mini" @click.native="set_default(item)">设置默认</permission>
                        </div>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
    </div>
</template>
<style lang="stylus">
    .color{
        .el-input__inner{
            border-color: red;
        }
    }
</style>
<script>
    import {chinese} from '../../../define/validator_reg'
    import {api_add_addresses,api_buyer_addresses,api_delete_addresses,api_update_addresses,
        url_add_addresses,url_update_addresses,url_delete_addresses,url_buyer_addresses,api_get_countrys} from "../../../api/buyer";
    export default{
    	permission:{
            url_add_addresses,
            url_update_addresses,
            url_delete_addresses,
            url_buyer_addresses
        },
        page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'张文宇',
                createTime:'2017-8-5',
                updateTime:'2017-8-22'
            }
        },
        data(){
            return {
                addressData: [],
                countryList: [],
                addressDataOld: {},
                add: false,
                addShow: false,
                buyerId:''
            }
        },
        methods: {
            chinese_verify(val){
                let chinese=/[\u4E00-\u9FA5\uF900-\uFA2D]/g;
                if(val.mobile.match(chinese)){
                	this.$message({type:'error',message:`请不要输入中文!`});
                	val.color_mobile = true;
                }else{
                    val.color_mobile = false;
                }
                if(val.tel.match(chinese)){
                	this.$message({type:'error',message:`请不要输入中文!`});
                	val.color_tel = true;
                }else{
                    val.color_tel = false;
                }
                if(val.zipcode.match(chinese)){
                	this.$message({type:'error',message:`请不要输入中文!`});
                	val.color_zipcode = true;
                }else{
                    val.color_zipcode = false;
                }
            },
            add_address(){
                let obj = {
                    consignee: '',
                    address: '',
                    address2: '',
                    city: '',
                    province: '',
                    country_code: '',
                    mobile: '',
                    tel: '',
                    zipcode: '',
                    is_default: 0,
                    status: 1
                };
                this.addressData.push(obj);
                this.get_countrys();
            },
            submit(item){//保存提交
                if(!item.consignee){
                	this.$message({type:'error',message:`请输入收件人!`});
                }else if(!item.address) {
                    this.$message({type: 'error', message: `请输入地址!`});
                }else if(!item.city) {
                    this.$message({type: 'error', message: `请输入城市!`});
                }else if(!item.province) {
                    this.$message({type: 'error', message: `请输入省/州!`});
                }else if(!item.country_code) {
                    this.$message({type: 'error', message: `请输入国家!`});
                }else if(!item.mobile) {
                    this.$message({type: 'error', message: `请输入手机号!`});
                }else if(item.color_mobile || item.color_tel) {
                    this.$message({type: 'error', message: `请正确填写信息!`});
                }else{
                    let data = window.clone(item);
                    delete item.add;
                    delete item.is_default;
                    if(this.addressId){
                        this.buyerId = this.addressId;
                    }
                    if(this.buyersId){
                        this.buyerId = this.buyersId;
                    }
                    return this.$http(api_add_addresses, {address: data, channel_buyer_id: this.buyerId}).then(res => {
                        this.$delete(item, 'status');
                        this.$set(item, 'id',parseInt(res.id));
                        this.$set(item, 'channel_buyer_id',this.buyerId);
                        this.$message({type: 'success', message: res.message || res});
                        return Promise.resolve()
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    });
                }
            },
            cancel(item){//取消
                switch (item.status) {
                    case 1://add
                        const index = this.addressData.indexOf(item);
                        this.addressData.splice(index, 1);
                        break;
                    case 2://edit
                        let res = this.addressDataOld;
                        item.consignee = res.consignee;
                        item.address = res.address;
                        item.address2 = res.address2;
                        item.city = res.city;
                        item.province = res.province;
                        item.country_code = res.country_code;
                        item.mobile = res.mobile;
                        item.tel = res.tel;
                        item.zipcode = res.zipcode;
                        item.tel = res.tel;
                        item.is_default = res.is_default;
                        item.status = res.status;
                        this.$delete(item, 'status');
                        break;
                }
            },
            update(item){//确定修改
                if(!item.consignee){
                    this.$message({type:'error',message:`请输入收件人!`});
                }else if(!item.address) {
                    this.$message({type: 'error', message: `请输入地址!`});
                }else if(!item.city) {
                    this.$message({type: 'error', message: `请输入城市!`});
                }else if(!item.province) {
                    this.$message({type: 'error', message: `请输入省/州!`});
                }else if(!item.country_code) {
                    this.$message({type: 'error', message: `请输入国家!`});
                }else if(!item.mobile) {
                    this.$message({type: 'error', message: `请输入手机号!`});
                }else if(item.color_mobile || item.color_tel || item.color_zipcode) {
                    this.$message({type: 'error', message: `请正确填写信息!`});
                }else {
                    let data = window.clone(item);
                    delete data.status;
                    delete data.id;
                    delete data.is_default;
                    delete data.create_time;
                    delete data.update_time;
                    delete data.color_mobile;
                    delete data.color_tel;
                    delete data.color_zipcode;
                    return this.$http(api_update_addresses, item.id, {address: data}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.$delete(item, 'status');
                        return Promise.resolve()
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    });
                }
            },
            modify(item){//修改状态
                this.$set(item,'status',2);
                this.get_countrys();
                this.addressDataOld = window.clone(item);
            },
            delete_address(item){
                this.$confirm('您将删除地址信息, 确认此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_addresses, item.id).then(res => {
                        const index = this.addressData.indexOf(item);
                        this.addressData.splice(index, 1);
                        this.$message({type: 'success', message: res.message || res});
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        })
                    })
                }).catch(code => {
                    this.$message({
                        type: 'info',
                        message: `已取消删除!`
                    })
                })
            },
            set_default(item){
                if(this.addressId){
                    this.buyerId = this.addressId;
                }
                if(this.buyersId){
                    this.buyerId = this.buyersId;
                }
                this.$http(api_buyer_addresses, {id: item.id, channel_buyer_id: this.buyerId}).then(res => {
                    this.addressData.forEach(row=>{
                        if(row.is_default===1){
                            row.is_default = 0;
                        }
                    });
                    item.is_default = 1;
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            get_countrys(){
            /*TODO 还要做分页处理*/
                this.$http(api_get_countrys).then(res=>{
                    res.forEach(row=>{
                        this.countryList.push(row);
                    })
                }).catch(code=>{
                    console.log("res",code);
                });
            },
        },
        watch: {
            'addressManagement'(val){
                if (val) {
                    this.addressData = val.data;
                    this.addressData.map(row=>{
                    	row.color_mobile = false;
                    	row.color_tel = false;
                    	row.color_zipcode = false;
                    	return row;
                    });
                }
            },
            'buyersId'(val){
                console.log("buyersId",val);
            	if (val){
            		this.buyerId = val;
                }
            }
        },
        computed: {
            addressLength(){
                let len = this.addressData.length;
                if (len > 0) {
                    return len;
                } else {
                    return 0
                }
            },
            addressAdd(){
                let len = this.addressData.length;
                if (len > 0) {
                    if (3 - len == 0) {
                        this.addShow = true;
                    } else {
                        this.addShow = false;
                    }
                    return 3 - len;
                } else {
                    return 3;
                }
            }
        },
        props: {
            addressManagement: {},
            addressId: {},
            buyersId: {}
        },
        components: {
            uiTable: require("../../../components/ui-table.vue").default,
            uiTip:require('../../../components/ui-tip.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>

