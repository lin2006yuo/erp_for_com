<template>
    <page class="p-kandeng">
            <el-tabs v-model="activeName" ref="aliexpressPub" style="width: 100%;" @tab-click="handleClick">
                <el-tab-pane label="已刊登" name="1">
                    <has-published :options="options"  ref="published" v-if="activeName==='1'" ></has-published>
                </el-tab-pane>
                <el-tab-pane label="未刊登" name="3">
                    <not-published ref="notPublish" v-if="activeName==='3'"></not-published>
                </el-tab-pane>
                <el-tab-pane label="刊登队列" name="2">
                    <stay-published  :options="options" ref="wait" v-if="activeName==='2'"></stay-published>
                </el-tab-pane>
                <el-tab-pane label="刊登异常" name="4">
                    <timing-published  ref="timing" :options="options" v-if="activeName==='4'"></timing-published>
                </el-tab-pane>
                <el-tab-pane label="草稿箱" name="5">
                    <draft-published  ref="fail" :options="options" v-if="activeName==='5'"></draft-published>
                </el-tab-pane>
            </el-tabs>
    </page>
</template>
<style lang="stylus">
    .p-kandeng{
        .has-inline{
            display: inline-block;
        }
        .has-mr{
            margin-right: 5px;
        }
    }
</style>
<script>
    import hasPublished from './has-published.vue';//已刊登
    import stayPublished from './stay-published.vue';//待刊登
    import notPublished from './not-published.vue';//未刊登
    import timingPublished from './timingTable.vue';//定时刊登
import {
  url_aliexpress_batch_product,
  url_aliexpress_batch_unit,
  url_aliexpress_batch_size,
  url_aliexpress_relation,
  url_aliexpress_batch_price,
  url_ali_custom_template_keep,
  url_edit_ae_stock
} from "../../../../api/publish-smt"
    export default{
        activated(){
            let refs=['published',"wait",'notPublish',"timing","fail"];
            this.$nextTick(()=>{
                let name=refs[parseInt(this.activeName)-1];
                this.$refs[name].callback&&this.$refs[name].callback();
                this.$refs[name]&& this.$refs[name].$refs['table']&&this.$refs[name].$refs['table'].table_resize();
            })
            if(this.activeName==='3'){
                let goods_id = sessionStorage.getItem('aliInfoId');
                if(!!goods_id){
                    let data = this.$refs.notPublish.products;
                    let index = data.findIndex(row=>row.goods_id === parseInt(goods_id));
                    if(index>-1){
                        data.splice(index,1);
                        sessionStorage.setItem('aliInfoId','')
                    }
                }
            }
        },
        beforeDestroy(){
            sessionStorage.setItem("aliSearchData",'');
        },
    	page:{},
        refresh(){
            let refs=['published',"wait",'notPublish',"timing","fail"];
            this.activeName = '1';
            this.$nextTick(()=>{
                let name=refs[parseInt(this.activeName)-1];
                this.$refs[name].searchData = {
                    account_id: "",
                    status: "",
                    snType:"sku",
                    snText: "",
                    local_status: "",
                    start: "",
                    expire_day:"",
                    end: "",
                    order_type:'',
                    order_sort:''
                };
                this.$refs[name].page = 1;
                this.$refs[name].pageSize = 50;
                this.$refs[name].init();
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
                options: [{
                    value: '1',
                    label: '修改刊登标题',
                    status:1,
                    api:url_aliexpress_batch_product
                }, {
                    value: '2',
                    label: '修改销售单位',
                    status:2,
                    api:url_aliexpress_batch_unit
                }, {
                    value: '3',
                    label: '修改包装重量',
                    status:3,
                    api:url_aliexpress_batch_product
                }, {
                    value: '4',
                    label: '修改包装尺寸',
                    status:4,
                    api:url_aliexpress_batch_size
                }, {
                    value: '5',
                    label: '修改产品信息模块',
                    status:5,
                    api:url_ali_custom_template_keep
                }, {
                    value: '6',
                    label: '修改服务模板',
                    status:6,
                    api:url_aliexpress_batch_product
                }, {
                    value: '7',
                    label: '修改运费模板',
                    status:7,
                    api:url_aliexpress_batch_product
                }, {
                    value: '8',
                    label: '修改零售价',
                    status:8,
                    api:url_aliexpress_batch_price
                },{
                    value:'12',
                    label:'修改可售数量',
                    status:12,
                    api:url_edit_ae_stock
                }],
            }

        },
        created(){//--------------调取list接口
        },
        methods:{
            /**/
            handleClick(){
            },

        },
        watch:{

        },
        components:{
            hasPublished,
            stayPublished,
            notPublished,
            timingPublished,
            draftPublished:require("./draft-published.vue").default
        }
    }
</script>
