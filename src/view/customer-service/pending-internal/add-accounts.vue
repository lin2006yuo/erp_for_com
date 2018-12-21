<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="addForm" label-width="120px">
            <el-form-item label="指派给客服：">
                    <el-col :span="12">
                        <el-select v-model="addForm.to_customer_id" placeholder="请选择" class="inline  mr-sm s-width-middle">
                            <el-option
                                    :key="item.customer_id"
                                    v-for="item in customerId"
                                    :label="`${item.customer_name}(${item.total})`"
                                    :value="item.customer_id">
                            </el-option>
                        </el-select>
                    </el-col>
            </el-form-item>
            <el-form-item label="指派数量：">
                <el-row>
                    <el-col :span="18">
                        <el-input v-model="addForm.total" placeholder="请输入指派数量"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="备注：">
                <el-row>
                    <el-col :span="18">
                        <el-input v-model="addForm.remark" type="textarea"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    export default{
        data(){
            return{
                show:this.value,
                customerId:[],
            }
        },
        methods:{
            open(){
                let list = this.tableData.list.map(row=>{
                    return {
                        customer_name:row.customer_name,
                        total:row.total,
                        customer_id:row.customer_id,
                    }
                });
                this.customerId = [...list]
            },
            cloce(){

            },
            keep(){
            	this.$emit('keep',this.addForm);
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },

        props:{
            value:{
                required:true,
                type:Boolean
            },
            addForm:{
                required:true,
                type:Object
            },
            title:{
                required:true,
                type:String
            },
            tableData:{
                required:true,
                type:Object
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>