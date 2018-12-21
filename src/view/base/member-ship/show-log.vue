<template>
  <div class="show-log">
    <!-- v-model size  title为必需属性，open为打开对话框的事件-->
    <page-dialog
      v-model="show"
      size="large"
      @open="open"
      :close-on-click-modal="false"
      :title="dialogTitle">
      <el-table :data="logData" style="width: 100%">
        <el-table-column prop="create_time" label="操作时间" width="180">
        </el-table-column>
        <el-table-column label="操作人" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>部门:{{aprData[0].name}}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.operator }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作内容">
          <template slot-scope="scope">
            {{scope.row.remark[0]}}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="close_dialog">关闭</el-button>
      </div>
    </page-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: this.value,
    }
  },
  methods:{
    open(){},
    close_dialog(){
      this.show=false;
    }
  },
  computed:{
    dialogTitle() {
      return this.title+"的操作日志"
    }
  },
  watch: {
    show(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.show = val;
    },
    aprData(val){
      this.aprName=val;
    }
  },
  props: {
    aprData:Array,
    value: {},
    logData:{},
    title:{}
  },
  components: {
    pageDialog: require("../../../components/page-dialog.vue").default
  }
}
</script>