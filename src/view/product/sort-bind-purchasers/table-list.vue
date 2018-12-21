<template>
   <div>
       <el-table :data="tableData.lists" border  class="mb-sm scroll-bar"  v-loading="loading"
                 v-resize="{height:41}"
                 element-loading-text="玩命加载中..."
                 @selection-change="selection_change"
                 style="width: 100%"
       >
           <div slot="empty" class="no-data-reminder">
               <i></i>
               {{emptyText}}
           </div>
           <el-table-column  label="ID" width="85" prop="id">

           </el-table-column>
           <el-table-column  label="分类名称" inline-template >
                <span >{{row.name_path |filterName}}</span>
           </el-table-column>
           <el-table-column  label="采购员"prop="purchaser">

           </el-table-column>
           <el-table-column label="操作" inline-template>
               <div>
                   <span class="operate" @click="check(row)" >查看</span>
                   &nbsp;|&nbsp;
                   <span class="operate" @click="edit(row)">修改</span>
                   &nbsp;|&nbsp;
                   <span class="operate" @click="active(row)"> 操作日志</span>
               </div>
           </el-table-column>
       </el-table>
       <el-pagination
               class="page-fixed"
               @size-change="size_change"
               @current-change="current_change"
               :current-page="tableData.page"
               :page-sizes="[20, 50, 100, 200,500]"
               :page-size="tableData.pageSize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="tableData.total">
       </el-pagination>
   </div>
</template>

<script>
    export default {
        methods: {
            selection_change() {

            },
            active(row){
                this.$emit('log-operate',row)
            },
            check(row){
                this.$emit('check',row)
            },
            edit(row){
                this.$emit('edit',row)
            },
            current_change(val){
                this.$emit('current-change',val);
            },
            size_change(val){
                this.$emit('size-change',val);
            },
        },
        filters:{
            filterName(val){
                let t = val.replace(/-/g,'>>');
                if(/（/.test(val)){// val.include('（')
                    let title = t.replace(t.substring(t.indexOf('（'),t.indexOf('）')+1),'');
                    return title
                }else {
                    return t
                }

            }
        },
        computed: {
            emptyText() {
                return this.firstTime ? '请查询数据' : '暂无数据'
            }
        },
        props:{
            loading:{},
            firstTime:{},
            tableData:{}
        },
    }
</script>

<style scoped>

</style>
