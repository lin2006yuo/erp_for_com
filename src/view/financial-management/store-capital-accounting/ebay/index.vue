<template>
  <page class="p-index">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="店铺归属" name="shop">
          <shop></shop>
      </el-tab-pane>
        <el-tab-pane label="paypal" name="paypal">
            <paypal ref="paypalRef"></paypal>
        </el-tab-pane>
    </el-tabs>    
  </page>
</template>


<script>
import { downloadFile } from "../../../../lib/http";
import shop from "./shop";
import paypal from "./paypal";
import {
  api_wish_account_list,
  api_wish_account_export,
  url_wish_account_export
} from "@/api/wish-cash-account";
export default {
  permission: {
    url_wish_account_export
  },
  page: {
    devinfo: {
      frontEnd: "文军辉",
      backEnd: "王威",
      createTime: "2019-1-12",
      updateTime: ""
    }
  },
  data() {
    return {
      activeName: "shop",
      panlelist: [
        { label: "店铺归属", name: "first", component: shop },
        { label: "paypal", name: "second", component: paypal }
      ],
      ids: [],
      flag: true,
      export_visible: false,
      flagIndex:0
    };
  },
  methods: {
      handleClick(tab, event) {
          if (tab.label === 'paypal' && this.flagIndex < 2) {
              this.flagIndex++;
              this.$refs.paypalRef.init();
          }
      }
  },
  components: {    
    shop,
    paypal
  }
};
</script>

