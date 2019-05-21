<template>
	<div>
		<el-table	:data="tableData"
                    v-loading="loading"
                    v-resize="{height:41}"
                    element-loading-text="玩命加载中..."
                    highlight-current-row>
			<el-table-column label="发货仓库" prop="warehouse_name">

			</el-table-column>
			<el-table-column label="物流商" prop="carrier_name">

			</el-table-column>
            <el-table-column label="币种" inline-template>
                <span>{{`${row.currency_code}`}}</span>
            </el-table-column>
			<el-table-column label="转运费标准" inline-template>
				<span>{{`${row.fee}/KG`}}</span>
			</el-table-column>
			<el-table-column label="状态" inline-template>
				<el-switch	:value="row.status"
                            :on-value="0"
                            :off-value="1"
                            on-text="启用"
                            off-text="停用"
                            @change="change_status($event,row)">
				</el-switch>
			</el-table-column>
			<el-table-column label="创建人" prop="creator_name">

			</el-table-column>
			<el-table-column label="最后更新时间" inline-template>
				<span>{{row.update_time | dateFilter}}</span>
			</el-table-column>
			<el-table-column label="操作" inline-template>
				<span class="operate" @click="operation_history(row)">历史记录</span>
			</el-table-column>
    	</el-table>
	</div>
</template>

<script>
import {api_post_transfer_status} from '@/api/transporting-charge.js';

export default {
	data(){
		return {
			loading:false,
		}
	},
	methods:{
		operation_history(row){
			this.$emit("operation_history",row);
		},
		change_status(val,row){
			console.log("状态改变：",val,row);
			this.$confirm(`确定进行此操作?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					closeOnClickModal:false,})
				.then(()=>{
					this.$http(api_post_transfer_status,{id:row.id,status:val})
						.then(res=>{
							row.status=row.status===0?1:0;
							this.$message({type:'success',message:'修改成功'});
						})
						.catch(err=>{
							row.status=!row.status;
							this.$message({type:'error',message:err.message});
						})
				})
				.catch(()=>{
					this.$message({type:'info',message:'已取消操作'})
          		})
			
		}
	},
	props:{
		tableData:{
			type:Array,
			required:true
		}
	  },
	filters:{
		dateFilter(val){
			return datef('YYYY-MM-dd HH:mm:ss',val);
		}
	}
}
</script>

<style>

</style>
