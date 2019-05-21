<template>
    <el-row class="p-joom-table">
        <div>
            <el-table
                v-resize="{height:41}"
                class="scroll-bar"
                :data="tableData" @sort-change="sort_change"
                highlight-current-row
                border v-loading="loading"
                element-loading-text="玩命加载中..."
                @selection-change="selectionChange">
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column label="平台账号" inline-template sortable>
                    <ui-tip :content="row.account_name" v-copy :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="账号简称" inline-template sortable>
                    <ui-tip :content="row.code" v-copy :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="公司名称" inline-template sortable>
                    <ui-tip :content="row.company" v-copy :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="店铺数量" inline-template>
                    <ui-tip :content="row.total" :width="98"></ui-tip>
                </el-table-column>
                <el-table-column label="销售员" inline-template>
                    <div   style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                       <span v-for="(item,sellerIndex) in row.seller" :class="parseInt(item.on_job)!==1?'loseStatus':''" :key="item.customer_id">
                            {{item.seller_name}}{{sellerIndex<(row.seller.length-1)?',':''}}
                        </span>
                    </div>
                </el-table-column>
                <el-table-column label="客服" inline-template>
                    <div  style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                       <span v-for="(item,customerIndex) in  row.customer" :class="parseInt(item.on_job)!==1?'loseStatus':''" :key="item.customer_id">
                            {{item.customer_name}}{{customerIndex<(row.customer.length-1)?',':''}}
                        </span>
                    </div>
                </el-table-column>
                <el-table-column label="注册日期" inline-template width="140px">
                    <span>{{filterRegisterTime(row.register_time)}}</span>
                </el-table-column>
                <el-table-column label="交接日期" inline-template width="140px">
                    <span>{{filterTime(row.fulfill_time)}}</span>
                </el-table-column>
                <el-table-column label="Joom状态" align="center" inline-template>
                    <div :class="parseInt(row.platform_status)===0?'loseStatus':'sucStatus'">
                        {{row.platform_status|filterStatus}}
                    </div>
                </el-table-column>
                <el-table-column label="系统状态" inline-template>
                    <span>{{row.is_invalid|filterStatu}}</span>
                </el-table-column>
                <el-table-column label="账号状态" align="center" inline-template>
                    <ui-tip :content="row.site_status_str"  v-copy></ui-tip>
                </el-table-column>
                <el-table-column label="更新时间" inline-template width="140px">
                    <span>{{filterTime(row.update_time)}}</span>
                </el-table-column>
                <el-table-column label="创建时间" inline-template width="140px">
                    <span>{{filterTime(row.create_time)}}</span>
                </el-table-column>
                <el-table-column
                    inline-template
                    label="操作"
                    align="center" width="220">
                    <div>
                        <permission
                            tag="span"
                            :route="apis.url_joom_list_look"
                            class="operate"
                            @click="check(row)">查看</permission>
                        <permission
                            tag="span"
                            :route="apis.url_joom_list_look">|</permission>
                        <permission tag="span"
                                    :route="apis.url_joom_list_edit"
                                    class="operate"
                                    @click="edit(row)">编辑</permission>
                        <permission
                            tag="span"
                            :route="apis.url_joom_list_look">|</permission>
                        <permission tag="span"
                                    :route="apis.url_joom_account_log"
                                    class="operate"
                                    @click="log(row)">日志</permission>
                    </div>
                </el-table-column>
            </el-table>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .sucStatus {
        color: #339907
    }
    .accout-display{
        swhite-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }
    .loseStatus {
        color: #ff0000;
    }
</style>
<script>
import {
	url_joom_list_look,
    url_joom_list_edit,
    url_get_joom_account_log,
    url_joom_list_status,
    url_joom_account_log,
} from "../../../../api/joom";
    export default{
        permission:{
            url_joom_list_look,
            url_joom_list_edit,
            url_joom_list_status,
            url_joom_account_log
        },
        data(){
            return {
                status:["启用","停用"]
            }
        },
        created(){

        },
        methods:{
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            //查看
            check(row){
                this.$emit('look-form',row);
            },
            //编辑
            edit(row){
                this.$emit('edit-form',row);
            },
            //日志
            log(row){
                this.$emit('log-form',row);
            },
            filterTime(val){
                return datef('YYYY-MM-dd HH:mm:ss',val);
            },
            filterRegisterTime(val){
                return datef('YYYY-MM-dd',val);
            },
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        filters:{
            filterStatus(value) {
                return parseInt(value) ? '有效' : '失效';
            },
            filterStatu(val){
                return val===true?'已启用':'已停用'
            },

        },
        props:{
            tableData:{
                required:true,
                type:Array,
            },
            loading:{
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components: {
            uiTip:require('../../../../components/ui-tip.vue').default
        }
    }
</script>
