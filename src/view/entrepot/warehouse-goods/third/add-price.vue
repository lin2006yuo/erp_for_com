<template>
    <page-dialog v-model="visible" @open="open" @close="close" size="large" title="添加商品单价">
        <el-table :data="priceData"
                  class="scroll-bar"
                  v-resize="{height: 150}"
                  border
                  highlight-current-row>
            <el-table-column label="图片" inline-template>
                <el-popover
                        class="inline"
                        placement="right"
                        trigger="hover">
                    <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                    <div slot="reference">
                        <img v-lazy="row.thumb" height="60px" width="60px" style="border:none">
                    </div>
                </el-popover>
            </el-table-column>
            <el-table-column label="SKU/别名" inline-template>
                <div>
                    <div>
                        {{row.sku}}
                    </div>
                    <div v-for="item in row.sku_alias">{{item || `--`}}</div>
                </div>
            </el-table-column>
            <el-table-column label="单价" inline-template>
                <div>
                    <el-input type="number" :min="0" placeholder="请填写单价" v-model="row.price"></el-input>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <permission tag="requestButton"
                        req-key="addPrice"
                        @click="sure"
                        :route="apis.url_sync_third_stock">保存
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_sync_third_stock, url_sync_third_stock} from "@/api/overseas-stock";

    export default {
        permission: {
            url_sync_third_stock,
        },
        data() {
            return {
                visible: false,
            }
        },
        methods: {
            open() {
                this.priceData.forEach(row => {
                    this.$set(row, 'price', '');
                });
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
            sure() {
                if (!this.validate()) {
                    this.$reqKey('addPrice', false);
                    return;
                }
                let price = {};
                this.priceData.forEach(row => {
                    price[row.sku_id] = row.price;
                });
                let params = clone(this.priceParams);
                params.price = price;
                this.$http(api_sync_third_stock, params).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.visible = false;
                    this.$emit('search');
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('addPrice', false);
                    }, 200);
                })
            },
            validate() {
                return !this.priceData.some((row, index) => {
                    row.price = Number(row.price.trim());
                    console.log(`xxxxxx:`, row.price);
                    if (isNaN(row.price) || row.price <= 0) {
                        this.$message({type: 'error', message: `第${index + 1}行单价为无效输入`});
                        return true;
                    }
                    return false;
                })
            },
            close() {
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
            priceData: {},
            priceParams: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>