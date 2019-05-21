<template>
    <page class="p-index">
        <div class="mb-xs mt-xs ml-sm">
            <permission tag="ElButton" :route="apis.url_attribute_add" size="mini" @click.native="add_attr" type="primary">添加属性</permission>
            <permission :route="apis.url_attribute_sorts" req-key="attributeSorts" tag="request-button" :disabled="isChange" @click="save">保存排序</permission>
        </div>
        <ui-table :body-height="41"
                  :heads="[
                                {label:'ID',width:2},
                                {label:'属性名称',width:22},
                                {label:'属性类型',width:10},
                                {label:'属性值',width:54},
                                {label:'操作',width:12}
                          ]"
                  v-loading="loading" element-loading-text="玩命加载中...">
            <draggable @update="isChange=false" v-model="propertyData"  class="tbody" tag="tbody">
                <tr v-for="item in propertyData" :key="item.id" :class="item.clickData?'active-color':''" @click="addClass(item)"  >
                    <td>{{item.id}}</td>
                    <td class="drag-public drag-public-right" v-copy>{{item.name}}</td>
                    <td>{{item.type|typeFilter}}</td>
                    <td>
                        <div class="text-overflow">
                            <span v-for="items in item.value" v-copy>{{items.value}}&nbsp;&nbsp;</span>
                        </div>
                        <!--<ui-tip  :content="item.value" :width="98"></ui-tip>-->
                    </td>
                    <td>
                        <permission tag="span" :route="apis.url_attribute_edit" class="operate" @click="curChange(item.id)">修改</permission>
                        <permission tag="span" :route="apis.url_attribute_edit">|</permission>
                        <permission tag="span" :route="apis.url_attribute_del" class="operate" @click="curDelete(item)">删除</permission>
                    </td>
                </tr>
            </draggable>
        </ui-table>
        <edit :editData="editData" :titleName="title"
              :editId="editId" v-model="editVisible"
              @on_submit="on_submit" @edit_attr="edit_attr"></edit>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=params.page
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size=params.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .tbody{
        width:100%;
        overflow-y: auto;
    }
    .attr-cell{
        vertical-align: middle;
        margin:0 0;
        display: inline-block;
        width:600px;
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space:nowrap;
        overflow:hidden;
    }
    .text-overflow{
        width: 860px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
</style>
<script>
    import draggable from '../../../components/drag-drop';
    import edit from './edit.vue';
    import uiTable from "../../../components/ui-table.vue"
    import {
        attribute_list,
        attribute_edit,
        attribute_del,
        api_attribute_sorts,

        url_attribute_add,
        url_attribute_edit,
        url_attribute_del,
        url_attribute_sorts
    } from '../../../api/attribute'
    export default{
        permission:{
            url_attribute_add,
            url_attribute_edit,
            url_attribute_del,
            url_attribute_sorts
        },
        page:{
            devinfo:{
                frontEnd:'王月如;黎宏珍',
                backEnd:'翟斌',
                createTime:'2016-10-27',
                updateTime:'2017-9-26'
            },
            beforeClose(){
                if(this.isChange){
                    return true;
                }else{
                    return this.$confirm(`检测到有数据更改但未保存，此操作将会丢失已更改的最新数据，仍然进行此操作吗?`, '提示', {
                        confirmButtonText: '继续离开',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return true
                    }).catch(code => {
                        return false
                    })
                }
            }
        },
        refresh(){
            this.init();
        },
        data(){
            return {
                editVisible:false,
                propertyData:[],
                total:0,
                params:{
                    page:1,
                    pageSize:50
                },
                editData:{
                    name:'',
                    type:0,
                    value:[],
                    radio:'',
                    code:'',
                    code_val:''
                },
                editId: 0,
                title:'',
                loading:true,
                isChange:true
            }
        },
        created(){
            this.init();
        },
        methods:{
            save(){
                let data = this.propertyData.map((row,index)=>{
                    return {id:row.id,sort:index}
                });
                let params = {sorts:data};
                this.$http(api_attribute_sorts,params).then(res=>{
                    this.$message({
                        type: 'success',
                        message: res.message||res
                    });
                    this.isChange = true;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('attributeSorts',false);
                    },300);
                })
            },
            addClass(data){
                this.propertyData.forEach(item => {
                    this.$set(item, 'clickData',false);
                });
                data.clickData = true;
            },
            init(){
                this.loading = true;
                this.$http(attribute_list,this.params).then(res => {
                    this.propertyData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            //-----------点击添加弹框出现
            add_attr(){
                this.editVisible = true;
                this.editId = 0;
                this.title = '添加属性';
                this.editData = {
                    name:'',
                    type:0,
                    value:[],
                    radio:0,
                    code:'',
                    code_val:''
                }
            },
            //点击按钮submit 提交表单信息
            on_submit(id,val){
                let data = {
                    id:parseInt(id),
                    name:val.name,
                    type:val.type,
                    value:val.attribute_value,
                };
                this.propertyData.push(data);
                this.total += 1;
            },
            //------------更新编辑
            edit_attr(id,params){
                let find=this.propertyData.find(row=>{
                    return row.id===id;
                });
                this.$set(find,'value',params.attribute_value);
                if(!!find){
                    Object.assign(find, params)
                }
            },
            //------------------修改
            curChange(id){
                this.editVisible = true;
                this.editId = id;
                this.editData.radio = 0;
                this.$http(attribute_edit,id).then(res=>{
                    this.editData.code = res.code;
                    this.editData.name = res.name;
                    this.editData.type = res.type;
                    this.editData.value = res.value;
                    this.title = `修改${res.name}属性`;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            curDelete(row){//-------------------------------删除
                this.$confirm('您将删除'+row.name+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(attribute_del,row.id).then(res=>{
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        let index = this.propertyData.findIndex(data=>data.id === row.id);
                        this.propertyData.splice(index,1);
                        this.total--;
                    }).catch(code=>{
                        this.$message({
                            showClose: true,
                            message: code.message||code,
                            type: 'error'
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            handleSizeChange(val){
                this.params.pageSize = val;
                this.init()
            },
            handleCurrentChange(val){
                this.params.page = val;
                this.init()
            },
        },
        filters:{
            typeFilter(val){
                switch (val){
                    case 0:
                        return '单选';
                        break;
                    case 1:
                        return '多选';
                        break;
                    case 2:
                        return '输入框';
                        break;
                }
            }
        },
        components:{
            edit,
            draggable,
            uiTable,
            uiTip:require('../../../components/ui-tip.vue').default,
        }
    }
</script>
