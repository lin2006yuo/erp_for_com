<template>
    <page-dialog :title="title"
                 class="p-export-field"
                 min-height="500"
                 v-model="visable"
                 size="large"
                 @open="open"
                 :close-on-click-modal="false">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="mb-md ml-xs">全部字段</div>
                <table class="template ">
                    <thead>
                    <th>序号</th>
                    <th>名称</th>
                    <th>
                        <el-checkbox v-model="checkAll"></el-checkbox>
                    </th>
                    </thead>
                    <tbody class="table-height" >
                    <tr v-for="(item,i) in fields" :key="item.key">
                        <td>{{i+1}}</td>
                        <td>{{item.title}}</td>
                        <td>
                            <el-checkbox :value="checkStatus(item)" @input="change_status(item)"></el-checkbox>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </el-col>
            <el-col :span="12">
                <template >
                    <div  class="mb-xs">
                        <label >模板名称:</label>
                        <ui-autocomplete v-model="templateInfo.name"
                                         :fetch-suggestions="querySearch"
                                         placeholder="请输入或选择模板..."
                                         @blur="template_blur"
                                         @select="handleSelect"
                                         ref="autocomplete"
                        >
                        </ui-autocomplete>
                        <el-button class="inline" type="primary" @click="save_template" size="mini">存为模板</el-button>
                        <el-button class="inline" type="primary" @click="export_excel" size="mini">导出Excel</el-button>
                        <el-button class="inline" type="primary" @click="del_template" size="mini" v-if="templateInfo.id">删除模板</el-button>
                    </div>
                    <table class="template ">
                        <thead>
                        <th>序号</th>
                        <th>名称</th>
                        <th>操作</th>
                        </thead>
                        <tbody class=" template-sort  table-height">
                        <tr v-for="(item,index) in templateInfo.list " :key="item.id">
                            <td>{{index+1}}</td>
                            <td>
                                <el-input v-model="item.show_field" class="s-width-default"></el-input>
                            </td>
                            <td  :data-param="index" v-drag2="drag">
                                <span class="btn-small up invoice invoice-up" @click="up(index)"></span>
                                <span class="btn-small down invoice invoice-down" @click="down(index)"></span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </template>
            </el-col>
        </el-row>
    </page-dialog>
</template>
<style lang="stylus" scoped>
    .invoice {
        padding: 5px;
        width: 16px;
        height: 16px;
        &:hover {
            background-color: rgba(7, 17, 27, .3);
            border-radius: 3px;
        }
        &:active {
            background-color: rgba(7, 17, 27, .5);
            border-radius: 3px;
        }
    }
    .invoice-up {
        background: url('../assets/turnUp .png') no-repeat 5px 5px;
    }
    .invoice-down {
        background: url('../assets/turnDown.png') no-repeat 5px 5px;
    }
    .table-height{
        max-height :500px;
        overflow-y auto
    }
    .template-sort{
        tr:first-child{
            .up{
                display none
            }
        }
        tr:last-child{
            .down{
                display none
            }
        }
    }
</style>
<script>
    import {api_goods_export_template_info,api_goods_export_template_save,api_goods_export_template_del} from '@/api/product-library'
    export default {
        data() {
            return {
                visable:false,
                show:false,
                templateInfo:{
                    id:'',
                    name:"",
                    list:[]
                },
            }
        },
        computed: {
            checkAll:{
                set(val){
                    if(val){
                        this.fields.forEach(row=>{
                            let find=this.templateInfo.list.find(item=>item.field===row.key);
                            !find&&this.templateInfo.list.push({show_field:row.title,field:row.key})
                        });
                    }else {
                        this.templateInfo.list=[];
                    }
                },
                get(){
                    return  this.fields.every(row=>{
                        return this.templateInfo.list.some(item=>item.field===row.key)
                    })
                }
            },
        },
        methods: {
            open(){
            },
            querySearch(queryString, cb){
                let restaurants = this.templates;
                let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            createFilter(queryString){
                return (item) => {
                    return (item.value.indexOf((queryString.toLowerCase())) === 0)
                }
            },
            template_blur(){
                if(!this.templateInfo.name){
                    this.templateInfo.id=''
                    return;
                }
                if(this.show){this.show=false;return}
                let find=this.templates.find(row=>row.value===this.templateInfo.name);
                if(!!find){
                    this.$http(api_goods_export_template_info,find.id).then(res=>{
                        Object.assign(this.templateInfo,{id:find.id,list:res});
                    }).catch(code => {
                        this.$message({type:"error",code:code.message||code})
                    });
                }else {
                    this.templateInfo.id=''
                }
            },
            handleSelect(item){
                this.show=true;
                this.$http(api_goods_export_template_info,item.id).then(res=>{
                    Object.assign(this.templateInfo,{id:item.id,list:res});
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            checkStatus(item){
                return !!this.templateInfo.list.find(f => f.field === item.key);
            },
            change_status(item){
                let index=this.templateInfo.list.findIndex(row=>row.field===item.key);
                if(index>-1){
                    this.templateInfo.list.splice(index,1)
                }else {
                    this.templateInfo.list.push({show_field:item.title,field:item.key})
                }
            },
            //删除模板
            del_template(){
                this.$http(api_goods_export_template_del,this.templateInfo.id).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('getTemplate')
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });

            },
            drag(src, dist){
                src = parseInt(src);
                dist = parseInt(dist);
                if(isNaN(src) || isNaN(dist)){return;
                }let oelement = this.templateInfo.list[src];
                this.templateInfo.list.splice(src,1);
                this.templateInfo.list.splice(dist,0,oelement);
            },
            up(index){
                let datas = this.templateInfo.list.splice(index - 1, 1);
                this.templateInfo.list.splice(index, 0, datas[0]);
            },
            down(index){
                let datas = this.templateInfo.list.splice(index + 1, 1);
                this.templateInfo.list.splice(index, 0, datas[0]);
            },
            save_template(){
                if(!this.templateInfo.name) return this.$message({type:"info",message:'请输入模板名称'})
                if(!this.templateInfo.list.length) return this.$message({type:"info",message:'请选择导出字段'});
                let data={
                    name:this.templateInfo.name,
                    list:this.templateInfo.list.map((row,i)=>{row.sort=i;return row}),
                };
                Object.assign(data,this.param)
                this.templateInfo.id&&(data.id=this.templateInfo.id);
                this.$http(api_goods_export_template_save,data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('getTemplate')
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            export_excel(){
                if(this.templateInfo.list.length===0){
                    this.$message({type:'warning',message:'请勾选需要导出的参数或选择已保存的模版！'});
                    return
                };
                let pram =this.fixparam(this.templateInfo.list);
                this.creatExcel(pram,this.templateInfo.list).then(res=>{
                    this.visable=false;
                });
            }
        },
        watch: {
            visable(val){
                this.$emit('input',val)
            },
            value(val){
                this.visable=val;
            }
        },
        filters: {},
        props: {
            value:{},
            title:{},
            creatExcel:{
                type:Function,
            },
            fields:{
                required:true,
                type:Array
            },
            templates:{
                required:true,
                type:Array
            },
            param:{
                type:Object,
                default(){
                    return {
                        type:1
                    }
                }
            },
            fixparam:{
                type:Function,
                default:function(list){
                    return {field:list.map(row=>row.field)}
                }
            }

        },
        components: {
            pageDialog:require("@/components/page-dialog").default,
            uiAutocomplete:require('@/components/ui-autocomplete').default
        }
    }
</script>

