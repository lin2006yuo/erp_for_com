<template>
    <div class="c-batch-change-warehouse">
        <page-dialog :title="title" v-model="dialog" :loading="loading" @open="open" :width="`300px`" :close-on-click-modal="false">
            <div class="c-b-change-warehouse-item">
                <label-item label="请选择仓库：" class="inline ml-sm mr-sm">
                    <el-select v-model="warehouse_id"
                               class="inline s-width-default"
                               filterable
                               clearable>
                        <el-option v-for="item in warehouseList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
            </div>
            <div slot="footer">
                <request-button
                    :mintime="200"
                    req-key="url_orders_batch_change_warehouse"
                    @click.native="submit"
                    class="inline">确定</request-button>
                <el-button size="mini"
                           @click.native="dialog = false"
                           class="inline">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-batch-change-warehouse{
        .c-b-change-warehouse-item{
            margin: 10px;
            margin-left: 20px;
        }
    }
</style>
<script>
    import {api_get_warehouse} from '../../../api/common';
    export default {
        data() {
            return {
                dialog:this.value,
                loading:false,
                warehouse_id:"",
                warehouseList:[]
            }
        },
        mounted(){
            this.get_warehouse()
        },
        methods:{
            open(){
                this.warehouse_id = '';
            },
            get_warehouse(){
                this.loading = true;
                this.$http(api_get_warehouse).then(res=>{
                    this.warehouseList = res;
                    this.loading = false;
                });
            },
            submit(){
                if(!this.warehouse_id){
                    this.$reqKey('url_orders_batch_change_warehouse',false);
                    return this.$message({type:"warning",message:'请先选择仓库后再提交！'});
                }
                let find = this.warehouseList.find(row=>row.value===this.warehouse_id);
                this.$emit('submit',find);
            },
        },
        watch:{
            dialog(val){
                this.$reqKey('url_batch_remark',false);
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{},
            title:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item').default
        }
    }
</script>
