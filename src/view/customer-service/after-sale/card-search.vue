<template>
    <div class="c-card-search">
        <search-card :params="form" :clears="clears" @search="search" @enter="search">
            <label-buttons label="来源类型：" class="inline mr-sm" :buttons="sourceList" @select="select_source" v-sf.approve></label-buttons>
            <label-buttons label="审批状态：" class="inline mr-sm" :buttons="approvalList" @select="select_appro" v-sf.approve></label-buttons>
            <label-buttons label="执行状态：" class="inline mr-sm" :buttons="executeList" @select="select_execute" v-sf.status></label-buttons>
            <label-buttons label="销售渠道：" :buttons="channelList" @select="select_channel" v-sf.channel_id></label-buttons>
            <el-select class="s-width-small inline" v-model="form.snType" v-sf.snType>
                <el-option v-for="item in snTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
            <el-input class="inline s-width-middle" :placeholder="`请输入${changeLabel}...`" v-model="form.snText" v-sf.snText></el-input>
            <label class="inline ml-sm">提交人：</label>
            <!-- <scroll v-model="form.submitter" class="inline s-width-default" textAlign="left" :remote="url" :fix-params="fix_params" v-sf.submitter></scroll> -->
                <!-- :placeholder="placeholder" -->
            <super-select 
                class="inline s-width-default"
                remote
                filterable
                clearable
                v-model="form.submitter"
                default-first-option
                storageKey="api_get_account_order_sale"
                :options="options"
                v-sf.submitter
                >
            </super-select>
            <el-select class="inline s-width-small ml-sm" v-model="form.snDate" v-sf.snDate>
                <el-option v-for="item in timeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-date-picker
                    class="inline date"
                    v-model="form.date_b"
                    type="date"
                    placeholder="开始时间"
                    :picker-options="pickerstart"
                    v-sf.date_b
            ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                class="inline mr-sm date"
                v-model="form.date_e"
                type="date"
                placeholder="结束时间"
                :picker-options="pickerend"
                v-sf.date_e
        ></el-date-picker>
        </search-card>
        <!--<el-card class="mb-xs">-->
            <!--<permission tag="ElButton" :route="apis.url_after_sale" class="inline" type="primary" size="mini" @click.native="search">搜索</permission>-->
            <!--<el-button class="inline" size="mini" @click.native="clear_search">清空搜索</el-button>-->
        <!--</el-card>-->
    </div>
</template>
<style lang="stylus">
.c-card-search{
    >div.el-card{
        overflow: inherit;
    }
}
</style>
<script>
    import {
        approval_status,
        execute_status,
        get_channels,
        api_order_sales_source_type_info,
        url_after_sale} from "../../../api/after-sale";
    export default{
        permission:{
            url_after_sale,
        },
        data(){
            return {
                url:config.apiHost+'user',
                inputValue: '',
                executeList:[],
                channelList:[],
                sourceList:[],
                snTypeList:[
                    {label:"订单号",value:"order_num"},
                    {label:"买家ID",value:"buyer_id"},
                    {label:"售后单编号",value:"sale_num"},
                    {label:"订单SKU",value:"sku"}
                ],
                timeList:[
                    {label:"提交时间",value:"submit_time"},
                    {label:"审批时间",value:"approve_time"},
                    {label:"创建时间",value:"create_time"}
                ],
                clears:{},
                page: 1,
                options:[],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.form.date_e){
                            return time.getTime()>this.form.date_e;
                        }else{
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.form.date_b){
                            return time.getTime()<this.form.date_b;
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        created(){
            this.init();
            this.get_source();
            this.get_super_ls()
        },
        mounted(){
                this.clears=clone(this.form)
        },
        methods:{
            get_source(){
                this.$http(api_order_sales_source_type_info).then(res=>{
                    this.sourceList = res.map(row=>({label:row.remark,value:row.code}));
                }).catch(code=>{
                    console.log(code);
                })
            },
            init_status_btn(){
                let executeBtn = this.executeList;
                let channelBtn = this.channelList;
                this.executeList = [];
                this.channelList = [];
                this.$nextTick(()=>{
                    this.executeList = executeBtn;
                    this.channelList = channelBtn;
                });
            },
            init(){
                /*执行状态*/
                if(this.executeList.length<=0){
                    this.$http(execute_status).then(res=>{
                        this.executeList = res.map(row=>{
                            return {
                                label:row.remark,
                                value:row.code
                            }
                        })
                    }).catch(code=>{
                        console.log(code);
                    })
                }
                if(this.channelList.length<=0){
                    /*销售渠道*/
                    this.$http(get_channels).then(res=>{
                        this.channelList = res.map(row=>{
                            return {
                                label:row.remark,
                                value:row.code
                            }
                        })
                    }).catch(code=>{
                        console.log(code);
                    })
                }
            },
//            过滤用户
            fix_params({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snType:'realname',
                    snText:keyword,
                };
            },
            get_super_ls(){
                this.$http(http('GET', this.url, this.fix_params({page:this.page,pageSize:10000,keyword:this.inputValue}))).then(res=>{
                     this.options = res.data.map(row => {
                            return {
                                label: row.company_name || row.realname,
                                value: row.id
                            }
                        })
                })
            },
            select_appro(index,item){
                this.$emit("select-appro",item);
            },
            select_source(index,item){
                this.form.source = item.value;
                this.$emit('select-type');
            },
            select_execute(index,item){
                this.$emit("select-execute",item.value);
            },
            select_channel(index,item){
                this.$emit("select-channel",item.value);
            },
            search(){
                this.$emit("search");
            },
            clear_search(){
                this.$emit("clear-search");
            }
        },
        computed: {
            changeLabel(){
                let find = this.snTypeList.find(res => {
                    return this.form.snType === res.value;
                });
                if (!!find) {
                    return find.label;
                }
            }
        },
        props:{
            form:{
                required:true,
                type:Object,
            },
            approvalList:{
                required:true,
                type:Array,
            }
        },
        components: {
            labelButtons:require('../../../components/label-buttons.vue').default,
            scroll:require('../../../components/scroll.vue').default,
            searchCard:require("../../../components/search-card.vue").default
        }
    }
</script>
