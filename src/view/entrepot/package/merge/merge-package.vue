<template>
    <page-dialog class="merge-package" title="合并包裹" v-model="show" size="full" top="30%" :close-on-click-modal="false">
        <p class="tag">本页面只适合订单合并包裹的操作</p>
        <el-row>
            <el-col :span="24" class="order">
                <div v-for="(cpackage,cpackage_i) in cpackages" :key="cpackage_i" class="package">
                    <p class="child-box-title">
                        <el-checkbox :value="merge_value(cpackage) >= 0" @change="check_merge_value(cpackage)">
                            订单：{{cpackage.order_number}}&nbsp;
                            包裹号：{{cpackage.number}}
                        </el-checkbox>
                    </p>
                    <el-table :data="cpackage.detail">
                        <el-table-column label="图片"></el-table-column>
                        <el-table-column label="SKU" prop="sku"></el-table-column>
                        <el-table-column label="产品名称" prop="sku_title"></el-table-column>
                        <el-table-column label="数量" prop="sku_quantity"></el-table-column>
                        <el-table-column label="价格（CNY）" prop="sku_price"></el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
        <choose-shipping v-model="shipVisable"
                         :id="id"
                         :merges="merges"
                         @refresh="refresh"
                         :table-data="tableData"></choose-shipping>
        <div slot="footer">
            <el-button type="primary" size="mini" @click.native="merge_package">合并包裹</el-button>
            <el-button size="mini" @click="show = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .merge-package{
        p.tag{
            border:1px solid #A2B8CE;
            height:36px;
            line-height:36px;
            padding:0 10px;
            background:#FCFBDD;
        }
        .order{
            border:1px solid #A2B8CE;
            background: #D6E9F2;
            padding:10px;
            .package{
                border:1px solid #A2B8CE;
                margin-bottom:10px;
                .child-box-title {
                    background: #ACCDED;
                    height: 30px;
                    line-height: 30px;
                    margin:0 ;
                    padding: 0 10px;
                }
            }
        }
    }
</style>
<script>
    import labelItem from '../../../../components/label-item.vue';
    import {api_get_mergeInfo,api_keep_mergeInfo} from '../../../../api/order-local';
    export default{
        data(){
            return {
                show: this.value,
                merges:[],
                orderList:[],
                isSave:false,
                shipVisable:false,
                tableData:[]
            }
        },
        methods:{
            merge_value(pack){ // 多选框赋值
                return this.merges.indexOfFun(merge=>{
                    return merge.order_id === pack.order_id && merge.package_id === pack.id
                });
            },
            refresh(){
                this.show = false;
                this.$emit("refresh");
            },
            check_merge_value(pack){ // 多选框变动
                let ret = -1;
                if((ret = this.merge_value(pack)) >= 0){
                    this.merges.splice(ret, 1)
                }else{
                    this.merges.push({order_id:pack.order_id,package_id:pack.id})
                }
                if(this.merges){
                    this.isSave = true;
                }else{
                    this.isSave = false;
                }
            },
            merge_package(){ //合并包裹
                let option = {
                    merge:this.merges
                };
                this.$http(api_keep_mergeInfo,this.id,option).then(res=>{
                	if(res.message){
                        this.$message({
                            type:'success',
                            message:res.message || res
                        });
                        setTimeout(()=>{
                            this.show = false;
                        },2000);
                        this.$emit("refresh");
                    }else if(res.result){
                        this.shipVisable = true;
                        res.result.forEach(row=>{
                        	row.isCheck = false;
                        })
                        this.tableData = res.result;
                    }
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            }
        },
        computed:{
            cpackages:{
                get(){
                    let ret = [];
                    this.orders.forEach(order =>{
                        order.package.forEach(pack=>{
                            pack.order_id = order.id;
                            pack.order_number = order.order_number;
                            ret.push(pack)
                        })
                    });
                    return ret;
                },
                set(val){
                    console.log(val);
                }
            }
        },
        watch: {
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            },
            form(val){
            }
        },
        props: {
            value: {
                required:true,
                type:Boolean
            },
            id:{},
            form:{},
            orders:{},
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default,
            chooseShipping:require('./choose-shipping.vue').default,
        }
    }
</script>
