<template>
  <page-dialog class="p-history" title="历史数据" v-model="visible" size="large" :close-on-click-modal="false">
    <p>wish账号：{{monitoringData.username}}&nbsp;&nbsp;&nbsp;账号简称：{{!!monitoringData.account?monitoringData.account.code:''}}</p>
    <el-table class="mt-sm scroll-bar" border style="width: 100%"
              v-loading="loading" element-loading-text="拼命加载中"
              :data="tableList">
      <el-table-column
        inline-template
        width="180px"
        show-overflow-tooltip
        label="抓取日起">
        <span>{{row | times}}</span>
      </el-table-column>
      <el-table-column
        inline-template
        width="80px"
        show-overflow-tooltip
        label="仿品率">
        <span>{{!!row.counterfeit_rate?row.counterfeit_rate*100+'%':''}}</span>
      </el-table-column>
      <el-table-column
        inline-template
        show-overflow-tooltip
        width="100px"
        label="有效跟踪率">
        <span>{{!!row.valid_tracking_rate?(row.valid_tracking_rate*100).toFixed(2)+'%':''}}</span>
      </el-table-column>
      <el-table-column
        inline-template
        show-overflow-tooltip
        width="100px"
        label="延迟发货率">
        <span>{{!!row.late_confirmed_fulfillment_rate?row.late_confirmed_fulfillment_rate*100+'%':''}}</span>
      </el-table-column>
      <el-table-column
        inline-template
        show-overflow-tooltip
        width="100px"
        label="30天平均评分">
        <span>{{row.average_rating}}</span>
      </el-table-column>
      <el-table-column
        inline-template
        width="120px"
        show-overflow-tooltip
        label="63-93天内退款率">
        <span>{{!!row.refund_rate?row.refund_rate*100+'%':''}}</span>
      </el-table-column>
      <el-table-column
        inline-template
        show-overflow-tooltip
        label="在途金额">
        <span>{{row.valid_money}}</span>
      </el-table-column>
      <el-table-column
        inline-template
        show-overflow-tooltip
        label="到款时间">
        <span>{{row.valid_money_time}}</span>
      </el-table-column>
      <el-table-column
        inline-template
        width="120px"
        show-overflow-tooltip
        label="待确认配送金额">
        <span>{{row.unvalid_money}}</span>
      </el-table-column>
    </el-table>
    <div class="t-right card">
      <el-button size="mini" @click="visible=false">关闭</el-button>
    </div>
  </page-dialog>
</template>

<style lang="stylus">
.font-color{
  color:red;
}
</style>
<script>
  import {api_wish_history_health_data} from '../../../api/account-monitoring'
  export default{
    page: {},
    refresh(){
      this.searchData = {};
      this.init();
    },
    data(){
      return {
        visible: false,
        loading: false,
        searchData: {
          account_id: '',
          page: 1,
          pageSize: 50
        },
        tableList: []
      }
    },
    created(){

    },
    filters: {
      times(val){
        return datef("YYYY-MM-dd HH:mm:ss",val.create_time);
      }
    },
    mounted(){

    },
    updated(){

    },
    destroy(){

    },
    methods: {
      init(){
        this.loading = true;

        this.searchData.account_id = this.monitoringData.account_id;
        this.$http(api_wish_history_health_data, this.searchData).then(res => {
          this.tableList = res.data;
          this.loading = false;
        })
      }
    },
    computed: {},
    watch: {
      visible(val){
        this.$emit('input', val);
      },
      value(val){
        this.visible = val;
        if (!!val) {
          this.init();
        }
      }
    },
    props: {
      value: {},
      monitoringData: {
      }
    },
    components: {
      pageDialog: require("../../../components/page-dialog.vue").default
    }
  }
</script>

