<template>
    <div class="p-search-list">
        <search-card :params="form" :clears="clears" @search="search_list" @enter="search_list">
            <el-row>
                <label-buttons class="inline" label="纠纷类型：" :buttons="type" @select="select_type" v-sf.dispute_type></label-buttons>
                <label-buttons class="inline ml-sm" label="状态：" :buttons="status" @select="select_status" v-sf.status></label-buttons>
            </el-row>
            <select-more-button
                    label="账号："
                    label-width="120"
                    :button-list="accountList"
                    :clearSelect="clearSelect"
                    @query="select_account">
            </select-more-button>
            <!--<label>账号简称：</label>-->
            <!--<el-select v-model="form.account_id" class="inline s-width-default" filterable v-sf.account_id>-->
                <!--<el-option-->
                        <!--:key="item.value"-->
                        <!--v-for="item in accountList"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                <!--</el-option>-->
            <!--</el-select>-->
            <el-select v-model="form.search_key" class="inline ml-sm s-width-default mt-xs"  v-sf.search_key>
                <el-option
                        :key="item.field"
                        v-for="item in search"
                        :label="item.value"
                        :value="item.field">
                </el-option>
            </el-select>
            <el-input class="inline s-width-large" v-model="form.search_val" :placeholder="`请输入${changeLabel}...`" v-sf.search_val></el-input>
            <label class="inline ml-sm">发起时间：</label>
            <el-date-picker type="date" placeholder="开始时间" v-model="form.date_b"  :picker-options="pickerstart" class="inline date" style="width:140px" v-sf.date_b></el-date-picker>&nbsp;--&nbsp;
            <el-date-picker type="date" placeholder="结束时间" v-model="form.date_e" :picker-options="pickerend"  class="inline mr-sm" style="width:140px" v-sf.date_e></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_dispute_types,
        api_dispute_status,
        api_dispute_search,
        api_get_account,

        url_ebay_dispute
    } from '../../../../api/dispute'
    export default{
        permission:{
            url_ebay_dispute
        },
        data(){
            return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.form.date_e){
                            return  time.getTime() > this.form.date_e.getTime()
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.form.date_b){
                            return time.getTime() < this.form.date_b.getTime()
                        }else {
                            return false
                        }
                    }
                },
                type:[],
                status:[],
                search:[],
                accountList:[],
                clears:{
                    search_key: 'request_id'
                },
                clearSelect: false,
            }
        },
        mounted(){
            this.get_type();
            this.get_account();
            this.clears=clone(this.form);
        },
        methods: {
            init_status_btn(){
                let curBtn = this.type;
                let statusesBtn = this.status;
                this.type = [];
                this.status = [];
                this.$nextTick(()=>{
                    this.type = curBtn;
                    this.status = statusesBtn;
                });
            },
            select_account(select) {
                this.form.account_id = select.map(a => a.value).join(',');
                this.$emit('refresh')
            },
            //获取账号数据
            get_account(){
                this.$http(api_get_account,{channel_id:1}).then(res=>{
                    this.accountList = res.account;
                    this.accountList.forEach((row, index) => {
                        if (index < 10) {
                            this.$set(row, 'showSearch', true);
                        } else {
                            this.$set(row, 'showSearch', false);
                        }
                        this.$set(row, 'showDialog', true);
                    });
                }).catch(code=>{
                   this.$message({message:code.message||code,type:'error'})
                })
            },
            //纠纷类型
            get_type(){
                this.$http(api_dispute_types).then(res=>{
                    this.type = res;
                    this.type = this.type.map(row=>{
                        return{label:row.value,value:row.type}
                    });
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            //纠纷状态
            get_status(type){
                this.status = [];
                this.$http(api_dispute_status,{dispute_type:type}).then(res=>{
                    this.status = res;
                    this.status = this.status.map(row=>{
                        return{label:row.value,value:row.status}
                    })
                    this.status.unshift({label:'全部',value:''})
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            //搜索类型
            get_search(type){
                this.search = [];
                this.$http(api_dispute_search,{dispute_type:type}).then(res=>{
                    this.search = res;
                    let find = this.search.find(row=>row.field===this.form.search_key);
                    !find&&(this.form.search_key = 'order_number');
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            //更改纠纷类型
            select_type(val){
                this.form.dispute_type = this.type[val].value;
                this.get_status(this.type[val].value);
                this.get_search(this.type[val].value);
                this.$emit('refresh');
            },
            //更改纠纷状态
            select_status(index){
                this.form.status = this.status[index].value;
                this.$emit('refresh');
            },
            //搜索
            search_list(){
                this.$emit('refresh')
            },
            //清空搜索
            clear_search(){
                this.$emit('clear')
            }
        },
        filters: {},
        watch: {},
        computed: {
            changeLabel(){
                let find = this.search.find(res=>{
                    return this.form.search_key === res.field && this.form.search_key !=='';
                });
                if(!!find){
                    return find.value;
                }else{
                	return ''
                }
            }
        },
        props: {
            form:{}
        },
        components: {
            labelButtons:require('../../../../components/label-all-buttons.vue').default,
            searchCard:require("../../../../components/search-card.vue").default,
            selectMoreButton: require('@/view/entrepot/delivery/select-more-button').default
        }
    }
</script>
