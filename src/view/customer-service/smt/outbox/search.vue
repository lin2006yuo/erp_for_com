<template>
    <div class="p-search-aliexpress-outbox">
        <search-card :params="searchData" :clears="clears" @search="search" @enter="search">
            <el-row>
                <label-buttons label="发送状态：" :buttons="handles" @select="select_handles" v-sf.status></label-buttons>
            </el-row>
            <div class="inline">
                <el-select v-model="searchData.filter_type" placeholder="模糊搜索" class="inline s-width-default"  v-sf.filter_type>
                    <el-option
                            :key="item.value"
                            v-for="item in type"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input  v-model="searchData.filter_text"  :placeholder="`请输入${labels}`"  class="inline s-width-large" v-sf.filter_text></el-input>
                <label class="ml-sm inline">客服账号：</label>
                <!-- <el-select v-model="searchData.customer_id"  placeholder="请选择" class="inline mr-sm s-width-large" filterable v-sf.customer_id>
                    <el-option
                            :key="item.customer_id"
                            v-for="item in options"
                            :label="`${item.realname}/${item.username}`"
                            :value="item.customer_id">
                    </el-option>
                </el-select> -->
                <super-select 
                    class="inline s-width-middle"
                    v-model="searchData.customer_id"
                    v-sf.account_id
                    storageKey="api_customer_smt_outbox"
                    :placeholder="all"
                    :options="options"
                    >
                </super-select>
            </div>
        </search-card>
    </div>
</template>
<style lang="stylus">
.p-search-aliexpress-outbox {
    .el-card {
            overflow:visible !important;
        }
}

</style>
<script>
    import labelButtons from "../../../../components/label-all-buttons.vue"
    import {api_customer, url_outbox_list} from '../../../../api/smt-mail'
    export default{
        permission:{
            url_outbox_list
        },
        data(){
            return {
                all:'全部',
                handles:[
                	{name:"发送成功",value:1},
                    {name:"发送失败",value:0}
                ],
                type:[
                    {label:'订单号',value:'order_id'},
                    {label:'买家账号',value:'buyer_id'}
                ],
                options:[],
                clears:{
                    filter_type:'order_id',
                }
            }
        },
        created(){
        },
        mounted(){
            this.customer();
            this.clears=clone(this.searchData)
        },
        methods: {
            init_status_btn(){
                let curBtn = this.handles;
                this.handles = [];
                this.$nextTick(()=>{
                    this.handles = curBtn;
                });
            },
            select_handles(val){
              this.searchData.status = this.handles[val].value
              this.$emit('refresh')
            },
            customer(){
                this.$http(api_customer).then(res=>{
                    // this.options= [{realname:'全部', username:'All', customer_id:''}, ...res];
                    this.options = res.map((res)=> {
                        return {
                            label: `${res.realname}/${res.username}`,
                            value: res.customer_id
                        }
                    })
                    // this.options.unshift({label:'全部', username:'All', value:''})
                }).catch(code=>{this.$message({type:"error",message:code.message || code})})
            },
            search(){
                this.$emit('refresh')
            },
            clear(){
                this.$emit('clear')
            }
        },
        filters: {},
        watch: {},
        computed: {
            labels(){
              let find=this.type.find(row=>row.value===this.searchData.filter_type)
                return find.label
            }

        },
        props: {
            searchData:{}
        },
        components: {
            labelButtons,
            searchCard:require("../../../../components/search-card.vue").default,
        }
    }
</script>
