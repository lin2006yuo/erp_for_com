<template>
    <div>
        <page-dialog title="复核" v-model="visible" size="tiny" :close-on-click-modal="false" class="p-arrival">
            <el-form ref="form" :model="goods_detail.form" label-width="130px">
                <el-form-item label="长：">
                    <el-input v-model="goods_detail.form.length" class="form-input">
                        <template slot="append">cm</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="宽：">
                    <el-input v-model="goods_detail.form.width" class="form-input">
                        <template slot="append">cm</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="高：">
                    <el-input v-model="goods_detail.form.height" class="form-input">
                        <template slot="append">cm</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="重量：">
                    <el-input v-model="goods_detail.form.weight" class="form-input">
                        <template slot="append">g</template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="on_submit" class="mr-sm">确认</el-button>
                    <el-button @click.native="visible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-arrival {
        .inner {
            width: 380px;
            margin: 0 auto;
            top: 30%;
            left: 0 !important;
            right: 0;
        }
        .form-input {
            width: 120px;
        }
    }
</style>
<script>
    import {api_url_check_sku} from "@/api/arrival-parcel.js"

    export default {
        data() {
            return {
                visible: false,
            }
        },
        mounted() {
        },
        methods: {
            on_submit() {
                Object.keys(this.goods_detail).forEach(key => {
                    if (typeof this.goods_detail[key] === 'string') {
                        this.goods_detail[key] = this.goods_detail[key].trim();
                    }
                });
                let params = {
                    length: this.goods_detail.form.length,
                    width: this.goods_detail.form.width,
                    height: this.goods_detail.form.height,
                    weight: this.goods_detail.form.weight
                };
                this.$http(api_url_check_sku, this.goods_detail.sku_id, params).then(res => {
                    this.$emit("init");
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$emit("init");
                    this.$message({type: 'error', message: code.message || code});
                })
            }
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
                console.log(this.goods_detail)
            }
        },
        props: {
            value: {},
            goods_detail: {
                required: true,
                type: Object
            }
        },
        components: {
            pageDialog: require("@/components/page-dialog.vue").default
        },
    }
</script>
