<template>
    <page class="p-kandeng">
        <el-tabs v-model="activeName" style="width: 100%;" @tab-click="handleClick">
            <el-tab-pane label="在售" name="1">
                <sales ref="sales"
                       :account-list="accountList"
                       :user-list="userList"
                       v-if="activeName==='1'"></sales>
            </el-tab-pane>
            <el-tab-pane label="已下架" name="2">
                <sold-out ref="soldOut"
                          :account-list="accountList"
                          :user-list="userList"
                          v-if="activeName==='2'"></sold-out>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>
<style lang="stylus">
    .p-kandeng{
        .has-inline{
            font-size:1.2rem;
            display: inline-block;
            vertical-align: middle;
        }
        .has-mr{
            margin-right: 5px;
        }
    }
</style>
<script>
    import {api_get_joom_account} from '../../../../api/joom-set-classify'
    import {api_joom_list_users} from '../../../../api/publish-joom'
    export default{
        page:{
            devinfo:{
                frontEnd:'何伊莎',
                backEnd:'张冬冬',
                createTime:'2018-1-11',
                updateTime:''
            }
        },
        refresh(){
            let refs=['sales','soldOut'];
            this.activeName = '1';
            this.$nextTick(()=>{
                let name=refs[parseInt(this.activeName)-1];
                    this.$refs[name].searchData = {
                        account_id:"",
                        shop_id:"",
                        create_id:"",
                        review_status:"",
                        min_price:"",
                        max_price:"",
                        variant_enabled:"",
                        status:"",
                        sell_status:"",
                        sectionType:"price",
                        min_time:"",
                        max_time:"",
                        snType:"local_sku",
                        snText:"",
                    };

                this.$refs[name].enabled = 1;
                this.$refs[name].page = 1;
                this.$refs[name].pageSize = 50;
                this.$refs[name].total = 0;
                this.$refs[name].init();
            })
        },
        activated(){
            let refs=['sales','soldOut'];
            this.$nextTick(()=>{
                let name=refs[parseInt(this.activeName)-1];
                this.$refs[name]&& this.$refs[name].$refs['table']&&this.$refs[name].$refs['table'].table_resize();
            })
        },
        data(){
            return{
                activeName:'1',
                btnList:[//----------------------------------------------操作按钮
                    {name:'添加Listing',clickName:'',status:1},
                    {name:'从产品库批量刊登',clickName:'',status:2},
                    {name:'同步Listing',clickName:'',status:3},
                    {name:'上传Listing',clickName:'',status:4},
                    {name:'转移至产品库',clickName:'',status:5},
                    {name:'批量上架',clickName:'putaway',status:6},
                    {name:'批量下架',clickName:'',status:7}
                ],
                options: [//----------------------更多操作按钮
                    {
                    value: '1',
                    label: '批量修改刊登标题',
                    status:1
                }, {
                    value: '2',
                    label: '批量修改销售价',
                    status:2
                }, {
                    value: '3',
                    label: '批量修改运费',
                    status:3
                }, {
                    value: '4',
                    label: '批量修改吊牌价',
                    status:4
                }, {
                    value: '5',
                    label: '批量修改可售数量',
                    status:5
                }, {
                    value: '6',
                    label: '批量修改发货期',
                    status:6
                },],
                accountList:[],
                userList:[],
            }
        },
        created(){//--------------调取list接口
            this.get_accounts();
            this.get_users();
        },
        methods:{
            /**/
            handleClick(val){
                switch (val.name){
                    case '1':
                        if(this.$refs.sales) this.$refs.sales.init();
                        break;
                    case '2':
                        if(this.$refs.soldOut) this.$refs.soldOut.init();
                        break;
                }
            },
            //获取账号列表
            get_accounts(){
            	this.$http(api_get_joom_account).then(res=>{
                    this.accountList = [{label: '全部', value: ''}, ...res.data];
                }).catch(code=>{
                    console.log(code)
                });
            },
            //获取销售员列表
            get_users(){
                this.$http(api_joom_list_users).then(res=>{
                    this.userList = [{label: '全部', value: ''}, ...res.data];
                }).catch(code=>{
                	console.log(code)
                });
            },
        },
        watch:{

        },
        components:{
            sales:require("./sales.vue").default,//选品刊登
            soldOut:require('./sold-out.vue').default,//刊登记录
        }
    }
</script>
