<template>
  <page class="p-index">
    <card-search @search="search" :form="form" :clears="clears" @clear="clear"></card-search>
    <table-data
      :table-data="tableData"
      :empty-text="emptyText"
      @search="search"
      @size-change="size_change"
      @current-change="current_change"
      :loading="loading"
      class="mt-xs"
    ></table-data>
  </page>
</template>
<style lang="stylus">
</style>
<script>
import { api_get_list } from "@/api/packages";

export default {
  page: {},
  refresh() {
    this.init();
  },
  data() {
    return {
      loading: false,
      isCleared: false,
      tableData: {
        list: [],
        page: 1,
        pageSize: 50,
        total: 0
      },
      form: {
        channel_id: "",
        channel_account_id: "",
        warehouse_id: "",
        site_code: "",
        shipping_id: "",
        snType: "number",
        snText: "",
        snDate: "shipping_time",
        delivery_type: "",
        oos_type: "",
        date_b: Date.now() - 14 * 24 * 60 * 60 * 1000,
        date_e: Date.now(),
        distribution_type: "",
        picking_type: "",
        packing_type: ""
      },
      clears: {
        channel_account_id: "",
        snType: "number",
        snDate: "shipping_time",
        date_b: Date.now() - 14 * 24 * 60 * 60 * 1000,
        date_e: Date.now()
      },
      emptyText: "请查询数据！"
    };
  },
  methods: {
    search() {
      this.init();
    },
    clear() {
      this.isCleared = true;
    },
    get_params() {
      let params = Object.assign({}, this.form);
      params.page = this.tableData.page;
      params.pageSize = this.tableData.pageSize;

      if (this.form.snText) {
        let list = this.form.snText
          .split("\n")
          .filter(row => !!row)
          .map(row => row.trim());
        params.snText = list.length <= 1 ? this.form.snText.trim() : list;
      }

      if (this.form.date_e) {
        let cur = new Date(this.form.date_e);
        params.date_e = datef("YYYY-MM-dd", cur / 1000);
      } else {
        params.date_e = "";
      }
      if (this.form.date_b) {
        let cur = new Date(this.form.date_b);
        params.date_b = datef("YYYY-MM-dd", cur / 1000);
      } else {
        params.date_b = "";
      }

      return params;
    },
    init() {
      if (this.isCleared) {
        this.tableData.page = 1;
        this.tableData.pageSize = 50;
        this.isCleared = false;
      }
      let params = this.get_params();
      this.loading = true;
      this.$http(api_get_list, params)
        .then(res => {
          this.loading = false;
          this.tableData.list = res.data;
          this.tableData.total = res.count;
          if (res.count === 0) {
            this.emptyText = "暂无数据";
          }
        })
        .catch(code => {
          this.loading = false;
          this.$message({ type: "error", message: code.message || code });
        });
    },
    current_change(val) {
      this.tableData.page = val;
      this.init();
    },
    size_change(val) {
      this.tableData.pageSize = val;
      this.init();
    }
  },
  components: {
    cardSearch: require("./card-search.vue").default,
    tableData: require("./table-data.vue").default
  }
};
</script>
