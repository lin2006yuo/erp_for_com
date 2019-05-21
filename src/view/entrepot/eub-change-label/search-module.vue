<template>
    <el-card class="eub-search-module mb-sm">
        <div slot="header" class="clear table_head">
            长沙EUB换单打印
            <div class="fr printer">
                打印机：
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </div>
        </div>
        <label-item label="包裹号/面单号：" class="mt-sm mb-sm" :labelWidth="120">
            <el-input v-model="number"
                      autofocus
                      clearable
                      ref="number"
                      class="width-lg inline"
                      @keyup.enter.native="enter">
            </el-input>
            <div class="ml-sm inline" v-if="!!warningMessage">
                <i class="delete-icon"></i>
                <span class="red tip">{{`${warningMessage}(${cacheNumber})`}}</span>
            </div>
            <div v-if="success" class="ml-sm inline">
                <i class="el-icon-circle-check"></i>
            </div>
        </label-item>
    </el-card>
</template>

<style lang="stylus">
    .eub-search-module {
        .table_head, .printer {
            height: 26px;
            line-height: 26px;
        }
        .printer .inline {
            vertical-align: inherit;
        }
        .tip {
            font-size: 18px;
            line-height: 20px;
            vertical-align: middle;
        }
    }
</style>

<script>
    export default {
        data() {
            return {
                number: '',
                cacheNumber: '',
                printer: '',
            }
        },
        methods: {
            enter() {
                this.number = this.number.trim();
                this.cacheNumber = this.number;
                this.$emit('search', this.number, this.printer);
                this.number = '';
            },
            clear() {
            },
            select() {
                this.$refs.number.inputSelect();
            }
        },
        props: {
            success: {},
            warningMessage: {},
        },
        components: {
            selectPrinter: require('@/components/select-printer.vue').default,
            labelItem: require('@/components/label-item.vue').default
        }
    }
</script>
