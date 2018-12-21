<template>
    <page>
        <searchList
            @search='search'
          ></searchList>
        <div class="mt-sm mb-sm ml-sm">
            <el-button @click="calRatio" type="info">计算重量运费</el-button>
            <span class="ml-sm red">
                <span>上次计算时间 : </span><span>{{last_time}} ,</span>
                <span>计算重量范围 : </span><span>{{last_monthly}}</span>
            </span>
        </div>

        <table-data
            :table-data="tableData"
            :loading="loading"
            :first-loading="firstLoading"
            :total="total"
            :searchData='searchData'
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @sort-change="sort_change"        
          >
        </table-data>

        <!-- 计算重量费用 -->
        <page-dialog title="计算重量运费"  v-model="dialogTableVisible">
           <div class="wish-weight-cal">
               <label>选择重量范围(g) : </label>        
               <label-item label="" class="mr-md">
                        <el-input  v-model="weight_start" style="width: 100px;"  type="number"  placeholder="重量开始值"></el-input>
                        <span> ~ </span>                    
                        <el-input  v-model="weight_end" style="width:100px"  type="number" @blur="to_p" placeholder="重量结束值"></el-input>
               </label-item>
           </div>           
            <div slot="footer">
                <el-button type="info" @click="sureCal">确定计算</el-button>
                <el-button @click="dialogTableVisible=false">取消</el-button>
            </div>
        </page-dialog>

    </page>
</template>

<script>
import pageDialog from "@/components/page-dialog";
import * as wishApi from "@/api/basic-setting/publish-pricing-rules/wish.js";
import tableData from "./table-data";
import searchList from "./search-list";
import labelItem from "@/components/label-item";
export default {
  components: {
    pageDialog,
    tableData,
    searchList,
    labelItem
  },
  data() {
    return {
      searchData: {
        page: 1,
        pageSize: 50
      },
      total: 0,
      firstLoading: false,
      loading: false,
      tableData: [],
      dialogTableVisible: false,
      last_time: "",
      last_monthly: "",
      weight_start: "",
      weight_end: ""
    };
  },
  methods: {
    //  sort排序
    sort_change(type, prototype) {
      let sort = {
        sort_field: prototype,
        sort_type: type
      };
      this.flagParams = { ...this.flagParams, ...sort };
      this._getData();
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.flagParams.pageSize = val;
      this._getData();
    },
    handleCurrentChange(val) {
      this.searchData.page = val;
      this.flagParams.page = val;
      this._getData();
    },
    /** 最大最小值验证开始 */

    calRatio() {
      this.dialogTableVisible = !this.dialogTableVisible;
    },
    to_p() {
      if ((this.searchData.weight_start - 0) > (this.searchData.weight_end - 0)) {
        this.$message({
          type: "warning",
          message: "输入小于起始值",
          duration: 1500
        });
        this.searchData.weight_start = 0;
      }
    },
    /** 最大最小值验证结束 */

    //  搜索
    search(searchData) {
      let params = {
        page: this.searchData.page,
        pageSize: this.searchData.pageSize,
        weight_start: searchData.weight_s,
        weight_end: searchData.weight_e,
        s_type: searchData.s_type,
        s_start: searchData.s_start,
        s_end: searchData.s_end
      };
      // 重新搜索删除之前排序方式。
      this.flagParams = { ...this.flagParams, ...params };
      if (this.flagParams.sort_type) {
        delete this.flagParams.sort_type;
        delete this.flagParams.sort_field;
      }
      this._getData();
    },
    //   计算占比
    sureCal() {
      this.dialogTableVisible = false;
      let params = {
        weight_start: this.weight_start,
        weight_end: this.weight_end
      };
      this.$http(wishApi.wish_weight_cal_http, params).then(res => {
        this.$message({
          type: "success",
          message: res.message
        });
      });
    },
    /** 得到数据 */

    _getData() {
      let params = this.flagParams;
      this.loading = true
      this.$http(wishApi.wish_weight_http, params).then(res => {
        this.total = res.count;
        this.tableData = res.data;
        this.loading = false
        this.last_time = datef('YYYY-MM-dd' , res.times.last_time);
        this.last_monthly = res.times.last_monthly;
      });
    }
  },
  mounted() {
    this.flagParams = {
      page: this.searchData.page,
      pageSize: this.searchData.pageSize,
      weight_start: "",
      weight_end: "",
      s_type: 1,
      s_start: "",
      s_end: ""
    };
    this._getData();
  }
};
</script>

<style lang='stylus'>
.wish-weight-cal {
    text-align: center;
    margin: 30px auto;

    .el-input {
        display: inline-block !important;
    }
}
</style>
