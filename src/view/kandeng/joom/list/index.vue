<template>
    <page class="p-kandeng">
        <el-tabs v-model="activeName" style="width: 100%;" @tab-click="handleClick">
            <el-tab-pane label="选品刊登" name="1">
                <not-published ref="notPublish"
                               :account-list="accountList"
                               v-if="activeName==='1'"></not-published>
            </el-tab-pane>
            <el-tab-pane label="刊登记录" name="2">
                <record-published ref="record"
                                  :account-list="accountList"
                                  :user-list="userList"
                                  v-if="activeName==='2'"></record-published>
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
    import {api_get_joom_account,} from '../../../../api/joom-set-classify'
    import {api_joom_list_users} from '../../../../api/publish-joom'

    export default{
    	page:{},
        refresh(){
            let refs=['notPublish','record'];
            this.activeName = '1';
//            this.$nextTick(()=>{
//                let name=refs[parseInt(this.activeName)-1];
//                    this.$refs[name].searchData = {
//                        status:1,
//                        nType:"product_id",
//                        nContent:"",
//                        accountType:"short",
//                        accountVal:"",
//                        review_status:"",
//                        enabled:"",
//                        wish_express:"",
//                        ntime:"last_updatede",
//                        start_time:"",
//                        end_time:"",
//                        sell_status:'',
//                        order:"",
//                        order_by:"",
//                        searchPrice:"total",
//                        minPrice:"",
//                        maxPrice:"",
//                    };
//                    this.$refs[name].page = 1;
//                    this.$refs[name].pageSize = 50;
//                    this.$refs[name].init();
//            })
        },
        activated(){
            let refs=['notPublish','record'];
            this.$nextTick(()=>{
                let name=refs[parseInt(this.activeName)-1]
                this.$refs[name]&& this.$refs[name].$refs['table']&&this.$refs[name].$refs['table'].table_resize()
            })
            if(this.activeName==='1'){
                let goods_id = sessionStorage.getItem('joomInfoId');
                if(!!goods_id){
                    let data = this.$refs.notPublish.products;
                    let index = data.findIndex(row=>row.goods_id === parseInt(goods_id));
                    if(index>-1){
                        data.splice(index,1);
                        sessionStorage.setItem('joomInfoId','')
                    }
                }
            }
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
                userList:[]
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
                        if(this.$refs.notPublish) this.$refs.notPublish.listFun();
                        break;
                    case '2':
                        if(this.$refs.record) this.$refs.record.init();
                        break;
                }
            },
            //获取账号列表
            get_accounts(){
            	this.$http(api_get_joom_account).then(res=>{
                    this.accountList = [{label: '全部', value: ''}, ...res.data];
                }).catch(code=>{
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
            notPublished:require("./not-published.vue").default,//选品刊登
            recordPublished:require('./record-published.vue').default,//刊登记录
        }
    }
</script>
