<template>
    <page class="p-add-tag">
        <page-dialog  v-model="show"
                      size="large"
                      :title="title"
                      @open="open"
                      @close="close">
            <label-item class="ml-md mt-md mb-sm" label="部门标签名称：">
                <el-input v-model="searchData.name"></el-input>
                <el-button class="ml-sm"
                           type="primary"
                           size="mini"
                           @click.native="search">
                    搜索
                </el-button>
            </label-item>
            <el-table  :data="tagList" style="width: 100%">
                <el-table-column label="全选" width="50" inline-template >
                    <el-checkbox v-model="row.checked" @change="handle_selection_change($event,row)"></el-checkbox>
                </el-table-column>
                <el-table-column prop="code" label="code"></el-table-column>
                <el-table-column prop="name" label="部门标签名称"></el-table-column>
                <el-table-column prop="typeText" label="类型"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
            </el-table>
            <el-pagination  style="float:right"
                            @size-change="handle_size_change"
                            @current-change="handle_current_change"
                            :current-page="searchData.page"
                            :page-sizes="[20, 50, 100, 200]"
                            :page-size="searchData.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
            </el-pagination>
            <div slot="footer">
                <el-button type="primary" size="mini" @click.native="add">确定</el-button>
                <el-button type="default" size="mini" @click.native="close">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>

<script>
    import {api_search_tag} from '@/api/tag-management'
    export default {
        data(){
            return{
                searchData:{
                    page:1,
                    pageSize:20,
                    status:1,
                    order:1,
                    name:''
                },
                total:10,
                tagList:[],
                selectList:[]
            }
        },
        methods:{
            open(){
                this.get_tag_list({status:1});
            },
            close(){
                this.show=false;
                this.clear_checked();
            },
            handle_current_change(val){
                let data=clone(this.searchData);
                data.page=val;
                this.get_tag_list(data);
            },
            handle_size_change(val){
                let data=clone(this.searchData);
                data.pageSize=val;
                this.get_tag_list(data);
            },
            handle_selection_change(e,row){
                // console.log("选择标签：",e.target.checked);
                // console.log("选择标签：",row);
                if(e.target.checked){
                    this.selectList.push(row);
                }
                else{
                    let index=this.selectList.findIndex(item=>{
                        return item.id===row.id;
                    });
                    if(index>=0){ this.selectList.splice(index,1);}
                }
            },
            get_tag_list(params){
                this.$http(api_search_tag,params)
                    .then(res=>{
                        this.tagList=Object.assign(res.data,{checked:false});
                        this.searchData.page=res.page;
                        this.searchData.pageSize=res.pageSize;
                        this.total=res.count;
                        this.show_checked();
                    })
            },
            //选中已经勾选过的标签
            show_checked(){
                // debugger;
                this.selectedTags.forEach(tag=>{
                    let find=this.tagList.find(item=>{
                        return tag.department_tag_id===item.id;
                    });
                    console.log("find:",find);
                    if(find){find.checked=true;}
                })
            },
            clear_checked(){
               this.tagList.forEach(item=>{
                   item.checked=false;
               })
            },
            search(){
                this.get_tag_list(this.searchData);
            },
            add(){
                this.$emit("tag-select",this.selectList);
                this.clear_checked();
                this.$message({type:'success',message:'添加成功'});
                setTimeout(()=>{
                    this.show=false;
                },300)
            }
        },
        computed:{
            show:{
                get(){
                    return this.value;
                },
                set(val){
                    this.$emit("input",val);
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{},
            selectedTags:{}
        },
        components:{
            pageDialog:require("@/components/page-dialog").default,
            labelItem:require("@/components/label-item").default
        }
    }
</script>
<style lang="stylus">
    .p-add-tag{
        .page-dialog{
            .dialog__body {
                overflow-y hidden;
            }
        }
    }
</style>
