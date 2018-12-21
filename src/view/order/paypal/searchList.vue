<template>
    <div class="paypal-searchList">
        <div>
            <search-card :params="searchData" @search="search_list" @enter="search_list" :clears="clears" @init-params="init_status_btn">
                <el-row>
                    <label-buttons label="订单状态：" :buttons="buttonsData" @select="changeSelect"></label-buttons>
                </el-row>
                <el-select v-sf.snType v-model="searchData.snType" class="inline s-width-default" placeholder="请选择">
                    <el-option
                            v-for="item in selectList1"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                    ></el-option>
                </el-select>
                <el-input v-sf.snText v-model="searchData.snText" :placeholder="`请输入${changeLabel}...`" class="inline mr-sm enter-result" @input="snText"></el-input>

                <el-select v-sf.sel_type v-model="searchData.sel_type"   class="inline s-width-default" placeholder="请选择" @change="search_change">
                    <el-option
                            v-for="item in selectList2"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                    ></el-option>
                </el-select>
                <el-select v-sf.sel_text v-model="searchData.sel_text"   class="inline mr-sm s-width-default" placeholder="请选择" filterable >
                    <el-option
                            v-for="item in listData"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                    ></el-option>
                </el-select>
                <label>收款时间：</label>
                <el-date-picker
                        type="date"
                        v-sf.date_b
                        placeholder="开始时间"
                        v-model="searchData.date_b"
                        class="inline date"
                        :picker-options="pickerStart"
                ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                    type="date"
                    v-sf.date_e
                    placeholder="结束时间"
                    v-model="searchData.date_e"
                    class="inline date mr-sm"
                    :picker-options="pickerEnd"
            ></el-date-picker>
            </search-card>
        </div>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import labelButtons from '../../../components/label-all-buttons.vue';
    import {api_pack_getCurrency,api_pack_transactionType,api_pack_country} from '../../../api/order-paypal'
    export default{
        data(){
            return {
                clears:{
                    page:1,
                    pageSize:50,
                    payment_status:'',
                    snType:'txn_id',
                    snText:'',
                    sel_type:'txn_type',
                    sel_text:'',
                    snDate:'payment_date',
                    date_b:'',
                    date_e:'',
                    sort_field:"",
                    sort_by:""
                },
                selectList1:[
                    {label:"交易号",value:"txn_id"},
                    {label:"商家账号",value:"business"},
                    {label:"付款账号",value:"payer_email"},
                    {label:"item_number",value:"item_number"},
                ],
                selectList2:[
                    {label:"币种",value:"mc_currency"},
                    {label:"付款人国家",value:"address_country"},
                    {label:"交易类型",value:"txn_type"},
                ],
                listData:[],
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return time.getTime()>this.searchData.date_e.getTime();
                        }else{
                            return false;
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return time.getTime()< this.searchData.date_b.getTime();
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        created(){
        },
        mounted(){
            this.selectList();
        },
        methods: {
            init_status_btn(){
                let cur = this.buttonsData;
                this.$parent.buttonsData = [];
                this.$nextTick(()=>{
                    this.$parent.buttonsData = cur;
                })
            },
            changeSelect(val){
                this.searchData.payment_status=this.buttonsData[val].status;
                this.$emit('change-select');
            },
            search_change(){
                this.searchData.sel_text = '';
                this.selectList();
            },
            selectList(){
                this.listData = [];
                if (this.searchData.sel_type === 'mc_currency') {
                    this.$http(api_pack_getCurrency).then(res=>{
                        for (let key in res) {
                            this.listData.push({label:res[key].name,value:res[key].code});
                        }
                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
                    return this.listData;
                } else if(this.searchData.sel_type === 'txn_type') {
                    this.$http(api_pack_transactionType).then(res=>{
                        res.forEach(row=>{
                            this.listData.push({label:row,value:row});
                        })
                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
                    return this.listData;
                } else {
                    this.$http(api_pack_country).then(res=>{
                        res.forEach(row=>{
                            this.listData.push({label:row.name_cn,value:row.name});
                        })

                    }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
                    return this.listData;
                }
            },
            snText(){
                this.searchData.snText=this.searchData.snText.replace(/\s*/g,'')
            },
            search_list(){
            	console.log(this.searchData);
                this.$emit('search-list',this.searchData);
            },
            search_clear(){
                this.$emit('clear')
            }
        },
        filters: {},
        watch: {},
        computed: {
            changeLabel(){
            	let find = this.selectList1.find(res=>{
            		return res.value === this.searchData.snType;
                });
            	if(!!find){
            		return find.label;
                }
            }
        },
        props: {
            buttonsData:{},
            searchData:{}
        },
        components: {
            labelButtons,
            searchCard:require('../../../components/search-card.vue').default
        }
    }
</script>
