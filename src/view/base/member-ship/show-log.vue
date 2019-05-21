<template>
  <div class="show-log">
    <page-dialog
      v-model="show"
      size="large"
      @open="open"
      :close-on-click-modal="false"
      :title="dialogTitle">
      <el-table :data="logData" style="width: 100%">
        <el-table-column prop="create_time" label="操作时间" width="180"></el-table-column>
        <el-table-column label="操作人" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" 
                        placement="right" 
                        @show="show_apr(scope.row.operator_id)">
              <span>{{aprName}}</span>
              <div slot="reference" class="name-wrapper">
                <span>{{ scope.row.operator }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作内容">
          <template slot-scope="scope">
            <template v-for="item of scope.row.remark">
              <p>{{item}}</p>
            </template>
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
 import {api_member_ship_department, api_member_list} from "../../../api/member";
 import {downloadFile} from '@/lib/http';

export default {
  data() {
    return {
      show: this.value,
      aprName:'',
      aprNames:[]
    };
  },
  methods: {
    open() {
		/*一次性请求所有的部门信息，存为本地数据，
		*需要时再从本地查询，避免多次重复向服务器
		*请求
		*/
    	this.logData.forEach(item=>{
    		this.$http(api_member_ship_department,item.operator_id)
				.then(res=>{
					let name=res.map(row=>row.name).join('');
					this.aprNames.push({aprName:name,id:item.operator_id});
				})
				.catch(code => {
             		this.$message({ type: "error", message: code.message || code });
           		});
      	})
    },
    close_dialog() {
      this.show = false;
	},
	//查询部门信息
    show_apr(id) {
        this.aprNames.forEach(item=>{
        	Object.keys(item).forEach(key=>{
        		if(key==='id'&&item[key]===id){
					this.aprName=item['aprName']
            	}
          	})
        })
    }
  },
  computed: {
    dialogTitle() {
      return this.title + "的操作日志";
    }
  },
  watch: {
    show(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.show = val;
    }
  },
  props: {
    value: {},
    logData: {},
    title: {}
  },
  components: {
    pageDialog: require("../../../components/page-dialog.vue").default
  }
};
</script>