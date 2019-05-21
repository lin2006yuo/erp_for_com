<template>
  <div>
    <el-table :data="data" v-resize="{height:70}" v-loading="loading" element-loading-text="玩命加载中...">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="定时规则名称" prop="name" width="350">
      </el-table-column>
      <el-table-column label="已在刊登队列中" prop="age">
      </el-table-column>
      <el-table-column label="执行范本" prop="age">
      </el-table-column>
      <el-table-column label="描述" prop="age" width="500">
      </el-table-column>
      <el-table-column label="备注" prop="age" width="200">
      </el-table-column>
      <el-table-column label="操作" width="150" inline-template>
        <permission tag="trendsSelect"
                    class="inline" @trigger="operate(data,$event)" :selects="operateList" type="primary"
                    :route="apis.url_update_listing">
        </permission>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="stylus">

</style>
<script>
  import {url_update_listing} from '../../../../api/ebay-kandeng-public-module';
  import {operateList} from './action';//------操作按钮引入
  export default{
    permission: {
      url_update_listing
    },
    data(){
      return {
        operateList:operateList,

      }
    },
    methods:{

    },
    props:{
        data:{
          required:true,
          type:Array
        }
    },
    components: {
      trendsSelect:require('../../../../components/trends-select.vue').default,
    }
  }
</script>
