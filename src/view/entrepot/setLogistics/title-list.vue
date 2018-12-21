<template>
    <div class="inline">
        <label-item label="物流类型：" class="inline" v-if="logistics">
            <el-select v-model="logisticType" class="width-lg">
                <el-option v-for="item in logisticTypes"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value"
                ></el-option>
            </el-select>
        </label-item>
        <label-item label="仓库类型：" class="inline" v-if="warehouse">
            <el-select v-model="storeType" class="width-lg">
                <el-option v-for="item in storeTypes"
                           :label="item.name"
                           :value="item.code"
                           :key="item.code"
                ></el-option>
            </el-select>
        </label-item>
        <el-input class="inline width-super" v-model="key" placeholder="请输入名称/代码..."
                  @keyup.native.enter="search"></el-input>
        <el-button class="ml-sm" type="primary" @click.native="search" size="mini inline" icon="search">搜索</el-button>

        <permission tag="ElButton" type="primary" @click.stop.prevent.native="add" size="mini inline"
                    :route="apis[label]" icon="plus">添加
        </permission>
    </div>
</template>
<style lang="stylus">
    .p-index_ {
        border: 1px solid #6495ED;
        margin-top: 2px;
        .xmj-title_ {
            box-sizing: border-box;
            padding: 3px 8px;
            height: 25px;
            line-height: 19px;
            background-color: #6495ED;
            color: #fff;
            font-weight: bold;
        }
    }

    .card-box {
        margin: 5px 10px 5px 10px;
    }
</style>
<script>
    import {url_store_add, store_type} from "@/api/storeManagement"
    import {url_logistics_add} from "@/api/setLogistics"
    import {url_add_collector} from "@/api/collector";

    export default {
        permission: {
            url_store_add,
            url_logistics_add,
            url_add_collector,
        },
        data() {
            return {
                key: '',
                logisticType: -1,
                storeType: 0,
                logisticTypes: [
                    {label: "API对接物流商", value: 1},
                    {label: "无对接物流商", value: 0},
                    {label: "全部", value: -1},
                ],
                storeTypes: []
            }
        },
        mounted() {
            this.get_store_type();
        },
        methods: {
            get_store_type() {
                this.$http(store_type).then(res => {
                    this.storeTypes = [{code: 0, name: '全部'}, ...res];
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    });
                });
            },
            search() {
                typeof this.key === 'string' && (this.key = this.key.trim());
                let type = this.logistics ? this.logisticType : this.storeType;
                this.$emit('search', this.key, type);
                /*if (this.logistics) {
                    this.$emit('search', this.key, this.type);
                } else {
                    this.$emit('search', this.key);
                }*/
            },
            add() {
                this.$emit('add')
            }
        },
        computed: {
            logistics() {
                return this.label === 'url_logistics_add';
            },
            warehouse() {
                return this.label === 'url_store_add';
            }
        },
        props: {
            label: {
                required: true,
                type: String
            }
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
        }
    }
</script>
