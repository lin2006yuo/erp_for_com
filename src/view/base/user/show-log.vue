<template>
    <page-dialog v-model="show"
                 :title="title"
                 size="large"
                 :close-on-click-modal="false"
                 @close="close_dialog">
        <el-table :data="logData">
            <el-table-column label="操作时间" prop="create_time"  width="180">
            </el-table-column>
            <el-table-column label="操作人"  width="180">
                <template slot-scope="scope">
                    <el-popover placement="right"
                                width="100"
                                trigger="hover"
                                :content="`部门：${scope.row.department_name}`">
                        <span slot="reference">{{scope.row.operator}}</span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="操作内容" prop="remark">   
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button @click.native="close_dialog">关闭</el-button>
        </div>
    </page-dialog>
</template>

<style lang="">
    
</style>

<script>
export default {
    data(){
        return{
            
        }
    },
    methods:{
        close_dialog(){
            this.show=false;
        }
    },
    computed:{
        show:{
            get(){
                return this.value;
            },
            set(val){
                this.$emit("input",val);
            }
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