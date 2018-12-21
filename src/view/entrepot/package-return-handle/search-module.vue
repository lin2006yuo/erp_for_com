<template>
    <div class="p-package-return-deal">
        <el-card>
            <label-item label="退回类型：" label-width="60">
                <el-select v-model="searchData.reason_id" class="width-lg">
                    <el-option v-for="(item, index) in typeList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <div class="mt-sm">
                <label-item label="面单号：" label-width="60">
                    <el-input v-model="searchData.shipping_number"
                              ref="shipping_number"
                              @focus="focus('shipping_number')"
                              @keyup.enter.native="init"
                              class="width-lg inline"
                              autofocus>
                    </el-input>
                    <span v-if="warning.shipping_number">
                    <i class="delete-icon"></i>
                    <span class="red tip">{{warning.shipping_number}}</span>
                </span>
                </label-item>
            </div>
        </el-card>
    </div>
</template>
<style lang="stylus">
    .p-package-return-deal {
        .red {
            font-size: 20px;
            vertical-align: middle;
        }
    }

</style>
<script>
    import {api_get_reason} from '@/api/package-return'

    export default {
        data() {
            return {
                searchData: {
                    reason_id: 0,
                    shipping_number: ''
                },
                warning: {
                    shipping_number: ''
                },
                typeList: []
            }
        },
        mounted() {
            this.init_type();
        },
        methods: {
            init() {
                this.searchData.shipping_number = this.searchData.shipping_number.trim();
                if (this.searchData.shipping_number === '') return this.$message({type: "warning", message: '请输入面单号'});
                const searchData = Object.assign({}, this.searchData);
                this.warning.shipping_number = '';
                this.$emit('init-data', searchData);
                this.reset_shipping_number();
                this.$refs.shipping_number.focus();
            },
            init_type() {
                this.$http(api_get_reason, {type: 'choose'}).then(res => {
                    this.typeList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            reset_shipping_number() {
                this.searchData.shipping_number = '';
            },
            focus(item) {
                this.$refs[item].$refs.input.select();
            }
        },
        watch: {},
        props: {},
        components: {
            labelItem: require('@/components/label-item').default
        }
    }
</script>
