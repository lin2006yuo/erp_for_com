<template>
    <page class="p-index">
        <search-card :params="searchData" :clears="clears" @search="init">
            <el-select v-model="searchData.snType"
                       class="inline s-width-small"
                       default-first-option filterable>
                <el-option
                    v-for="res in snTypeList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>   
            </el-select>
            <el-input v-model="searchData.snText"
                      autoComplete
                      class='width-super inline'></el-input>
            <label class="ml-sm">状态：</label>
            <el-select v-model="searchData.status" default-first-option
                       class="s-width-small mr-sm inline"
                       filterable clearable>
                <el-option
                    v-for="res in statusList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>   
            </el-select>   
        </search-card>
        <div class="mt-sm mb-sm ml-sm">
            <permission tag="ElButton"
                        type="primary" size="mini"
                        class="inline" @click.native="add_department"
                        :route="apis.add_target_department">添加部门</permission>
            <permission tag="ElButton"
                        type="primary" size="mini" class="inline"
                        @click.native="batch_set_target"
                        :route="apis.url_save_import">批量设置成员考核目标</permission>
        </div>
        <table-data :table-data="tableData"
                    @add-member="table_add_member"
                    @add-group="table_add_group"
                    @edit-group="edit_group"
                    @edit-member="edit_member"
                    @edit="edit"></table-data>
        <add-department v-model="departmentDialog"
                        cur-page="seller"
                        :id="curId"></add-department>
        <add-group v-model="groupDialog"
                   :cur-row="curRow"
                   cur-page="seller"
                   :id="curId" ></add-group>
        <add-member v-model="memberDialog"
                    :cur-row="curRow"
                    cur-page="seller"
                    :id="curId"></add-member>
        <batch-set-target v-model="setTargetDialog" cur-page="seller"></batch-set-target>
        <edit-member v-model="editMemberDialog"
                     :superior="superior"
                     cur-page="seller"
                     :id="curId"></edit-member>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_target_department,api_get_get_gepartment,api_get_target_user,
        add_target_department,url_save_import} from '@/api/target-configure';
    export default {
        permission:{
            add_target_department,
            url_save_import
        },
        data() {
            return {
                curId:0,
                clears:{
                    snType:1,
                },
                searchData:{
                    snType:1,
                    status:'',
                    snText:'',
                },
                statusList:[
                    {label:'全部',value:''},
                    {label:'启用',value:0},
                    {label:'停用',value:1},
                ],
                snTypeList:[
                    {label:'部门/小组',value:1},
                    {label:'成员名称',value:2},
                ],
                departmentDialog:false,
                groupDialog:false,
                memberDialog:false,
                setTargetDialog:false,
                editMemberDialog:false,
                tableData:[],
                curRow:{},
                superior:{},
            }
        },
        mounted(){
            this.init();
            this.get_department();
        },
        methods:{
            init(){
                if(this.searchData.snType===1){
                    let params = {
                        snText:this.searchData.snText,
                        status:this.searchData.status,
                    };
                    this.search__department_group(params);
                }else{
                    let params = {
                        department_id:'',
                        user_name:this.searchData.snText,
                        status:this.searchData.status,
                    };
                    this.search_member(params);
                }
            },
            //部门||小组的搜索
            search__department_group(params){
                this.$http(api_target_department,params).then(res => {
                    let get_childs = (child_ids)=>{
                        return child_ids.map(item=>{
                            if(res[item]&&res[item].child_ids&&res[item].child_ids.length>0){
                                this.$set(res[item],'isShow',true);
                                res[item].child_ids = get_childs(res[item].child_ids);
                            }
                            return res[item]||'';
                        });
                    };
                    let list = Object.keys(res).map(row=>{
                        return res[row]
                    }).filter(row=>{
                        if(row.parents&&row.parents.length>0&&row.pid!==0){
                            let find = row.parents.find(item=>{
                                return Object.keys(res).includes(String(item))
                                
                            });
                            return !find;
                        }else{
                            return row.pid===0;
                        }
                    });
                    list.forEach(row=>{
                        if(row.child_ids&&row.child_ids.length>0){
                            this.$set(row,'isShow',true);
                            row.child_ids = get_childs(row.child_ids).filter(row=>!!row);
                        }
                    });
                    this.tableData = list;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            //成员的搜索
            search_member(params){
                this.tableData = [];

                this.$http(api_get_target_user,params).then(res => {
                    this.tableData = res;
                }).catch(code => {
                    console.log(code.message||code);
                })
            },
            add_department(){
                this.curId = 0;
                this.departmentDialog = true;
            },
            edit(row){
                this.curId = row.id;
                this.departmentDialog = true;
            },
            edit_group(row){
                this.curId = row.id;
                this.curRow = {};
                this.groupDialog = true;
            },
            edit_member(row){
                console.log(row,'row');
                this.curId = row.user_id;
                this.editMemberDialog = true;
            },
            table_add_group(row){
                this.curId = 0;
                this.curRow = row;
                this.groupDialog = true;
            },
            table_add_member(row){;
                this.curId = 0;
                this.curRow = row;
                this.memberDialog = true;
            },
            batch_set_target(){
                this.setTargetDialog = true;
            },
            get_department(val){
                this.superior={};
                this.$http(api_get_get_gepartment).then(res=>{
                    if(res instanceof Array) return;
                    this.superior=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            addDepartment:require('./add-department.vue').default,
            addGroup:require('./add-group.vue').default,
            addMember:require('./add-member.vue').default,
            tableData:require('./table-data').default,
            batchSetTarget:require('./batch-set-target.vue').default,
            editMember:require('./edit-member.vue').default,

        }
    }
</script>