<template>
  <page class="p-index-member" ref="page">
    <search :searchData="searchData" @search="search" @clear="clear"></search>
    <el-row class="ml-sm mb-xs mt-xs">
      <el-button type="primary" size="mini" @click="add">添加</el-button>
      <request-button :request="del_all">删除</request-button>
    </el-row>
    <member-edit
      ref="member"
      :is-add="isAdd"
      :title="title"
      :dev-data="devData"
      v-model="memVisable"
      @refresh="search"
      @add-update="add_update"
    ></member-edit>
    <!-- 查看日志 -->
    <show-log v-model="logVisable" :log-data="logData" :title="title" :aprData="aprData"></show-log>
    <!-- /查看日志 -->
    <page-dialog></page-dialog>
    <ui-table
      :has-data="tableData.length>0"
      v-model="checkAll"
      :first-loading="true"
      @check="changeAll"
      :body-height="41"
      v-loading="loading"
      element-loading-text="玩命加载中..."
      :heads="[
                    {isCheck:true,width:2},
                    {label:'平台',width:15},
                    {label:'账号简称',width:15},
                    {label:'销售员',width:15},
                    {label:'仓库类型',width:15},
                    {label:'客服',width:10},
                    {label:'添加时间',width:15},
                    {label:'操作',width:10},
                  ]">
      <tbody>
        <template v-for="(item, i) in tableData">
          <tr 
            v-for="(trs ,index) in item.info"
            @click="row_high_light(i)"
            :class="{active:item.isHighLight}"
          >
            <td :rowspan=" item.info.length" v-if="index===0">
              <el-checkbox v-model="item.isCheck" @change="changeOne"></el-checkbox>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0">
              <span v-copy>{{item.channel_id}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0">
              <span v-copy>{{item.code}}</span>
            </td>
            <td v-copy>{{trs.seller_id}}</td>
            <td>{{trs.warehouse_type|typeFilter}}</td>
            <td :rowspan=" item.info.length" v-if="index===0">
              <span v-copy>{{item.customer_id}}</span>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0">
              <times :time="item.create_time"></times>
            </td>
            <td :rowspan=" item.info.length" v-if="index===0">
              <div>
                <permission tag="span" :route="apis.url_member_edit" class="operate" @click="edit(item, index)">编辑</permission>
                |&nbsp;<permission tag="span" :route="apis.url_member_del" class="operate" @click="del_one(item)">删除</permission>
                |&nbsp;<permission tag="span" :route="apis.url_member_ship_log" class="operate" @click="show_log(item,index)">日志</permission>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </ui-table>
    <el-pagination
      class="page-fixed"
      @size-change="handle_size_change"
      @current-change="handle_current_change"
      :current-page="searchData.page"
      :page-sizes="[20, 50, 100, 200,500]"
      :page-size="searchData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </page>
</template>
<style lang="stylus">
.p-index-member {
  .active {
    background-color: rgba(173, 227, 255, 0.5);
  }
}
</style>
<script>
import {
  api_member_list,
  api_member_edit,
  api_member_del,
  api_member_batch,
  api_channels,
  api_product_account,
  url_member_edit,
  url_member_del,
  url_member_ship_log,
  api_member_ship_log,
  url_member_ship_department,
  api_member_ship_department
} from "../../../api/member";
import { mapActions, mapGetters } from "vuex";
export default {
  permission: {
    url_member_edit,
    url_member_del,
    url_member_ship_log,
    url_member_ship_department
  },
  page: {},
  refresh() {
    this.init();
  },
  data() {
    return {
      searchData: {
        snType: "sales",
        snText: "",
        channel_id: "",
        account_id: "",
        page: 1,
        pageSize: 50
      },
      total: 0,
      loading: false,
      logData: [],
      aprData:[],
      tableData: [],
      checkAll: false,
      logVisable: false,
      memVisable: false,
      channel: [],
      customerList: [],
      isAdd: false,
      title: "",
      devData: [],
      editIndex: ""
    };
  },
  mounted() {
    this.init()
    this.get_channel();
  },
  computed: {
    ...mapGetters({ accounts: "params/channelAccount" })
  },
  methods: {
    ...mapActions({ load: "params/setChannelAccount" }),
    //打开日志窗口
    show_log(item, index) {
      let data = {
        channel_id: item.channel_id,
        account_id: item.account_id
      };
      //请求日志数据
      this.$http(api_member_ship_log, data)
        .then(res => {
          this.operator_id = res.data[0].operator_id;
          //格式化时间
          this.logData = res.data.map(data => {
            data.create_time = data.create_time?datef('YYYY-MM-dd hh:mm:ss',data.create_time):'--';
            return data;
          });
          this.title = res.data[index].operator;
          //请求部门信息
          this.$http(api_member_ship_department, this.operator_id)
            .then(res => {
              this.aprData=res;
              this.logVisable = true;   //弹出日志
            })
            .catch(code => {
              this.$message({ type: "error", message: code.message || code });
            });
        })
        .catch(code => {
          this.$message({ type: "error", message: code.message || code });
        });
    },
    init() {
      let data = window.clone(this.searchData);
      if (!this.searchData.account_id) {
        data.account_id = "";
      }
      this.loading = true;
      this.$http(api_member_list, data)
        .then(res => {
          this.loading = false;
          this.total = res.count;
          this.tableData = res.data.map(row => {
            row.isCheck = false;
            this.$set(row, "isHighLight", false);
            return row;
          });
        })
        .catch(code => {
          console.log(code);
        });
    },
    changeOne() {
      if (this.tableData.length > 0) {
        this.checkAll = !this.tableData.find(data => !data.isCheck);
      }
    },
    handle_size_change(val) {
      this.searchData.pageSize = val;
      this.init();
    },
    handle_current_change(val) {
      this.searchData.page = val;
      this.init();
    },
    changeAll(val) {
      this.tableData.forEach(row => {
        row.isCheck = val;
      });
    },
    get_channel() {
      this.channel = [];
      this.$http(api_channels)
        .then(res => {
          this.channel = [{ value: "", label: "全部" }, ...res];
        })
        .catch(code => {});
    },
    add() {
      this.isAdd = true;
      this.title = "添加";
      this.devData = [];
      this.memVisable = true;
    },
    edit(row, index) {
      this.editIndex = index;
      this.$http(api_member_edit, row.id)
        .then(res => {
          let channel = this.channel.find(it => {
            return it.value === res[0].channel_id;
          });
          res[0].warehouse = [
            { label: "全部", value: 0, isCheck: false },
            { label: "本地", value: 1, isCheck: false },
            { label: "海外", value: 2, isCheck: false }
          ];
          res.forEach(item => {
            if (this.accounts(`channel${item.channel_id}`).length) {
              item.param = [];
            } else {
              this.$http(api_product_account, { channel_id: item.channel_id })
                .then(ress => {
                  this.load({
                    type: `channel${item.channel_id}`,
                    channels: ress.account
                  });
                  item.param = [];
                })
                .catch(code => {
                  this.$message({
                    type: "error",
                    message: code.message || code
                  });
                });
            }
            item.type = `channel${item.channel_id}`;
          });
          console.log("test", res);
          this.isAdd = false;
          this.title = `编辑账号：${row.account_id} 绑定信息`;
          console.log("res0", res);
          this.devData = res;
          this.memVisable = true;
        })
        .catch(code => {
          console.log(code);
        });
    },
    del_all() {
      let data = [];
      let title = [];
      this.tableData.forEach(row => {
        if (row.isCheck) {
          data.push(row.id);
          title.push(row.account_id);
        }
      });
      if (data.length === 0) {
        this.$message({ type: "warning", message: "请选择删除账号" });
        return false;
      }
      return this.$confirm(
        `您将删除该${title.join(",")}的绑定关系, 确认此操作吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          return this.$http(api_member_batch, { data: data })
            .then(res => {
              this.$message({ type: "success", message: res.message || res });
              this.operate_del(data);
              return Promise.resolve();
            })
            .catch(code => {
              this.$message({ message: code.message || code, type: "error" });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    del_one(item) {
      this.$confirm(`您将删除${item.code}的绑定关系, 确认此操作吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http(api_member_del, item.id)
            .then(res => {
              this.$message({ type: "success", message: res.message || res });
              this.operate_del(item);
            })
            .catch(code => {
              this.$message({ message: code.message || code, type: "error" });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    operate_del(datas) {
      if (datas instanceof Array) {
        datas.forEach(row => {
          let index = this.tableData.indexOfFun(row, function(old, row) {
            return old.id === row;
          });
          this.tableData.splice(index, 1);
          this.total--;
        });
      } else if (datas instanceof Object) {
        let i = this.tableData.indexOfFun(datas, function(old, datas) {
          return old.id === datas.id;
        });
        this.tableData.splice(i, 1);
        this.total--;
      }
    },
    search() {
      this.init();
    },
    clear() {
      this.searchData = {
        snType: "sales",
        snText: "",
        channel_id: "",
        account_id: "",
        page: 1,
        pageSize: 50
      };
      this.init();
    },
    add_update(val) {
      let create_time = Date.parse(new Date());
      create_time = create_time / 1000;
      let data = {};
      if (val instanceof Array) {
        let data = {};
        console.log("111111111", data);
        val.forEach(res => {
          data = {
            id: res.id,
            channel_id: res.channel_id,
            account_id: res.account_id,
            code: res.code,
            customer_id: res.customer_id,
            create_time: create_time,
            info: res.info
          };
          console.log("data", data);
          this.tableData.unshift(data);
          this.total++;
        });
      } else {
        this.tableData[this.editIndex].id = val.id;
        this.tableData[this.editIndex].info = val.info;
        this.tableData[this.editIndex].create_time = create_time;
        console.log("22222222", this.tableData[this.editIndex]);
      }
    },
    row_high_light(index) {
      this.tableData.forEach(row => {
        row.isHighLight = false;
      });
      this.tableData[index].isHighLight = true;
    }
  },
  filters: {
    typeFilter(val) {
      switch (val) {
        case 0:
          return "全部";
        case 1:
          return "本地";
        case 2:
          return "海外";
      }
    }
  },
  watch: {},
  props: {},
  components: {
    memberEdit: require("./member-edit.vue").default,
    search: require("./search.vue").default,
    uiTable: require("../../../components/ui-table.vue").default,
    requestButton: require("../../../global-components/request-button").default,
    showLog: require("./show-log.vue").default
  }
};
</script>

