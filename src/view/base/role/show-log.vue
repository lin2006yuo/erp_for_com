<template>
    <page-dialog v-model="show"
                 :title="title"
                 size="large"
                 :close-on-click-modal="false"
                 @open="open"
                 @close="close">
        <el-table :data="logData">
            <el-table-column label="操作时间" prop="create_time"  width="180">
            </el-table-column>
            <el-table-column label="操作人"  width="180">
                <template slot-scope="scope">
                    <el-popover placement="right"
                                width="100"
                                trigger="hover"
                                @show="show_apr(scope.row.operator_id)"
                                :content="`部门：${aprName}`">
                        <span slot="reference">{{scope.row.operator}}</span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="操作内容" prop="remark">   
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button @click.native="close">关闭</el-button>
        </div>
    </page-dialog>
</template>

<style>

</style>

<script>
 import {api_member_ship_department} from "../../../api/member";

export default {
    data(){
        return{
            aprName:'',
            aprNames:[]
        }
    },
    methods:{
       /*  一次性请求所有的部门信息，存为本地数据，
		需要时再从本地查询，避免多次重复向服务器
		请求 */	
        open(){
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
        close(){
            this.show=false;
        },
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
    
    computed:{
        show:{
            get(){
                return this.value;
            },
            set(val){
                this.$emit("input",val);
            },
        }
    },
    props:{
        value:{
            require:true,
            type:Boolean
        },
        title:{
            require:true
        },
        logData:{
            require:true,
            type:Array
        }
    },
    components:{
         pageDialog:require('../../../components/page-dialog').default
    }
}
</script>

