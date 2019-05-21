<template>
    <div>
        <search-card :params="searchData" @search="search" @enter="search" :clears="clears">
            <el-select v-model="searchData.snType" class="inline s-width-default" v-sf.snType>
                <el-option v-for="item in typeList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
            <el-input v-model="searchData.snText" class="inline" v-sf.snText></el-input>
            <label-item label="服务器名称：" class="inline ml-sm">
                <super-select
                    storageKey="order_server"
                    v-model="searchData.server_id"
                    v-sf.server_id
                    :is-paging="true"
                    :options='ipList'
                ></super-select>
                <!--<el-select v-model="searchData.server_id" filterable v-sf.server_id>-->
                    <!--<el-option v-for="item in ipList"-->
                               <!--:key="item.value"-->
                               <!--:label="item.label"-->
                               <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            </label-item>
            <label-item label="平台：" class="inline ml-sm">
                <super-select
                    storageKey="order_channel"
                    class="s-width-middle"
                    v-model="searchData.channel_id"
                    v-sf.channel_id
                    :is-paging="true"
                    :options='channelList'
                ></super-select>
                <!--<select-remote class="s-width-default"-->
                               <!--v-sf.channel_id-->
                               <!--v-model="searchData.channel_id"-->
                               <!--:remote="channel_remote">-->
                <!--</select-remote>-->
            </label-item>
            <label-item label="状态：" class="inline ml-sm">
                <el-select v-model="searchData.status" class="s-width-small" v-sf.status>
                    <el-option v-for="item in statusList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="账号创建人：" class="inline ml-sm mr-sm">
                <scroll-select v-model="accounts"  class="inline s-width-middle"
                               v-sf.account_creator
                               textAlign="left"
                               ref="creater"
                               :remote="urlcreater"
                               :has-all="hasAll"
                               :fix-params="fix_params_account"
                               :fixResult="fix_result_account">
                </scroll-select>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_channel, api_get_server} from '../../../api/buying-management';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        data(){
            return {
                searchData: {
                    channel_id:0,
                    snType:'email',
                    snText:'',
                    status:'',
                    server_id:'',
                    account_creator_name:'全部',
                    account_creator:'',
                    page:1,
                    pageSize:20
                },
                clears:{
                    channel_id:0,
                    snType:'email',
                    snText:'',
                    status:'',
                    account_creator_name:'全部',
                    account_creator:'',
                    page:1,
                    pageSize:20
                },
                channelList:[],
                typeList:[
                    {label:'注册邮箱', value:'email'},
                    {label:'登录用户名', value:'username'}
                ],
                statusList:[
                    {label:'全部', value:''},
                    {label:'正常', value:0},
                    {label:'作废', value:1}
                ],
                urlcreater:'get|user',
                hasAll:true
            }
        },
        mounted(){
            this.init_serverList();
            this.init();
            this.channel_remote();
        },
        methods: {
            ...mapActions({
                set_info:'server-ip/set_info'
            }),
            init(){
                this.$emit('init-data', this.searchData);
            },
            init_serverList(){
                if(this.ipList.length >= 1){
                    this.$http(api_get_server).then(res=>{
                        console.log(res);
                        this.set_info(res.data);
                    }).catch(code=>{
                        console.log(code);
                    })
                }
            },
            channel_remote(){
                this.$http(api_get_channel,{}).then(res=>{
                    this.channelList=[{label:'全部',value:0},...res]
                }).catch(code=>{
                    console.log(code);
                });
            },
            search(){
                this.init();
            },
            //账号参数
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snText:keyword||"",
                    snType:"realname"
                };
            },
            //账号结果
            fix_result_account(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
        },
        computed: {
            ...mapGetters({
                'ipList':'server-ip/search_ipList'
            }),
            accounts:{
                get(){
                    return {label:this.searchData.account_creator_name,
                        value:this.searchData.account_creator}
                },
                set(val){
                    this.searchData.account_creator_name = val.label;
                    this.searchData.account_creator = val.value;
                }
            }
        },
        watch: {},
        props: {},
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default
        },
    }
</script>
