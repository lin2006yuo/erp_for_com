<template>
    <!-- 表格 -->
    <el-table class="mt-xs scroll-bar aleady-table"
              border
              v-resize="{height:50}"
              :data="dataList"
              v-loading="isLoading"
              :row-class-name="row_class_name"
              element-loading-text="玩命加载中..."
              highlight-current-row
              @selection-change="selection">
        <div slot="empty" class="no-data-reminder">
            <i></i>
            {{emptyText}}
        </div>
        <el-table-column type="selection" align="center" width="30"></el-table-column>
        <el-table-column label="图片" inline-template width="70">
            <el-popover
                placement="right"
                trigger="hover">
                <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                <span slot="reference" v-if="row.thumb">
                                <img v-lazy="row.thumb"
                                     style="vertical-align:middle;height:60px;width:60px;border:none">
                            </span>
            </el-popover>
        </el-table-column>
        <el-table-column label="SKU/别名" width="80" inline-template>
            <div>
                <div>{{row.sku}}</div>
                <ui-tip :content="row.sku_alias|filterAlias" :width="98"></ui-tip>
            </div>
        </el-table-column>
        <el-table-column label="名称" inline-template>
            <div v-if="row.company_name">
                <div :title="row.name">{{row.name}}</div>
            </div>
            <div v-else>
                <div style="color:red !important;" class="text_line">{{row.name}}</div>
            </div>
        </el-table-column>
        <el-table-column label="供应商" min-width="68" inline-template row-key="company_name">
            <div class="ellipsis" >
                <span :title="row.company_name" v-if="row.company_name">{{row.company_name}}</span>
                <span v-else class="red">错误供应商</span>
            </div>
        </el-table-column>
        <el-table-column label="最小起订量" inline-template min-width="60">
            <div>{{row.min_qty}}</div>
        </el-table-column>
        <el-table-column label="最新报价" inline-template min-width="60">
            <div class="ellipsis"><span>{{row.audited_currency_code}}</span> <span :title="row.audited_price|filterNewPrice">{{row.audited_price|filterNewPrice}}</span>
            </div>
        </el-table-column>
        <el-table-column label="最新提交报价" inline-template min-width="60">
            <div class="ellipsis"><span>{{row.currency_code}}</span> <span :title="row.price|filterNewPrice">{{row.price|filterNewPrice}}</span></div>
        </el-table-column>
        <el-table-column label="区间报价" align="center" inline-template width="160">
            <div v-for="item in row.section" :key="item.min_quantity">
                <span>{{item.min_quantity}}</span>~<span>{{item.max_quantity?item.max_quantity:'无穷大'}}</span>&nbsp;/&nbsp;<span>{{row.currency_code}}</span>&nbsp;<span>{{item.price | filterPrice}}</span>
            </div>
        </el-table-column>
        <el-table-column align="center" label="3月内最低报价" inline-template min-width="70">
            <div><span v-if="!!row.lowest&&!isNaN(Number(row.lowest))">{{row.currency_code}}</span> <span>{{row.lowest|filterPrice}}</span>
            </div>
        </el-table-column>
        <el-table-column :render-header="filterHeader('180天内|是否有采购')" inline-template min-width="50">
            <div>{{row.is_purchase | filterPur}}</div>
        </el-table-column>
        <el-table-column label="最新报价人员" prop="creator_name" min-width="70">
        </el-table-column>
        <el-table-column label="最新报价时间" inline-template min-width="70">
            <div v-if="row.update_time">
                <times :time="row.update_time"></times>
            </div>
            <div v-else>-- --</div>
        </el-table-column>
        <el-table-column label="采购链接" min-width="70" inline-template>
            <div v-if="row.company_name">
                <a :href="`${row.link}`" target="_blank">
                    <div class="text_line" style="color: #69f;">{{row.link}}</div>
                </a>
            </div>
            <div v-else>
                <a :href="`${row.link}`" target="_blank">
                    <div class="text_line" style="color: red;">{{row.link}}</div>
                </a>
            </div>
        </el-table-column>
        <el-table-column label="审核状态" align="center" inline-template min-width="55">
            <div>{{row.status | filterStatus}}</div>
        </el-table-column>
        <el-table-column label="审核不通过原因" align="center" inline-template min-width="55"
                         v-if="this.curStatus===2">
            <div>
                <ui-tip :content="row.remark" :width="98"></ui-tip>
            </div>
        </el-table-column>
        <el-table-column inline-template label="操作" min-width="55">
            <div>
                <permission tag="span" :route="apis.url_history_offer" class="operate"
                            @click="history_offer(row)">历史报价
                </permission>
            </div>
        </el-table-column>
    </el-table>
</template>
<style scoped>

</style>
<script>
    import {url_history_offer} from '../../../../api/supplier-quote';
    export default {
        name: "table-list",
        permission: {
            url_history_offer
        },
        data(){
          return{

          }
        },
        methods:{
            row_key(row){
                return row && row.order_number;
            },
            selection(val) {
                this.$emit("selection",val)
            },
            row_class_name(row) {
                if (!!row.company_name) {
                    return '';
                } else {
                    return 'red';
                }
            },
            history_offer(row){
                this.$emit('history-offer',row)
            },
            sku_image(images) {
                if (!!images) {
                    return images.replace('_60x60.', '_200x200.')
                }
                return ""
            },
            filterHeader(head) {
                return (h) => {
                    return h('div', [
                        h('div', head.split('|')[0]),
                        h('div', head.split('|')[1])
                    ])
                }
            },
        },
        computed:{
            emptyText() {
                return this.firstLoading ? '等待请求数据中...' : '暂无数据'
            }
        },
        filters:{
            filterAlias(val) {
                return Array.isArray(val) ? val.join(',') : val
            },
            filterStatus(val) {
                switch (val) {
                    case 0:
                        return "未审核";
                        break;
                    case 1:
                        return "审核通过";
                        break;
                    case 2:
                        return "审核未通过";
                        break;
                }
            },
            filterTime(val) {
                if (val) return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            filterPrice(val) {
                return !!val && !isNaN(Number(val)) ? Number(val).toFixed(3) : val;
            },
            filterNewPrice(val) {
                if (Number(val) === 0) {
                    return '- -';
                } else {
                    return Number(val).toFixed(3)
                }
            },
            filterPur(val) {
                return val ? "是" : "否"
            }
        },
        props:{
            dataList:{
                required: true,
                type: Array
            },
            isLoading:{
                default:true,
                type:Boolean
            },
            firstLoading:{
                default:true,
                type:Boolean
            },
            curStatus:{
                default:-1,
            },

        }
    }
</script>

