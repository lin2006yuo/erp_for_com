<template>
    <page-dialog  v-model="show"
                  :title="title"
                  :close-on-cilck-modal="false">
        <el-table	:data="data.data"
		 			v-loading="loading"
              		element-loading-text="玩命加载中..."
              		highlight-current-row> 
            <el-table-column label="月份" inline-template>
				<span>{{row.date | dateFilter}}</span>
			</el-table-column>
			<el-table-column label="币种" inline-template>
				<span>{{row.currency_code}}</span>
			</el-table-column>
			<el-table-column label="转运费标准" inline-template>
				<span>{{`${row.fee}/KG`}}</span>
			</el-table-column>
    	</el-table>

        <el-pagination  class="fixed"
                        @current-change="handle_current_change"
                        :current-page="data.page"
                        :page-size="data.pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="data.count">
        </el-pagination>

        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="show=false">关 闭</el-button>
        </div>  
    </page-dialog>
</template>

<script>
import {api_get_transfer_fee_history} from '@/api/transporting-charge.js'
export default {
    data(){
        return{
            loading:false,
        }
    },
    methods:{
        handle_current_change(val){
            console.log("当前页改变:",val);
            this.$emit("history-page-change",val);
        },    
    },
    props:{
        value:{
            required:true,
            type:Boolean
        },
        title:{},
        data:{},
        currency:{},
        pageInfo:{}
    },
    computed:{
        show:{
            get(){
                return this.value;
            },
            set(val){
                this.$emit('input',val);
            }
        }
    },
    filters:{
		dateFilter(val){
			return datef('YYYY-MM',val);
        },
	},
    components:{
        pageDialog:require('@/components/page-dialog').default
    } 
}
</script>

<style lang="stylus" scoped>
    .fixed
        width 45%
        float right
        padding-top 15px
</style>


