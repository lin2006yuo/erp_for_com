<template>
    <div class="c-demand-schedules-tableModule">
        <el-table class="mb-sm scroll-bar"
                  border :data="tableData"
                  highlight-current-row
                  v-resize="{height:41}"
                  @selection-change="selection_change"
                  v-loading="loading"
                  element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="30" align="center">
            </el-table-column>
            <el-table-column label="通知类型" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="filterType(row.type)">{{filterType(row.type)}}</div>
            </el-table-column>
            <el-table-column label="阅读状态" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.read|filterRead">{{row.read|filterRead}}</div>
            </el-table-column>
            <el-table-column label="发送者" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.create_name">{{row.create_name}}</div>
            </el-table-column>
            <el-table-column label="标题" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.title">{{row.title}}</div>
            </el-table-column>
            <el-table-column label="接收时间" min-width="55" inline-template>
                <div class="p-table-list-td-text" :title="row.send_time|filterDate">{{row.send_time|filterDate}}</div>
            </el-table-column>
            <el-table-column label="操作" min-width="50">
                <template slot-scope="scope">
                    <permission class="operate"
                                tag="span"
                                type="primary"
                                size="mini"
                                :route="apis.url_get_internal_letters_view_letter"
                                @click="look(scope.row)">查看
                    </permission>
                </template>
            </el-table-column>
        </el-table>
        <look-e-maill v-model="lookVisibility"
                      :type-list="typeList"
                      :look-data="lookData"
                      :look-prev="lookPrev"
                      :is-inbox-open="true"
                      :look-next="lookNext"
                      :look-title="lookTitle"
                      @mark_read="mark_read"
                      @look="look"></look-e-maill>
    </div>
</template>
<style lang="stylus">
    .c-demand-schedules-tableModule{
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
<script>
    import {
        api_get_internal_letters_view_letter,
        url_get_internal_letters_view_letter
    } from '../../../api/system-notice-inbox'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'邓海波',
                createTime:'2018-8-22',
                updateTime:'2018-8-31'
            }
        },
        data() {
            return {
                lookVisibility:false,
                lookTitle:'',
                lookData:{},
                lookPrev:{},
                lookNext:{}
            }
        },
        permission:{
            url_get_internal_letters_view_letter
        },
        methods:{
            filterType(val){
                return this.typeList.find(row=>row.value===val)?this.typeList.find(row=>row.value===val).label:val
            },
            selection_change(selects){
                this.$emit('selection-change',selects);
            },
            look(row){
                this.$http(api_get_internal_letters_view_letter,{letter_id:row.letter_text_id}).then(res=>{
                    this.lookData = res.data;
                    let attachment = this.lookData.attachment;
                    if(!!attachment){
                        let file_name = attachment.slice(attachment.lastIndexOf('/')+1);
                        this.$set(this.lookData,'file_name',file_name);
                        this.$set(this.lookData,'imgPath',(/\.(png$|PNG$|jpg$|JPG$|JPEG$)/.test(file_name))?window.config.apiHost+attachment.replace('./',''):'')
                    }
                    this.lookNext = res.next||{};
                    this.lookPrev = res.prev||{};
                    this.lookTitle = '查看站内信';
                    this.lookVisibility = true;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            mark_read(id){
                this.tableData.find(row=>row.letter_text_id===id).read = 1;
                this.$emit('mark-read');
            }
        },
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd HH:mm:ss',val):'-- --';
            },
            filterRead(val){
                return val===1?'已读':'未读';
            },
        },
        computed:{
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        props:{
            tableData:{
                required:true,
                type: Array,
            },
            loading:{
                required:true,
                type: Boolean,
            },
            firstLoading:{
                required:true,
                type:Boolean
            },
            typeList:{
                required:true,
                type:Array
            }
        },
        components:{
            lookEMaill: require('../look-e-maill').default
        }
    }
</script>
