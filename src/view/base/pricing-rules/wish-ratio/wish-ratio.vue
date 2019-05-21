<template>
    <page>
        <search-list  @search='search' 
            :searchData='searchData'
            :placeList='placeList'
            :logisticsList='logisticsList'
           ></search-list>
        
        <div class="mt-sm mb-sm ml-sm">
            <el-button @click="calRatio" type="info">计算订单占比</el-button>               
            <span class="ml-sm red" v-show="last_time">
                <span>上次计算时间</span><span>{{last_time}} , </span>
                <span>计算订单占比月份</span><span>{{last_monthly}}</span>
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
            @handle-click='handleClick'
           >
        </table-data>

        <!-- 计算订单占比 -->
        <page-dialog
           title="选择指定商品"  v-model="dialogTableVisible"
          >  
          <div class="wish-select-month">
            <span>*选择订单月份</span>
            <el-date-picker
                v-model="monthStart"
                type="month"
                placeholder="选择月">
            </el-date-picker>
            <label>~</label>
            <el-date-picker
                v-model="monthEnd"
                type="month"
                placeholder="选择月">
            </el-date-picker>
          </div>
          <div slot="footer">
              <el-button type="info" @click="sureCal">确定计算</el-button>
              <el-button @click="dialogTableVisible=false">取消</el-button>
          </div>            
        </page-dialog>

        <!-- 指定物流方式 -->
        <page-dialog
           title="指定物流方式"  v-model="dialogTableVisible1"
             
           size='large'           
           >
          <div class='wish-set-wu'  v-loading="loading2"
              element-loading-text="拼命加载中" >  
            <label-item label="发货仓库：" class="ml-sm">
                <el-select   v-model="shipping.value"
                        class="s-width-default"
                        disabled
                        clearable>
                    <el-option
                        label="中山仓"
                        value="2">
                    </el-option>
                </el-select>
            </label-item>
           
            <div class='item'>
                <span class="span">(普货)平邮物流方式:</span>
                <el-select class='el-select' size="large" v-model="shipping.general_surface_shipping" multiple placeholder="请选择">
                    <el-option
                    v-for="item in adreelist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class='item'>
                <span class="span">(普货)挂号物流方式:</span>
                <el-select class='el-select' size="large" v-model="shipping.general_registration_shipping" multiple placeholder="请选择">
                    <el-option
                        v-for="item in adreelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>   
            <hr>

            <div class='item'>
                <span class="span">(特性)平邮物流方式:</span>
                <el-select class="el-select" size="large"
                  v-model="shipping.special_surface_shipping" multiple placeholder="请选择">
                    <el-option
                        v-for="item in adreelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class='item'>
                <span class="span">(特性)挂号物流方式:</span>
                <el-select class="el-select"  size="large" v-model="shipping.special_registration_shipping" multiple placeholder="请选择">
                    <el-option
                        v-for="item in adreelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class='item footer-button'>
              <span class="span"> </span>
              <div class='el-select footer-wish'>
                  <span>注意：系统将从上方指定的物流方式中，获取最优运费作为刊登定价运费</span>       
                  <div>
                      <el-button type="info" @click="sureSet">确定</el-button>
                      <el-button @click="dialogTableVisible1=false">取消</el-button>
                  </div>                               
              </div>
            </div>

          </div>                
        </page-dialog>

    </page>
</template>

<script>
import searchCard from "@/components/search-card";
import pageDialog from "@/components/page-dialog";
import * as objAPI from "@/api/freight-trial";
import * as wishApi from "@/api/basic-setting/publish-pricing-rules/wish.js";
import { handleY, handleMonth } from "@/lib/dataHandle/data";
import tableData from "./table-data";
import searchList from "./search-list";
import labelItem from '@/components/label-item'
import { defaultCoreCipherList } from 'constants';
export default {
  components: {
    searchCard,
    pageDialog,
    tableData,
    searchList,
    labelItem
  },
  data() {
    return {
      searchData: {
        page: 1,
        pageSize: 50,
        local: '',
        logistics: ''
      },
      total: 0,
      monthStart: '',
      monthEnd: "",
      firstLoading: false,
      loading: false,
      adreelist: [
      ],
      tableData: [],
      placeList: [], // 目的地
      logisticsList: [], // 物流方式
      last_monthly: "",
      last_time: "",
      dialogTableVisible: false,
      dialogTableVisible1: false,
      shipping: {
        general_surface_shipping: [],
        general_registration_shipping: [],
        special_surface_shipping: [],
        special_registration_shipping: [],
        value: "2",
        rowId: ''
      },
      loading2: false, // 指定物流方式的对话框使用。
    };
  },
  methods: {
    //  指定物流方式
    handleClick(row, rows) {
      this.dialogTableVisible1 = true;
      this.adreelist = []
      this.loading2 = true;
      this.$http(wishApi.wish_set_edit, row).then(res => {
         this.shipping.general_surface_shipping = res.general_surface_shipping ? res.general_surface_shipping : [];
         this.shipping.general_registration_shipping = res.general_registration_shipping ? res.general_registration_shipping : [];
         this.shipping.special_surface_shipping = res.special_surface_shipping ? res.special_surface_shipping : [];
         this.shipping.special_registration_shipping =res.special_registration_shipping ? res.special_registration_shipping : [];
         this.shipping.rowId = row;
      });
      let params = {
        warehouse_id: 2,
        country_code: rows.country_code
      };
      this.$http(objAPI.api_get_postway, params).then(res => {
          this.adreelist = res.map(row => {
            return {
              label: row.shortname,
              value: row.id
            }
          })
          this.$nextTick(() => {
              this.loading2 = false
          })          
      })
    },
    //   sort排序
    sort_change(type, prototype) {       
      let sort = {
        sort_field: prototype,
        sort_type: type
      };
      this.flagParams = {...this.flagParams, ...sort };
      this._searchHttp()
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.flagParams.pageSize = val;
      this._searchHttp()
    },
    handleCurrentChange(val) {
      this.searchData.page = val;
      this.flagParams.page = val
      this._searchHttp()      
    },
    calRatio() {
      this.dialogTableVisible = !this.dialogTableVisible;
    // 每一次开始计算占比后都更新到本月的上一个月。
      this.monthStart = handleMonth ()
      this.monthEnd = handleMonth()
    },
    //  搜索
    search() {
      let params = {
        page: this.searchData.page,
        pageSize: this.searchData.pageSize,
        country_code: this.searchData.local,
        shipping: this.searchData.logistics
      };
      this.flagParams = params
      this._searchHttp()
    },
    _searchHttp() {
        this.loading = true
        this.$http(wishApi.wish_get_http, this.flagParams).then(res => {
            this.last_monthly = res.times.last_monthly;
            this.last_time = datef("YYYY-MM-dd HH:mm:ss", res.times.last_time)
            this.tableData = res.data.map(item => {
                item.rate = item.rate + "%"
                item.general_surface_shipping = item.general_surface_shipping.join(',')
                item.general_registration_shipping = item.general_registration_shipping.join(',')
                item.special_surface_shipping = item.special_surface_shipping.join(',')
                item.special_registration_shipping = item.special_registration_shipping.join(',')
                return item
            })
            this.total = res.count;
            this.loading = false
        });
    },
    _calHttp(params) {
        this.loading = true
        this.$http(wishApi.wish_set_http, params).then(res => {            
            // this.last_time = datef("YYYY-MM-dd HH:mm:ss", res.data.times.last_time)
            // this.last_monthly = res.data.times.last_monthly
            // this.total = res.data.count        
            // this.tableData = res.data.data.map(item => {
            //     item.general_surface_shipping = item.general_surface_shipping.join(',')
            //     item.general_registration_shipping = item.general_registration_shipping.join(',')
            //     item.special_surface_shipping = item.special_surface_shipping.join(',')
            //     item.special_registration_shipping = item.special_registration_shipping.join(',')
            //     return item
            // })            
            // this.loading = false
            this.$message({
                type: 'success',
                message: res.message
            })
            // 计算成功后重新调取一下search()
            this._searchHttp()            
        })
    },
    //   计算占比
    sureCal() {
      if (!this.monthStart) {
        this.$message({ type: "warning", message: "请选择订单月份" });
        return;
      }
      if (!this.monthEnd) {
        this.$message({ type: "warning", message: "请选择订单月份" });
        return;
      }
      if (this.monthStart.getTime() > this.monthEnd.getTime()) {
          this.$message({ type: "warning", message: "请选择正确月份范围" });
          this.monthStart = '';
          return 
      }
      this.dialogTableVisible = false;      
      let params = {
        date_s: handleY(this.monthStart),
        date_e: handleY(this.monthEnd)
      };      
      this._calHttp(params)
    },
    //  确定设置物流方式
    sureSet() {
      this.dialogTableVisible1 = false;
      let params = {
        id: this.shipping.rowId,
        warehouse_id: 2,
        general_surface_shipping: this.shipping.general_surface_shipping,
        general_registration_shipping: this.shipping.general_registration_shipping,
        special_surface_shipping: this.shipping.special_surface_shipping,
        special_registration_shipping: this.shipping.special_registration_shipping
      };
      this.$http(wishApi.wish_save_http, this.shipping.rowId, params).then(res => {
         this.$message({
             type: 'success',
             message: res.message
         })
         let tableList = this.tableData.slice(0)
         let index = this.tableData.findIndex(item => item.id === res.data.id)         
         this.tableData = []
        //  等待浏览器刷新频率17ms
         setTimeout(() => {
            let item = res.data
            item.general_surface_shipping = item.general_surface_shipping.join(',')
            item.general_registration_shipping = item.general_registration_shipping.join(',')
            item.special_surface_shipping = item.special_surface_shipping.join(',')
            item.special_registration_shipping = item.special_registration_shipping.join(',')
            tableList[index] = item         
            this.tableData = tableList
         }, 40)         
      });
    },
    // 获取目的地
    api_get_country() {
      this.placeList = [];
      this.$http(objAPI.api_get_country)
        .then(res => {          
          this.placeList = res.map(row => {
            return {
              label: row.country_cn_name,
              value: row.country_code
            }
          })
          this.placeList.unshift({
              label: '全部',
              value: ''
          })
        })
        .catch(code => {
          this.$message({ type: "error", message: code.message || code });
        })
    },
    // 获取物流方式
    api_get_postway(v) {
      let params = {
        warehouse_id: 2,
        country_code: v
      };
      this.logisticsList = [];
      this.$http(objAPI.api_get_postway, params)
        .then(res => {            
          this.logisticsList = res.map(row => {
            return {
              label: row.shortname,
              value: row.id
            };
          });
          this.logisticsList.unshift({
              label: '全部',
              value: ''
          })
        })
        .catch(code => {
          this.$message({ type: "error", message: code.message || code });
        });
    },
    init() {
      this.api_get_country();
    }
  },
  watch: {
    "searchData.local"(val) {
      if (val) {
         this.api_get_postway(val);
      } else {
          this.logisticsList = []
          this.logisticsList.push({
              label: '全部',
              value: ''
          })
      }       
    }
  },
  mounted() {
    this.init();
    this.flagParams = ''
    this.search();   
  }
};
</script>

<style scoped lang='stylus'>
.wish-header {
    display: inline-flex;
    align-items: center;
    flex: 60%;
    width: 60%;
    .mul-select {
        flex: 1;
    }

    .label-wu {
        margin-left: 5px;
    }
}
.wish-select-month {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0 30px 0;
    span {
        margin-right: 15px;
    }
    label {
        margin: 0 15px;
    }
}
.wish-set-wu {
    padding: 15px 22px 0 22px
    box-sizing: border-box;
    .item {
        margin: 15px 0;
        display: flex;
        .span {
            margin-right: 8px;
            flex: 0 0 11%;
            width: 11%;
        }
        .el-select {
            flex: 1;
        }
    }
}
.footer-wish {
    display: flex;
    justify-content: space-between;
}
</style>
<style lang='stylus'>
.wish-set-wu{
    .item{
        height 90px
        .el-select__tags{
            height 90px!important
            max-width 1500px!important
            box-sizing border-box
            span{
                display flex 
                flex-wrap wrap
            }
        }
        &.footer-button{
            height 30px
            margin-top 40px
        }
    }    
}



</style>

