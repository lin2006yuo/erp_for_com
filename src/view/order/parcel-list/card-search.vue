<template>
  <div class="c-card-search">
    <search-card :params="form" :clears="clears" @search="search" @init-params="$emit('clear')">
      <div class="mb-xs">
        <label-item label>
          <el-select v-model="form.snType" class="width-xs" v-sf.snType filterable clearable>
            <el-option
              v-for="res in snTypeList"
              :label="res.label"
              :value="res.value"
              :key="res.value"
            ></el-option>
          </el-select>
        </label-item>
        <label-item label>
          <order-input
            class="width-super mr-sm"
            v-model="form.snText"
            v-sf.snText
            @keydown="search"
            placeholder="可批量搜索，Shift+回车换行..."
          ></order-input>
        </label-item>
        <label-item label="平台：">
          <el-select
            v-model="form.channel_id"
            class="inline width-sm"
            v-sf.channel_id
            filterable
            clearable
          >
            <el-option
              v-for="res in channelList"
              :label="res.label"
              :value="res.value"
              :key="res.value"
            ></el-option>
          </el-select>
        </label-item>
        <label-item label="站点：" class="ml-sm">
          <el-select
            v-model="form.site_code"
            class="width-lg"
            v-sf.site_code
            :placeholder="comHolderSite"
            :disabled="siteList.length<=1"
            filterable
            clearable
          >
            <el-option
              v-for="res in siteList"
              :label="res.label"
              :value="res.value"
              :key="res.value"
            ></el-option>
          </el-select>
        </label-item>
        <label-item label="账号简称：" class="ml-sm">
          <el-select
            v-model="form.channel_account_id"
            class="width-sm"
            v-sf.channel_account_id
            :disabled="accountList.length<=1"
            :placeholder="comHolderAccount"
            filterable
            clearable
          >
            <el-option
              v-for="res in accountList"
              :label="res.label"
              :value="res.value"
              :key="res.value"
            ></el-option>
          </el-select>
        </label-item>
        <label-item label="发货仓库：" class="ml-sm">
          <el-select
            v-model="form.warehouse_id"
            class="width-xs"
            v-sf.warehouse_id
            filterable
            clearable
          >
            <el-option
              v-for="res in warehouseList"
              :label="res.label"
              :value="res.value"
              :key="res.value"
            ></el-option>
          </el-select>
        </label-item>
        <label-item label="运输方式：" class="ml-sm">
          <el-select
            v-model="form.shipping_id"
            v-sf.shipping_id
            :placeholder="comHolderShipping"
            :disabled="shippingList.length<=1"
            filterable
            clearable
          >
            <el-option
              v-for="res in shippingList"
              :label="res.label"
              :value="res.value"
              :key="res.value"
            ></el-option>
          </el-select>
        </label-item>
        <label-item label="发货状态：" class="ml-sm">
          <el-select v-sf.delivery_type v-model="form.delivery_type" class="width-xs">
            <el-option
              v-for="item in deliveryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </label-item>
      </div>
      <label-item label="分配库存状态：" class="ml-sm">
        <el-select v-sf.delivery_type v-model="form.distribution_type" class="width-sm">
          <el-option
            v-for="item in repertoryList"
            :key="item.code"
            :label="item.remark"
            :value="item.code"
          ></el-option>
        </el-select>
      </label-item>
      <label-item label="包裹是否缺货：" class="ml-sm">
        <el-select v-sf.delivery_type v-model="form.oos_type" class="width-sm">
          <el-option
            v-for="item in oosTypeList"
            :key="item.code"
            :label="item.remark"
            :value="item.code"
          ></el-option>
        </el-select>
      </label-item>
      <label-item label="拣货单状态：" class="ml-sm">
        <el-select v-sf.delivery_type v-model="form.picking_type" class="width-sm">
          <el-option
            v-for="item in pickingList"
            :key="item.code"
            :label="item.remark"
            :value="item.code"
          ></el-option>
        </el-select>
      </label-item>
      <label-item label="包装状态：" class="ml-sm">
        <el-select v-sf.delivery_type v-model="form.packing_type" class="width-xs">
          <el-option
            v-for="item in packagingList"
            :key="item.code"
            :label="item.remark"
            :value="item.code"
          ></el-option>
        </el-select>
      </label-item>
      <el-select v-model="form.snDate" class="inline ml-sm width-md" v-sf.snDate>
        <el-option v-for="res in snDateList" :label="res.label" :value="res.value" :key="res.value"></el-option>
      </el-select>
      <el-date-picker
        class="date inline"
        v-model="form.date_b"
        :picker-options="picker_b"
        v-sf.date_b
        placeholder="开始时间"
      ></el-date-picker>&nbsp;--&nbsp;
      <el-date-picker
        class="date inline mr-sm"
        placeholder="结束时间"
        v-sf.date_e
        :picker-options="picker_e"
        v-model="form.date_e"
      ></el-date-picker>
    </search-card>
  </div>
</template>
<style lang="stylus">
.c-card-search {
  .el-card {
    overflow: inherit;
  }
}
</style>
<script>
import { api_delivery_type } from "@/api/order-local";
import { api_oos_type } from "@/api/packages";
import {
  api_get_channel,
  api_account_list,
  api_get_warehouse,
  api_get_shipping,
  api_distribution_type_info,
  api_picking_type_info,
  api_packing_type_info
} from "@/api/common.js";
import { chinese } from "@/define/validator_reg";

export default {
  page() {},
  data() {
    return {
      channelList: [],
      accountList: [],
      siteList: [],
      warehouseList: [],
      shippingList: [],
      //                搜索类型（order_number -订单号，tracking -物流跟踪号，number-包裹号，process_code - 处理号,channel_order_number -平台订单号）
      snTypeList: [
        { label: "包裹号", value: "number" },
        { label: "订单号", value: "order_number" },
        { label: "平台订单号", value: "channel_order_number" },
        { label: "物流跟踪号", value: "tracking" },
        { label: "物流商单号", value: "process_code" },
        { label: "收货人", value: "consignee" },
        { label: "电话号码", value: "mobile" },
        { label: "SKU", value: "sku" }
      ],
      //                推送
      deliveryList: [],
      oosTypeList: [],
      //                日期类型（shipping_time -发货时间  pay_time 支付时间）
      repertoryList: [],
      pickingList: [],
      packagingList: [],
      snDateList: [
        { label: "发货时间", value: "shipping_time" },
        { label: "支付时间", value: "pay_time" },
        { label: "物流下单时间", value: "upload_time" },
        { label: "配货成功时间", value: "distribution_time" }
      ],
      picker_b: {
        disabledDate: time => {
          if (this.form.date_e) {
            return time.getTime() > this.form.date_e;
          } else {
            return false;
          }
        }
      },
      picker_e: {
        disabledDate: time => {
          if (this.form.date_b) {
            return time.getTime() < this.form.date_b;
          } else {
            return false;
          }
        }
      }
    };
  },
  created() {
    this.get_channel();
    this.get_warehouse();
    this.get_delivery_type();
    this.get_oos_type();this.get_distribution_type();this.get_picking_type();this.get_packing_type();
  },
  methods: {
    get_distribution_type() {
      this.$http(api_distribution_type_info).then(res => {
        this.repertoryList = [...res];
      });
    },
    get_picking_type() {
      this.$http(api_picking_type_info).then(res => {
        this.pickingList = [...res];
      });
    },
    get_packing_type() {
      this.$http(api_packing_type_info).then(res => {
        this.packagingList = [...res];
      });
    },
    get_delivery_type() {
      this.$http(api_delivery_type)
        .then(res => {
          let filterRes = res.filter(item => {
            return item.code < 2;
          });
          this.deliveryList = filterRes.map(row => {
            return {
              label: row.remark,
              value: row.code
            };
          });
        })
        .catch(code => {
          this.$message({ type: "error", message: code.message || code });
        });
    },
    get_oos_type() {
      this.$http(api_oos_type)
        .then(res => {
          this.oosTypeList = res;
        })
        .catch(code => {
          this.$message({ type: "error", message: code.message || code });
        });
    },
    search() {
      this.$emit("search", this.form);
    },
    get_channel() {
      this.$http(api_get_channel)
        .then(res => {
          this.channelList = [{ label: "全部", value: "" }, ...res];
        })
        .catch(code => {
          this.$message({ type: "error", message: code.message || code });
        });
    },
    get_site(val) {
      if (!val) return (this.siteList = [{ label: "", value: "" }]);
      this.$http(api_account_list, { channel_id: val })
        .then(res => {
          let site = res.site;
          if (site.length <= 0) {
            let account = res.account;
            this.siteList = [{ label: "", value: "" }];
            if (account) {
              this.accountList = [{ label: "全部", value: "" }, ...account];
            } else {
              this.accountList = [{ label: "", value: "" }];
            }
          } else {
            this.siteList = [{ label: "全部", value: "" }, ...site];
          }
        })
        .catch(code => {
          this.$message({ type: "error", message: code.message || code });
        });
    },
    get_account(channel_id, site_code) {
      if (!channel_id || !site_code) {
        this.accountList = [{ label: "", value: "" }];
        return;
      }
      this.$http(api_account_list, {
        channel_id: channel_id,
        site_code: site_code
      })
        .then(res => {
          let account = res.account;
          if (account.length > 0)
            return (this.accountList = [
              { label: "全部", value: "" },
              ...account
            ]);
          this.accountList = [{ label: "", value: "" }];
        })
        .catch(code => {
          this.$message({ type: "error", message: code.message || code });
        });
    },
    get_warehouse() {
      this.$http(api_get_warehouse)
        .then(res => {
          this.warehouseList = [{ label: "全部", value: "" }, ...res];
        })
        .catch(code => {
          this.$message({ type: "error", message: code.message || code });
        });
    },
    get_shipping(warehouse_id) {
      if (!warehouse_id)
        return (this.shippingList = [{ label: "", value: "" }]);
      this.$http(api_get_shipping, { warehouse_id: warehouse_id })
        .then(res => {
          if (res.length <= 0)
            return (this.shippingList = [{ label: "", value: "" }]);
          res = res.map(row => {
            return {
              label: `${row.carrier_name}>>${row.shortname}`,
              value: row.shipping_method_id
            };
          });
          this.shippingList = [{ label: "全部", value: "" }, ...res];
        })
        .catch(code => {
          this.$message({ type: "error", message: code.message || code });
        });
    }
  },
  watch: {
    "form.channel_id"(val) {
      this.form.site_code = "";
      this.form.channel_account_id = "";
      this.accountList = [{ label: "", value: "" }];
      this.get_site(val);
    },
    "form.site_code"(val) {
      this.form.channel_account_id = "";
      this.get_account(this.form.channel_id, val);
    },
    "form.warehouse_id"(val) {
      this.form.shipping_id = "";
      this.get_shipping(val);
    }
  },
  computed: {
    comHolderSite() {
      if (!this.form.channel_id) {
        return "请先选择平台";
      } else if (!!this.form.channel_id && this.siteList.length <= 1) {
        return "该平台下暂无站点";
      } else {
        return "请选择站点";
      }
    },
    comHolderAccount() {
      if (!this.form.site_code) {
        return "请先选择站点";
      } else if (!!this.form.site_code && this.accountList.length <= 1) {
        return "该站点下暂无账号";
      } else {
        return "请选择账号";
      }
    },
    comHolderShipping() {
      if (!this.form.warehouse_id) {
        return "请先选择发货仓库";
      } else if (!!this.form.warehouse_id && this.shippingList.length <= 1) {
        return "该发货仓库下暂无运输方式";
      } else {
        return "请选择运输方式";
      }
    },
    changeLabel() {
      let find = this.snTypeList.find(res => {
        return res.value === this.form.snType;
      });
      if (!!find) {
        return find.label;
      }
    }
  },
  props: {
    form: {
      required: true,
      type: Object
    },
    clears: {
      required: true,
      type: Object
    }
  },
  components: {
    searchCard: require("@/components/search-card.vue").default,
    labelItem: require("@/components/label-item.vue").default,
    orderInput: require("@/components/order-input.vue").default
  }
};
</script>
