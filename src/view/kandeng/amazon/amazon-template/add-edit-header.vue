<template>
    <table class="template">
        <tr>
            <th class="required-sign">平台站点：</th>
            <td>
                <el-select v-model="form.site"
                           @change="change_site"
                           filterable clearable>
                    <el-option
                            v-for="res in siteList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </td>
            <th class="required-sign">{{comHeader}}</th>
            <td>
                <el-input v-model="form.name"></el-input>
            </td>
            <template v-if="type===1">
                <th class="required-sign">亚马逊分类</th>
                <td>
                    <el-select :value="form.firstTypeId"
                               clearable filterable
                               class="inline"
                               style="min-width:80px"
                               :placeholder="comPlaceholder"
                               @input="(val)=>{change_first_class(val)}">
                        <el-option v-for="row in className"
                                   :label="row.name"
                                   :value="row.type_id"
                                   :key="row.type_id"></el-option>
                    </el-select>
                    <el-select :value="form.childTypeId"
                               @input="(val)=>{change_child_class(val)}"
                               clearable filterable
                               class="inline"
                               style="min-width:80px"
                               v-if="childClassName.length>0">
                        <el-option v-for="row in childClassName"
                                   :label="row.name"
                                   :value="row.type_id"
                                   :key="row.type_id"></el-option>
                    </el-select>
                </td>
            </template>
            <th>状态：</th>
            <td>
                <el-switch v-model="form.status"
                           on-text="启用"
                           off-text="停用"></el-switch>
            </td>
            <th>是否默认模板：</th>
            <td>
                <el-radio class="radio" v-model="form.default" :label="1">是</el-radio>
                <el-radio class="radio" v-model="form.default" :label="0">否</el-radio>
            </td>
        </tr>
    </table>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_site_creator,api_get_amazon_categorybase} from '../../../../api/product-category-api';
    export default {
        data() {
            return {
                siteList:[],
                className:[],
            }
        },
        mounted(){
            this.get_site_creator();
        },
        methods:{
            change_first_class(val){
                if(this.form.detail.length<=0&&this.form.variant.length<=0){
                    this.form.firstTypeId = val;
                    this.form.childTypeId = '';
                    let find = this.className.find(row=>row.type_id===val);
                    this.form.class_name = find?find.name:'';
                }else{
                    this.$confirm(`更改分类将会清除已添加的产品元素 ,确认此操作吗?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.form.firstTypeId = val;
                        this.form.detail = [];
                        this.form.variant = [];
                        let find = this.className.find(row=>row.type_id===val);
                        this.form.class_name = find?find.name:'';
                        this.form.childTypeId = '';
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    })
                }
            },
            change_child_class(val){
                let find = this.childClassName.find(row=>row.type_id===val);
                if(this.form.detail.length<=0&&this.form.variant.length<=0){
                    this.form.child_name = find?find.name:'';
                    this.form.childTypeId  = val;
                }else{
                    this.$confirm(`更改分类将会清除已添加的产品元素 ,确认此操作吗?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.form.child_name = find?find.name:'';
                        this.form.childTypeId  = val;
                        this.form.detail = [];
                        this.form.variant = [];
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    })
                }
            },
            change_site(){
                if(this.type===1){
                    this.get_amazon_categorybase();
                    this.form.firstTypeId = '';
                }
            },
            get_amazon_categorybase(){
                this.$http(api_get_amazon_categorybase,this.form.site).then(res=>{
                    this.className = res.list;
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            get_site_creator(){//type类别，2产品，1分类
                this.$http(api_get_site_creator,this.type).then(res=>{
                    this.siteList = res.site;
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
        },
        computed:{
            comHeader(){
                switch (this.type){
                    case 1:
                        return '分类模板名称：';
                    case 2:
                        return '产品模板名称：';
                    default:
                        return 'type 有误';
                }
            },
            comPlaceholder(){
                if(this.form.site===''){
                    return '请先选择站点';
                }else if(this.form.site&&this.className.length<=0){
                    return '当前站点下暂无分类';
                }else{
                    return '请选择分类';
                }
            },
            childClassName(){
                let list = [];
                let find = this.className.find(row=>this.form.firstTypeId===row.type_id);
                if(find) list = find.childs;
                return list;
            },
        },
        props:{
            form:{
                required:true,
                type:Object
            },
            type:{
                required:true,
                type:Number
            }
        },
        components: {

        }
    }
</script>