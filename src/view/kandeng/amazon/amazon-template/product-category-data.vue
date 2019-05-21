<template>
    <div class="c-product-caregory-data">
        <page-dialog v-model="dialog"
                     :title="title"
                     size="small"
                     :close-on-click-modal="false">
            <table class="template">
                <tr>
                    <th>
                        <el-checkbox v-model="checkAll"></el-checkbox>
                    </th>
                    <th>属性标题名称</th>
                    <th>路径名称</th>
                </tr>
                <template v-for="row in tableData">
                    <tr :key="row.node_tree" @click='row_click(row)'>
                        <td>
                            <el-checkbox v-model="row.select" :disabled="!!row.min_occurs"></el-checkbox>
                        </td>
                        <td>{{row.name}}</td>
                        <td>{{row.node_tree}}</td>
                    </tr>
                </template>
            </table>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
                <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_productbase,api_get_amazon_categoryele} from '../../../../api/product-category-api';
    export default {
        data() {
            return {
                loading:false,
                tableData:[],
                variantList:[],
                dialog:this.value
            }
        },
        methods:{
//            selection_change(val){
//                this.selectData = val;
//            },
            //单行点击选择
            row_click(row){
                if(row.min_occurs===1)return;
                row.select = !row.select;
            },
            submit(){
                let selectData = this.tableData.filter(row=>row.select);
                if(selectData.length<=0)return this.$message({type:"warning",message:"请先选择需要添加产品"});
                this.$emit('submit',selectData,this.variantList);
            },
            init_data(){
                let params = {};
                if(this.type===1){
                    params = {
                        type_id:this.form.firstTypeId,
                        child_type_id:this.form.childTypeId?this.form.childTypeId:'',
//                        name:this.form.class_name,
//                        child_name:this.form.child_name,
                    };
                }
                this.tableData = [];
                let url = this.type===1?api_get_amazon_categoryele:api_get_productbase;
                this.$http(url,params).then(res=>{
                    res.list.forEach(row=>{
                        let isTrue = row.min_occurs===1?true:false;
                        this.$set(row,'select',isTrue);
                    });
                    this.tableData = res.list;
                    this.variantList = res.variants;
                }).catch(code=>{
                    console.log(code,'code');
                })

            },
        },
        computed:{
            checkAll:{
                get(){
                    return !this.tableData.find(row=>!row.select);
                },
                set(val){
                    let list = this.tableData.filter(row=>row.min_occurs===0);
                    list.forEach(row=>{
                        this.$set(row,'select',val);
                    });
                }
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
                if(val){
                    console.log(this.type,'type');
                    this.init_data();
                }
            }
        },
        props:{
            value:{},
            title:{
                required:true,
                type:String
            },
            type:{
                required:true,
                type:Number
            },
            form:{}
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>