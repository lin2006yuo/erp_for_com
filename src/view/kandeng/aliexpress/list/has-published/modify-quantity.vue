<template>
    <page-dialog v-model="show" @open="clear" size="large" title="修改可售数量" :close-on-click-modal="false">
         <div>
            <p>
                <label class="has-inline text-right" style="width: 120px;"> 批量修改可售数量为：</label>
                <integer-input v-model="setStock" :min="0"
                               class="inline"
                               style="width:100px"
                ></integer-input>
            </p>
            <p>
                <label class="has-inline text-right" style="width: 120px;"> 定时提交修改：</label>
                <el-date-picker
                    v-model="cron_time"
                    type="datetime"
                    class="has-inline"
                    placeholder="选择日期时间">
                </el-date-picker>
            </p>
            <p>
                <label class="has-inline text-right" style="width: 120px;"> 修改备注：</label>
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:35%"
                    placeholder="请输入内容"
                    v-model="remark">
                </el-input>
            </p>
        </div>
        <div style="padding-top: 20px;text-align: right;padding-bottom: 10px;">
            <el-button type="primary" size="mini" @click="set_stock_num">预览</el-button>
        </div>
        <table class="template">
            <tr>
                <th><el-checkbox v-model="checkAll" @change="head_check"></el-checkbox></th>
                <th>商品ID</th>
                <th>SKU</th>
                <th>可售量</th>
            </tr>
            <tr v-for="(row,i) in showTables" :key="i" @click="row_click(row)">
                <td>
                    <el-checkbox v-model="row.isCheck" @change="(event)=>{row_click(row,event)}"></el-checkbox>
                </td>
                <td>
                    <ui-tip :content="row.product_id" :width="98"></ui-tip>
                </td>
                <td>
                    <ui-tip :content="row.sku" :width="95"></ui-tip>
                </td>
                <td>
                    <integer-input v-model="row.stock" :min="0"
                                   class="inline"
                                   style="width:100px"
                    ></integer-input>
                </td>
            </tr>
        </table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">保存待同步平台</el-button>
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .text-right{
        text-align: right;
        padding-right:5px;
    }
</style>
<script>
    import {
        api_edit_ae_stock
    } from "../../../../../api/publish-smt"
    export default{
        data(){
            return{
                show:this.value,
                setStock:"",
                cron_time:"",
                remark:"",
                checkAll:true,
                showTables:[],
                selectArr:[],
            }
        },
        created(){
        },
        methods:{
            clear(){
                this.setStock = "";
                this.cron_time = "";
                this.remark = "";
                this.checkAll = true;
                this.showTables = [];
                this.get_variations();
            },
            get_variations(){
                let arr = [];
                this.selectedIds.forEach(res=>{
                    res.product_sku.forEach(row=>{
                        let select = {
                            product_id:res.product_id,
                            sku:row.sku_code,
                            stock:row.ipm_sku_stock,
                            old_stock:row.ipm_sku_stock,
                            isCheck:true,
                        }
                        arr.push(select);
                        this.selectArr.push(select);
                    });
                });
                this.showTables=window.clone(arr);
            },
            set_stock_num(){
                if(this.setStock===''){
                    this.$message({type:"warning",message:"请输入可售数量"});
                    return false;
                }
                if(!this.selectArr.length){
                    this.$message({type:"warning",message:"请勾选要修改的数据"});
                    return false;
                }
                this.selectArr.forEach(it=>{
                    let find = this.showTables.find(row=>{
                        return row.sku===it.sku;
                    })
                    find&&(find.stock = Number(this.setStock));
                });
                return true;

            },
            row_click(row,event){
                if(event){
                    row.isCheck = event.target.checked
                }else{
                    row.isCheck = !row.isCheck;
                }
                this.operate_arr();
                let flag = true;
                this.showTables.forEach(it=>{
                    if(!it.isCheck){
                        flag = false;
                        return ;
                    }
                })
                this.checkAll = flag;
            },
            head_check(){
                this.showTables.forEach(row=>{
                    row.isCheck=this.checkAll;
                });
                this.operate_arr();
            },
            operate_arr(){
                this.selectArr = this.showTables.filter(row=>row.isCheck);
            },
            keep(){
//                let flag=this.set_stock_num();
                if(this.cron_time && this.cron_time instanceof Object){
                    this.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.cron_time/1000);
                }else if(!this.cron_time){
                    this.cron_time = "";
                }
                let parameter= window.clone(this.showTables);
                parameter.forEach(row=>{
                    this.$delete(row,"isCheck");
                    row.stock = Number(row.stock);
                });
                let params = {
                    data:parameter,
                    cron_time:this.cron_time || 0,
                    remark:this.remark.trim()
                };
                this.show=false;
                this.$http(api_edit_ae_stock,params).then(res=>{
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit('change-data', this.setStock);
                    this.show=false;
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    })
                })
            },
            close(){
                this.show =false;
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
        computed:{
        },
        props:{
            value:{
                required:true,
            },
            selectedIds:{
                required:true,
                type:Array,
            },
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            integerInput:require("../../../../../components/integer-input.vue").default,
            uiTip:require('../../../../../components/ui-tip.vue').default,
        }
    }
</script>
