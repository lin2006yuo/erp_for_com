<template>
    <page class="p-allocation-packing">
        <label-item label="请选择仓库：" class="mb-xs mt-sm">
            <super-select v-model="warehouse_id"
                          @change="init"
                          class="inline width-sm"
                          :options="warehouseList"
                          storageKey="localWarehouse"></super-select>
            <!--<el-select v-model="warehouse_id" @change="init" class="inline width-sm">-->
                <!--<el-option-->
                        <!--:key="item.value"-->
                        <!--v-for="item in warehouseList"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                <!--</el-option>-->
            <!--</el-select>-->
        </label-item>
        <el-card>
            <label-item label="扫描/录入拣货单号开始包装作业：" class="mt-lg mb-lg">
                <el-input ref="number" @keyup.enter.native="submit" v-model="number"></el-input>
                <div v-if="message">
                    <span class="message red"><i class="el-icon-circle-close inline"
                                                 style="font-size:25px;color:red;margin: 0 5px 6px;"></i>{{message}}</span>
                </div>
            </label-item>
        </el-card>
        <div class="box mt-xs">
            <p class="box-title t-left" style="padding-left:10px">正在进行包装作业</p>
            <el-table :data="tableData" class="scroll-bar" v-resize="{height:40}">
                <el-table-column label="排序" type="index">
                </el-table-column>
                <el-table-column label="拣货单号" prop="number"></el-table-column>
                <el-table-column label="包装员" prop="packing_name"></el-table-column>
                <el-table-column label="作业开始时间" inline-template>
                    <span>{{row.packing_start_time}}</span>
                </el-table-column>
            </el-table>
        </div>
    </page>
</template>

<style lang="stylus">
    .p-allocation-packing {
        .c-label-item {
            height: 30px;
            line-height: 30px;
        }

        .message {
            margin-left: 20px;
            font-size: 30px;
        }

        .box {
            border: 1px solid #D3DCE6;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
            .box-title {
                border: 1px solid #D3DCE6;
                text-align: center;
                margin: 0;
                background-color: #6495ed;
                font-size: 1.2rem;
                line-height: 32px;
                height: 32px;
                color: #ffffff;
            }
        }
    }
</style>

<script>
    import {
        api_allocation_packing_list,
        api_allocation_packing_detail,
    } from "@/api/allocation-packing";
    import {api_warehous_local} from "@/api/entrepot-picking";

    export default {
        data() {
            return {
                number: '',
                warehouse_id: 187,
                warehouseList: [],
                tableData: [],
                message: '',
            }
        },
        refresh() {
            this.init();
            this.$nextTick(() => {
                this.$refs.number.inputSelect();
            });
        },
        mounted() {
            this.init_warehouse();
            this.init();
            this.$refs.number.inputSelect();
        },
        methods: {
            init_warehouse() {
                this.$http(api_warehous_local).then(res => {
                    this.warehouseList = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            init() {
                this.$http(api_allocation_packing_list, {warehouse_id: this.warehouse_id}).then(res => {
                    this.tableData = res;
                }).catch(code => {
                    this.tableData = [];
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            submit() {
                this.number = this.number.trim();
                if(this.number === '') {
                    this.message = '请扫描拣货单';
                    this.$message({type: 'error', message: '请扫描拣货单'});
                    return;
                }
                let data = {
                    warehouse_id: this.warehouse_id,
                    number: this.number,
                };
                this.$http(api_allocation_packing_detail, data).then(res => {
                    this.message = '';
                    this.$router.push({
                        path: "/packing-manage/delivery-check",
                        query: data,
                    })
                }).catch(code => {
                    this.message = code.message || code;
                    this.$message({type: 'error', message: code.message || code});
                    this.$refs.number.inputSelect();
                });
            }
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
        }
    }
</script>
