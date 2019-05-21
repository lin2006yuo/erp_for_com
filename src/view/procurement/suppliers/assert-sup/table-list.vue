<template>
    <el-row class="p-purchasing">
        <el-table
            class="scroll-bar"
            :data="form"
            border
            ref="dataList"
            :highlight-current-row="true"
            :row-key="row_key"
            v-loading="isLoading"
            element-loading-text="玩命加载中..."
            style="width: 100%"
            v-resize="{height:41}"
            @sort-change="sort_click"
            @selection-change="selection_change"
        >
            <!--:default-sort = "{prop: 'date', order: 'descending'}"-->
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="供应商名称" inline-template min-width="50">
                <ui-tip :content="row.company_name"></ui-tip>
            </el-table-column>
            <el-table-column label="SPU数量" inline-template min-width="50"  sortable>
                <ui-tip :content="row.spu_num|emptyByDefault"></ui-tip>
            </el-table-column>
            <el-table-column label="供应商等级" inline-template min-width="50">
                <ui-tip :content="row.level_text|emptyByDefault"></ui-tip>
            </el-table-column>
            <el-table-column label="采购总金额" inline-template min-width="60"  sortable>
                <ui-tip :content="'CNY '+row.sum_amount|emptyByDefault"></ui-tip>
            </el-table-column>
            <el-table-column :render-header="filterHeader('支付方式|交易类型')" inline-template min-width="50">
                <div>
                    <ui-tip :content="row.pay_type_text|emptyByDefault"></ui-tip>
                    <ui-tip :content="row.transaction_type_text|emptyByDefault"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('自动生成付|付款申请单')" inline-template min-width="50">
                <div>
                    <permission
                        tag="ElSwitch"
                        :route="apis.url_auto_payment_request"
                        :key="row.id"
                        :value="isAutoPaymentRequest(row.auto_payment_request)"
                        on-text="启用"
                        off-text="停用"
                        @change="change_status(row)"></permission>
                </div>
            </el-table-column>
            <el-table-column label="结算方式" inline-template   width="125">
                <ui-tip :content="row.balance_type_text|emptyByDefault"></ui-tip>
            </el-table-column>
            <el-table-column label="省/市/区" inline-template   width="125">
                <ui-tip :content="filterCity(row)"></ui-tip>
            </el-table-column>
            <el-table-column label="联系人" inline-template min-width="50">
                <ui-tip :content="row.contacts|emptyByDefault"></ui-tip>
            </el-table-column>
            <el-table-column label="采购员" inline-template  min-width="50">
                <ui-tip :content="row.purchaser_name|emptyByDefault"></ui-tip>
            </el-table-column>
            <el-table-column label="开发员" inline-template  min-width="50">
                <ui-tip :content="row.developer_name|emptyByDefault"></ui-tip>
            </el-table-column>
            <el-table-column label="供应链专员" inline-template  min-width="50">
                <ui-tip :content="row.supply_chain_specialist_name|emptyByDefault"></ui-tip>
            </el-table-column>
            <el-table-column label="分类" inline-template  min-width="80">
                <ui-tip :content="row.categorys_text|emptyByDefault"></ui-tip>
            </el-table-column>
            <el-table-column label="审核状态" inline-template  min-width="50">
                <ui-tip :content="row.status|filterStatus"></ui-tip>
            </el-table-column>
            <el-table-column :render-header="filterHeader('合作次数|最后合作时间')" inline-template min-width="50">
                <div class="p-table-list-td-text">
                    <ui-tip :content="row.count_trade_times|emptyByDefault" :width="58"></ui-tip>次
                    <times :time="row.update_time|emptyByDefault"></times>
                </div>
            </el-table-column>
            <el-table-column :render-header="filterHeader('创建时间|修改时间')" inline-template  min-width="50">
                <div class="p-table-list-td-text">
                    <times :time="row.create_time|emptyByDefault"></times>
                    <times :time="row.update_time|emptyByDefault"></times>
                </div>
            </el-table-column>
            <el-table-column label="操作" min-width="70" inline-template>
                <div>
                    <trends-select
                        class="inline ml-sm btn-trends-select-relative"
                        :selects="filterOptions(row.status)"
                        type="primary"
                        @trigger="handles(row,$event)"></trends-select>
                </div>
            </el-table-column>
        </el-table>
    </el-row>
</template>

<style scoped>

</style>
<script>
    import {api_auto_payment_request,
        url_look_supplier,
        url_delete_supplier,
        url_edit_supplier,
        url_get_supplier_id_log,
        url_supplier_discuss_record,
        url_get_supplier_get_supplier_purchase,
        url_auto_payment_request} from '../../../../api/assert-sup';

    const handleOptions = [  //全部
        {label:'查看',value:0,api:url_look_supplier},
        {label:'编辑',value:1,api:url_edit_supplier},
        {label:'删除',value:2,api:url_delete_supplier},
        {label:'采购记录',value:3,api:url_get_supplier_get_supplier_purchase},
        {label:'重新启用',value:4,api:url_edit_supplier},
        {label:'洽谈记录',value:5,api:url_supplier_discuss_record},
        {label:'审核',value:7,api:url_edit_supplier},
        {label:'重新提交',value:9,api:url_edit_supplier},
        {label:'操作日志',value:6,api:url_get_supplier_id_log},
    ];
    export default {
        name: "table-list",
        permission: {
            url_look_supplier,
            url_delete_supplier,
            url_edit_supplier,
            url_get_supplier_id_log,
            url_supplier_discuss_record,
            url_get_supplier_get_supplier_purchase,
            url_auto_payment_request
        },
        methods:{
            row_key(row){
                return `${row.id}${row.sku_id}`
            },
            selection_change(val){
                this.$emit('selection_change',val)
            },
            handles(row, handle){
                this.$emit('handles',row, handle)
            },
            change_status(row,val){
                this.$confirm(`此操作将${row.auto_payment_request==1?"停用":'启用'}自动生成付款申请单, 确定进行此操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let params = {
                        supplier_id: row.id ,
                        auto_payment_request: this.filterAutoPaymentRequest(row.auto_payment_request)
                    };
                    this.$http(api_auto_payment_request, params).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.update_edit(res.auto_payment_request,row.id)
                    }).catch(fail=>{
                        this.$message({
                            type:"error",
                            message:fail.message||fail
                        })
                    })
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消操作"
                    })
                })
            },
            // 更新状态
            update_edit(val,id){
                this.form.forEach(row=>{
                    if (row.id===id){
                        this.$set(row,"auto_payment_request",val)
                    }
                })
            },
            filterAutoPaymentRequest(val){
                if (val==1){
                    return 2
                }else{
                    return 1
                }
            },
            filterOptions(status) {
                switch (status) {
                    case 0:
                        return handleOptions.filter(row => (row.value === 0 || row.value === 7 || row.value === 6) && this.$hasPermission(row.api));
                    case 1:
                        return handleOptions.filter(row => (row.value === 0 || row.value === 1 || row.value === 3 || row.value === 5 || row.value === 6 || row.value === 8) && this.$hasPermission(row.api));
                    case 2:
                        return handleOptions.filter(row => (row.value === 0 || row.value === 4 || row.value === 2 || row.value === 6) && this.$hasPermission(row.api));
                    case 3:
                        return handleOptions.filter(row => (row.value === 0 || row.value === 9 || row.value === 6) && this.$hasPermission(row.api));
                    default:
                        return handleOptions.filter(row => row.value === 0 && this.$hasPermission(row.api));
                }
            },
            filterHeader(head){
                return (h)=>{
                    return h('div',[
                        h('div',head.split('|')[0]),
                        h('div',head.split('|')[1])
                    ])
                }
            },
            sort_click(val){
                switch(val.column.label){
                    case "SPU数量":
                        this.searchData.sort_field = 'spu_num';
                        break;
                    case "采购总金额":
                        this.searchData.sort_field = 'sum_amount';
                        break;
                }
                this.searchData.sort_order = val.order==='ascending'?"asc":"desc";
                this.$emit('search')
            },
            // 判断是否启用自动生成付款清单
            isAutoPaymentRequest(val){
                if (val==1){
                    return true
                } else{
                    return false
                }
            },
            // 城市id取城市名
            filterCity(val) {
                let a = "--";
                let b = "--";
                let c = "--";
                if (val.province_id) {
                    this.provinceList.forEach(row => {
                        if (row.value === val.province_id) {
                            a = row.label
                        }
                    });
                }
                if (val.city_id) {
                    this.cityList.forEach(row => {
                        if (row.value === val.city_id) {
                            b = row.label
                        }
                    });
                }
                if (val.area_id) {
                    this.area.forEach(row => {
                        if (row.value === val.city_id) {
                            c = row.label
                        }
                    })
                }
                return a + '/' + b + '/' + c
            },
        },
        filters: {
            filterTime(val) {
                if (val) return datef('YYYY-MM-dd HH:mm:ss', val);
            },
            filterStatus(val) {
                switch (val) {
                    case 0:
                        return "待审核";
                    case 1:
                        return "已审核";
                    case 2:
                        return "停用";
                    case 3:
                        return "审核未通过";
                    default:
                        return '--'
                }
            }
        },
        computed:{
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            }
        },
        props:{
            searchData:{
                required:true,
                type:Object,
            },
            form:{
                required:true,
                type:Array,
            },
            firstLoading:{
                type:Boolean,
            },
            isLoading:{
                type:Boolean,
            },
            provinceList:{},
            cityList:{},
            area:{},
            operationStatus:{},
        },
        components:{
            trendsSelect: require('@/components/trends-select').default,
            uiTip:require('@/components/ui-tip.vue').default,
        }

    }
</script>

