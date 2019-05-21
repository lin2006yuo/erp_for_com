<template>
    <page-dialog v-model="visible" @open="open" @close="close" title="" class="c-stock-confirm">
        <div class="stock-confirm-radio">
            <el-radio-group v-model="id">
                <el-radio class="block-type mb-xs" :label="0">新增“备货计划”单</el-radio>
                <el-radio class="block-type" :label="ready_inventory_id" :disable="readyInventoryList.length === 0">
                    加入到已有计划中
                    <el-select v-model="ready_inventory_id" class="inline">
                        <el-option v-for="item in readyInventoryList" :key="item.id" :value="item.id"
                                   :label="item | itemLabel"></el-option>
                    </el-select>
                </el-radio>
            </el-radio-group>
        </div>
        <div slot="footer">
            <el-button type="primary" size="mini" @click.native="sure">确定
            </el-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-stock-confirm {
        .stock-confirm-radio {
            width: 305px;
            margin: 20px auto 0;
        }
        .block-type {
            display: block;
        }
        .el-radio + .el-radio {
            margin: 0;
        }
    }
</style>
<script>

    export default {
        data() {
            return {
                visible: false,
                id: 0,
                ready_inventory_id: '',
            }
        },
        methods: {
            open() {
                if (this.readyInventoryList.length !== 0) {
                    this.ready_inventory_id = this.readyInventoryList[0].id;
                }
            },
            sure() {
                console.log(`sure`, this.id);
                this.$emit('make-sure', this.id);
            },
            close() {
                this.id = 0;
                this.ready_inventory_id = '';
            }
        },
        filters: {
            itemLabel(val) {
                return val.remark ? `${val.code}(${val.remark})` : val.code;
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            readyInventoryList: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>