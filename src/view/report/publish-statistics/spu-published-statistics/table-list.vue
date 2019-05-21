<template>
    <!--<el-table class="scroll-bar"-->
              <!--:data="table.list"-->
              <!--v-resize="{height:41}"-->
              <!--v-loading="loading"-->
              <!--element-loading-text="玩命加载中..."-->
              <!--@sort-change="sort_change"-->
              <!--:default-sort = "{prop: 'total_cnt', order: 'descending'}"-->
              <!--highlight-current-row-->
              <!--@row-click="row_click"-->
    <!--&gt;-->
        <!--<div slot="empty" class="no-data-reminder">-->
            <!--<i></i>-->
            <!--{{ emptyText }}-->
        <!--</div>-->
        <!--<el-table-column label="SPU" prop="spu"></el-table-column>-->
        <!--<el-table-column label="上架时间" prop="publish_time" sortable="custom" width="170">-->

        <!--</el-table-column>-->
        <!--<el-table-column label="所属平台">-->
            <!--<template slot-scope="scope">-->
                <!--{{scope.row.channel_id|channel}}-->
            <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="分类" prop="category_chain" width="170"></el-table-column>-->
        <!--<el-table-column label="开发员" prop="developer_name"></el-table-column>-->
        <!--<el-table-column label="产品状态" prop="sales_status_txt"></el-table-column>-->
        <!--<el-table-column label="刊登总数" prop="total_cnt" sortable="custom"></el-table-column>-->
        <!--<el-table-column label="eBay平台"  inline-template>-->
            <!--<span class="operate" @click="detail(row)">{{row.ebay_cnt}}</span>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="亚马逊平台"  inline-template>-->
            <!--<span class="operate" @click="detail(row)">{{row.amazon_cnt}}</span>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="Wish平台"  inline-template>-->
            <!--<span class="operate" @click="detail(row)">{{row.wish_cnt}}</span>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="速卖通平台" inline-template>-->
            <!--<span class="operate" @click="detail(row)">{{row.aliexpress_cnt}}</span>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="Joom平台" inline-template>-->
            <!--<span class="operate" @click="detail(row)">{{row.joom_cnt}}</span>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="MyMall平台"  inline-template>-->
            <!--<span class="operate" @click="detail(row)">{{row.mymall_cnt}}</span>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="Shopee平台"  inline-template>-->
            <!--<span class="operate" @click="detail(row)">{{row.shopee_cnt}}</span>-->
        <!--</el-table-column>-->
    <!--</el-table>-->

    <div class="c-table-data">
        <ui-table v-loading="loading" :first-loading="firstTime" element-loading-text="玩命加载中..." :has-data="table.list.length>0"
                  class="ebay"  @sort-click="sort_change" :body-height="38"
                  :heads="filterHeads"
        >
            <tbody>
            <template v-for="(data, index) in table.list">
                <tr :class="[clickData[index]?'active-color':'']" @click="addClass(index)" :key="index">
                    <!--SPU-->
                    <td >
                        <ui-tip :content="data.spu" ></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.publish_time" :width="80"></ui-tip>
                    </td>
                    <td>
                        {{data.channel_id|channel}}
                    </td>
                    <td>
                        <ui-tip :content="data.category_chain"></ui-tip>
                    </td>
                    <!--开发员 -->
                    <td>
                        <ui-tip :content="data.developer_name" :width="68"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.sales_status_txt"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.total_cnt"></ui-tip>
                    </td>
                    <template v-for="(row,row_i) in table.list[index].statistics">
                        <td >
                            <span class='operate' @click="detail(data,row)"> {{row.num}}</span>
                        </td>
                    </template>
                </tr>
            </template>
            </tbody>
        </ui-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                channel_id:'',
                clickData:[],
            }
        },
        computed: {
            emptyText() {
                return this.firstTime ? '请查询数据' : '暂无数据'
            },
            filterHeads(){
                let findHeads = this.table.list.find(row=>row.statistics.length>0);
                if(findHeads) {
                    let heads = findHeads.statistics.map(row => {
                        return {
                            label: row.name,
                            width: 4,
                        }
                    });
                    return [
                        // {label: 'SPU', width: 5},
                        // {label:'上架时间',width:5,isSort:true,order_type:'publish_time'},
                        // {label: '开发员', width: 5},
                        {label: 'SPU', width: 5},
                        {label:'上架时间',width:10,isSort:true},
                        {label:'所属平台',width:5},
                        {label:'分类',width:10},
                        {label: '开发员', width: 5},
                        {label:'产品状态',width:5},
                        {label:'刊登总数',width:5,isSort:true},
                        ...heads
                    ]
                }else {
                    return [
                        {label: 'SPU', width: 5},
                        {label:'上架时间',width:10},
                        {label:'所属平台',width:5},
                        {label:'分类',width:10},
                        {label: '开发员', width: 5},
                        {label:'产品状态',width:5}
                    ]
                }
            }
        },
        methods: {
            sort_change(column) {
                this.$emit('sort_c',column);
            },
            detail(val,row){
                this.$emit('get-detail',val,row);
            },
            // row_click(row,e,col){
            //     if(col.label==='亚马逊平台'){
            //         this.channel_id = 2
            //     }else if(col.label==='eBay平台'){
            //         this.channel_id = 1
            //     }else if(col.label==='Wish平台'){
            //         this.channel_id = 3
            //     }else if(col.label==='速卖通平台'){
            //         this.channel_id = 4
            //     }else if(col.label==='Joom平台'){
            //         this.channel_id = 7
            //     }else if(col.label==='MyMall平台'){
            //         this.channel_id = 8
            //     }else if(col.label==='Shopee平台'){
            //         this.channel_id = 9
            //     };
            //     this.$emit('update:c_id',this.channel_id)
            // },
            addClass(index) {
                this.clickData = this.clickData.map(() => {
                    return false
                });
                this.clickData[index] = true
            },
        },
        filters:{
            channel(val){
              switch (val){
                  case 1:
                      return 'Ebay';
                  break;
                  case 2:
                      return '亚马逊';
                  break;
                  case 3:
                      return 'wish';
                  break;
                  case 4:
                      return '速卖通';
                  break;
                  case 7:
                      return 'Joom';
                  break;
                  case 8:
                      return 'mymall';
                  break;
                  case 9:
                      return 'shopee';
                  break
              }
            }
        },
        props:{
            loading:{},
            firstTime:{},
            table:{},
            // c_id:{}
        },
        component:{
            uiTable: require("@/components/ui-table.vue").default,
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>

<style scoped>

</style>
