<template>
    <indent-table
      :has-data="tableData.length>0"
      v-model="checkAll"
      :first-loading="true"
      @check="changeAll"
      :body-height="41"
      :width="headsWidth"
      v-loading="loading"
      element-loading-text="玩命加载中..."
      :heads="heads">
      <tbody>
        <template v-for="(item, i) in tableData">
          <tr 
            v-for="(trs ,index) in item.info"
            @click="row_high_light(i)"
            :class="{active:item.isHighLight}"
          >
            <td :rowspan=" item.info.length" v-if="index===0 && true" width="100">
              <el-checkbox v-model="item.isCheck" @change="changeOne"></el-checkbox>
            </td>



            <!-- 日期范围 -->
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
              <span class="click" @click="item_click(item)">{{item.channel_id}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
              <span v-copy>{{item.code}}</span>
            </td>


            <!-- 合并的数据 -->
            <td v-copy width="100">{{trs.seller_name}}</td>
            <td>{{trs.warehouse_type}}</td>


            <td :rowspan=" item.info.length" v-if="index===0" width="100">
              <span>{{item.customer_id}}</span>
            </td>


            <td :rowspan=" item.info.length" v-if="index===0" width="100">
              <times :time="item.create_time"></times>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="200">
                <span v-copy>{{item.name}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span v-copy>{{item.name}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span v-copy>{{item.name}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span v-copy>{{item.name}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span v-copy>{{item.name}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span v-copy>{{item.name}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span v-copy>{{item.name}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span v-copy>{{item.name}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span v-copy>{{item.name}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0" width="100">
                <span v-copy>{{item.name}}</span>
            </td>





          </tr>
        </template>
      </tbody>
    </indent-table>
</template>
<style scoped>
    .active{
      background-color: rgba(173,227,255, 0.5);
    }
    .click {
        color: #3cb5fc;
        cursor: pointer;
    }
</style>
<script>
    export default {
        data() {
            return {
                checkAll: false,
                heads: [
                    {isCheck:true,size:100},
                    {label:'日期范围',size:100, value: 'account_id'},
                    {label:'账号简称',size:100, value: 'account_name'},
                    {label:'站点',size:100, info: [
                        {value: 'id'},
                        {value: 'seller_id'},
                        {value: 'seller_name'},
                        {value: 'warehouse_type'},
                    ]},
                    {label:'销售员',size:100, value: 'channel_name'},
                    {label:'发货类型',size:100, value: 'code'},
                    {label:'订单金额￥',size:100, value: 'create_time'},
                    {label:'亚马逊所收税费￥',size:200, value: 'customer_id'},
                    {label:'促销返点总计￥',size:100, value: 'account_id'},
                    {label:'退款合计￥',size:100, value: 'id'},
                    {label:'退款比例',size:100, value: 'name'},
                    {label:'店铺资金合计￥',size:100, value: 'name'},
                    {label:'营业利润￥',size:100, value: 'name'},
                    {label:'首期预留金额￥',size:100, value: 'name'},
                    {label:'末期预留金额￥',size:100, value: 'name'},
                    {label:'转账金额B￥',size:100, value: 'name'},
                    {label:'转账比例',size:100, value: 'name'},
                ],
                tableData: [
                    {
                        account_id: 3219,
                        account_name: 324,
                        channel_id: 9,
                        channel_name: "shopee",
                        code: "jcmmsg",
                        create_time: 1554865542,
                        customer_id: 292,
                        customer_name: "郑敏",
                        id: 3445,
                        info: [
                            {
                                id: 3445,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 0,
                            },
                            {
                                id: 3418,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 2,
                            },
                            {
                                id: 3418,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 2,
                            }
                        ],
                        name: '占位',
                        name: '占位',
                        name: '占位',
                    },
                    {
                        account_id: 2797,
                        account_name: 324,
                        channel_id: 9,
                        channel_name: "shopee",
                        code: "jcmmsg",
                        create_time: 1554865542,
                        customer_id: 292,
                        customer_name: "郑敏",
                        id: 3445,
                        info: [
                            {
                                id: 3445,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 0,
                            },
                            {
                                id: 3418,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 2,
                            },
                            {
                                id: 3418,
                                seller_id: 11,
                                seller_name: "李倩霞",
                                warehouse_type: 2,
                            }
                        ],
                        name: '占位',
                        name: '占位',
                        name: '占位',
                    }
                ]
            }
        },
        computed:{
            emptyText() {
                return this.firstTime?'等待查询数据中...':'暂无数据'
            },
            headsWidth() {
                return this.heads.reduce((total, cur) => {
                    return total + cur.size
                },0)
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd ", val)
            }
        },
        methods: {
            changeAll(val) {
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                })
                this.$emit('select-change', this.selectData())
            },
            changeOne(){
                if(this.tableData.length>0){
                    this.checkAll=!this.tableData.find(data=>!data.isCheck);
                }
                this.$emit('select-change', this.selectData())
            },
            row_high_light(index){
                this.tableData.forEach(row=>{
                    row.isHighLight = false;
                });
                this.tableData[index].isHighLight = true;
            },
            selectData() {
                return this.tableData.filter(i => i.isCheck)
            },
            item_click(item) {
                this.$emit('item-click',item)
            }
        },
        props:{
            loading:{},
            firstTime:{},
            table:{}
        },
        components: {
            indentTable: require('./indent-table').default
        }
    }
</script>

