<template>
    <page-dialog
            size="large"
            @open="open"
            v-model="show"
            :close-on-cilck-modal="false"
            :title="action.title">
        <el-row class="ml-sm mt-sm mb-sm" v-if="isDeclare">
            <el-button size="mini"
                       type="primary"
                       @click.native="open_dialog">添加</el-button>
            <el-button size="mini"
                       type="primary"
                       @click.native="batch_delete"
                       :disabled="checkList.length === 0">删除</el-button>
        </el-row>
        <el-table
                class="mt-xs scroll-bar"
                height="500"
                :data="addList"
                border
                :row-key="getRowKeys"
                highlight-current-row
                @selection-change="handle_selection_change">
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column label="图片" inline-template>
                <div>
                    <el-popover
                            placement="right"
                            width="200"
                            trigger="hover">
                        <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                        <div slot="reference">
                            <img v-lazy="row.thumb" width="60" height="60" style="vertical-align: middle;">
                        </div>
                    </el-popover>
                </div>
            </el-table-column>
            <el-table-column label="SKU" inline-template>
                <div>
                    <ui-tip :content="row.sku" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="商品名称" inline-template>
                <div>
                    <span>{{row.spu_name}}</span>
                </div>
            </el-table-column>
            <el-table-column label="分区" inline-template>
                <div>
                    <ui-tip :content="row.warehouse_area" :width="98" v-if="isDeclare"></ui-tip>
                    <ui-tip :content="row.area_name" :width="98" v-else></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="分区功能" inline-template>
                <div>
                    <ui-tip :content="row.warehouse_area_type" :width="98" v-if="isDeclare"></ui-tip>
                    <ui-tip :content="row.code" :width="98" v-else></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="货位" inline-template>
                <div>
                    <ui-tip :content="row.code" :width="98" v-if="isDeclare"></ui-tip>
                    <ui-tip :content="row.warehouse_code" :width="98" v-else></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="当前数量" inline-template v-if="curStatus !== 1 || isDeclare">
                <div>
                    <ui-tip :content="row.quantity-row.hold_quantity" :width="98" v-if="isDeclare"></ui-tip>
                    <ui-tip :content="row.quantity" :width="98" v-else></ui-tip>
                </div>
            </el-table-column>
            <el-table-column :label="curStatus === 1 ? '次品数量' : '申报数量'" inline-template>
                <div>
                    <integer-zero-input v-model="row.declare_quantity"
                                        v-if="isDeclare"
                                        class="input-width"
                                        :min="0"></integer-zero-input>
                    <ui-tip :content="row.declare_quantity" :width="98" v-else></ui-tip>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <div v-if="isDeclare">
                <el-button size="mini"
                           type="primary"
                           @click.native="submit">提交</el-button>
                <el-button size="mini"
                           @click.native="show = false">关闭</el-button>
            </div>
            <div v-if="action.operation === 'audit'">
                <el-button size="mini"
                           type="primary"
                           @click.native="audit_pass">审核通过</el-button>
                <el-button size="mini"
                           @click.native="audit_reject">审核不通过</el-button>
            </div>
        </div>
        <!--添加货位弹框-->
        <edit-check-orders v-model="addDialog"
                           ref="add_dialog"
                           :add-action="addAction"
                           @add-goods="add_goods"
                           :warehouse="warehouse"></edit-check-orders>
    </page-dialog>
</template>

<script>
    export default {
        data(){
            return {
                show: this.value,
                addDialog: false,
                addList: [],
                checkList: [],
                addAction: {},
            }
        },
        methods: {
            open(){
                if(this.isDeclare){
                    this.addList = []
                }
            },
            open_dialog(){
                this.addAction = {
                    title: '添加商品',
                    value: 'add'
                };
                this.$refs.add_dialog.searchData.warehouse_id = this.warehouseId;
                this.addDialog = true;
            },
            sku_image(image){
                return image.replace('60x60', '200x200');
            },
            batch_delete(){
                this.addList = this.addList.filter(row => {
                    return !this.checkList.includes(row.id)
                })
            },
            add_goods(data){
                if(this.addList.length > 0){
                    let skuArr = this.addList.map(row => row.sku);
                    let arr = data.filter(row => {
                        return !skuArr.includes(row.sku)
                    });
                    this.addList.push(...arr);
                }else{
                    this.addList = data
                }
                this.addList.forEach(row => {
                    this.$set(row, 'declare_quantity', 0)
                });
            },
            //表格行数据渲染优化，给每一行绑定一个固定的key值
            getRowKeys(row){
                return row.id
            },
            submit(){
                if(this.addList.length === 0){
                    this.$message({type: 'warning', message: '请至少添加一条商品信息'});
                    return
                }
                if(this.addList.some(row => row.quantity-row.hold_quantity === 0)){
                    this.$message({type: 'warning', message: '列表中含有当前数量为0的商品，不可提交申报单，请删除后重试'});
                    return
                }
                if(this.addList.some(row => row.declare_quantity > row.quantity-row.hold_quantity)){
                    this.$message({type: 'warning', message: '列表中含有申报数量大于当前数量的商品，不可提交申报单，请编辑后重试'});
                    return
                }
                if(this.addList.some(row => String(row.declare_quantity).indexOf('.') > -1)){
                    this.$message({type: 'warning', message: '列表中含有申报数量为小数的商品，不可提交申报单，请编辑后重试'});
                    return
                }
                if(this.addList.some(row => row.declare_quantity === 0)){
                    this.$message({type: 'warning', message: '申报数量不可为0，请编辑后重试'});
                    return
                }
                let details = this.addList.map(row => {
                    return {
                        warehouse_code: row.code,
                        code: row.warehouse_cargo_id,
                        sku_id: row.sku_id,
                        quantity: row.quantity-row.hold_quantity,
                        declare_quantity: row.declare_quantity
                    }
                });
                this.$emit('submit-declare', details)
            },
            audit_pass(){
                this.$emit('single-audit', '通过')
            },
            audit_reject(){
                this.$emit('single-audit', '不通过')
            },
            handle_selection_change(val){
                this.checkList = val.map(row => row.id)
            }
        },
        watch: {
            show(val){
                this.$emit('input', val)
            },
            value(val){
                this.show = val
            }
        },
        computed:{
            isDeclare(){
                return this.action.operation === 'declare';
            },
        },
        props: {
            value:{
                required: true,
                type: Boolean
            },
            action:{
                required: true,
                type: Object
            },
            warehouseId:{},
            warehouse:{},
            curStatus:{}
        },
        components: {
            integerZeroInput: require('@/components/integer-zero-input').default,
            pageDialog: require('@/components/page-dialog').default,
            uiTip: require('@/components/ui-tip').default,
            editCheckOrders: require('./edit-check-orders').default
        }
    }
</script>

<style scoped>

</style>