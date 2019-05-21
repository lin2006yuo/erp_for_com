<template>
    <div class="c-data-table">
        <el-table
            class="scroll-bar" 
            :data="tableParams.list"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            @selection-change="selectionChange"
            @sort-change="sort_change"
            highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column label="简称" prop="code" sortable></el-table-column>
            <el-table-column label="1688账号" prop="account_name" sortable></el-table-column>
            <el-table-column label="会员身份" inline-template>
                <div>{{row.membership | filterShip}}</div>
            </el-table-column>
            <el-table-column label="1688状态" inline-template>
                <div :class="[row.enabled?'sucStatus':'loseStatus']">{{row.enabled | filerEnabled}}</div>
            </el-table-column>
            <el-table-column width="100" label="系统状态" inline-template>
                <span>{{row.is_invalid | filterStatu}}</span>
            </el-table-column>
            <el-table-column label="失效时间" inline-template sortable>
                <times :time="row.expiry_time"></times>
            </el-table-column>
            <el-table-column label="订单后缀" prop="order_prefix"></el-table-column>
            <el-table-column label="创建时间" inline-template>
                <times :time="row.create_time"></times>
            </el-table-column>
            <el-table-column label="更新时间" inline-template>
                <times :time="row.update_time"></times>
            </el-table-column>
            <!--<el-table-column label="操作" inline-template>-->
                <!--<div>-->
                    <!--<permission tag="span"-->
                                <!--class='operate'-->
                                <!--@click="look(row)"-->
                                <!--:route="apis.url_look_accountlist">查看</permission>-->
                    <!--<permission tag="span"-->
                                <!--:route="apis.url_look_accountlist">|</permission>-->
                    <!--<permission tag="span"-->
                                <!--class='operate'-->
                                <!--@click="edit(row)"-->
                                <!--:route="apis.url_update_accountlist">编辑</permission>-->
                    <!--<permission tag="span"-->
                                <!--:route="apis.url_update_accountlist">|</permission>-->
                    <!--<permission class='operate'-->
                                <!--tag="span"-->
                                <!--:route="apis.url_get_token"-->
                                <!--@click="author_code(row)">{{row.is_authorization | filterAuth}}</permission>-->
                <!--</div>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" width="120" inline-template>
                <trends-select class="inline"
                               :selects="selects(row)"
                               @trigger="trigger(row,$event)"
                               type="primary">
                </trends-select>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="tableParams.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="tableParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableParams.count">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .c-data-table{
        .sucStatus{
            color:#339907
        }
        .loseStatus{
            color:#ff0000;
        }
    }

</style>
<script>
    import {api_set_states} from '../../../../api/1688-accounts';
    import {url_look_accountlist,url_update_accountlist,url_get_token} from '@/api/1688-accounts';
    export default {
        permission:{
            url_look_accountlist,
            url_update_accountlist,
            url_get_token
        },
        data() {
            return {
                selects(row){
                    let is_authorization = row.is_authorization ? '已授权' : '未授权';
                    return this.selects=[
                        {label:'查看',value:0},
                        {label:'编辑',value:1},
                        {label:is_authorization,value:2}
                    ]
                }
            }
        },
        filters:{
            filterAuth(val){
                switch(Number(val)){
                    case 0:
                        return '未授权';
                    case 1:
                        return '已授权';
                }
            },
            filerEnabled(val){
                switch(Number(val)) {
                    case 0:
                        return '失效';
                        break;
                    case 1:
                        return '有效';
                        break;
                }
            },
            filterShip(val){
                switch(Number(val)){
                    case 1:
                        return '企业单位';
                        break;
                    case 2:
                        return '事业单位或社会团体';
                        break;
                    case 3:
                        return '个体经营';
                        break;
                    case 4:
                        return '个人';
                        break;
                }
            },
            filterStatu(val){
                return parseInt(val) ? '已启用':'已停用'
            },
        },
        methods:{
            trigger(row,val){
                switch (val.value){
                    case 0:return this.$emit('look',row);
                    case 1:return this.$emit('edit', row);
                    case 2:return this.$emit('author-code',row);
                }
            },
            selectionChange(select){
                this.$emit('selection-change',select)
            },
            sort_change(val){
                this.$emit('sort-change',val);
            },
            handle_size_change(size){
                this.$emit('change-size',size);
            },
            handle_current_change(page){
                this.$emit('change-page',page);
            },
            // look(row){
            //     this.$emit('look',row);
            // },
            // edit(row){
            //     this.$emit('edit',row);
            // },
            // author_code(row){
            //     this.$emit('author-code',row);
            // },
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        props:{
            tableParams:{
                required:true,
                type:Object
            },
            loading:{
                type:Boolean,
                default(){
                    return false
                }
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components: {
            uiTip:require('@/components/ui-tip.vue'),
            trendsSelect: require('@/components/trends-select.vue').default,
        }
    }
</script>