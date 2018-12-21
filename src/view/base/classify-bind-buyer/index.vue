<template>
    <page>
        <search-card @search="init" @enter='init' :params="form" :clears="clears">
            <label-item label="分类：">
                <el-autocomplete
                        class="autocomplete-li2 inline s-width-large"
                        popper-class="autocomplete-li2"
                        v-sf.classify
                        v-model="form.classify"
                        :fetch-suggestions="classifyQuery"
                        custom-item="form-info-class"
                        placeholder="请输入子类"
                        @select="classifySelect"
                        icon="search"
                ></el-autocomplete>
            </label-item>
            <label-item label="采购员：" class="ml-sm mr-sm">
                <el-autocomplete
                        class="autocomplete-li2 inline"
                        popper-class="autocomplete-li2"
                        v-sf.buyer
                        v-model="form.buyer"
                        :fetch-suggestions="buyerQuery"
                        custom-item="form-info-class"
                        placeholder="请输入采购员"
                        @select="buyerSelect"
                        icon="search"
                ></el-autocomplete>
            </label-item>
            <!--<el-button class="inline ml-sm" type="primary" @click.native="init" size="mini">搜索</el-button>-->
            <!--<clear class="inline" :form="form" :clear-cb="clear"></clear>-->
        </search-card>
            <div class="ml-sm mb-xs mt-xs">
                <permission tag="ElButton"  @click.native="add()" size="mini" type="primary" :route="apis.url_add">添加</permission>
                <permission tag="requestButton" :route="apis.url_del" :request="remove(selected)" :disabled="hasSelected">删除{{selectTitle}}</permission>
            </div>
            <el-table :loading="loading" :data="data" class="template"
                      v-resize="{height:41}"
                      @selection-change="select" highlightCurrentRow>
                <div slot="empty" class="no-data-reminder">
                    <i></i>
                    {{emptyText}}
                </div>
                <el-table-column type="selection" width="35" align="center"></el-table-column>
                <el-table-column label="分类" prop="category_name" align="left"></el-table-column>
                <el-table-column label="采购员" prop="purchase_name"></el-table-column>
                <el-table-column label="创建时间" inline-template>
                    <span>{{row.create_time * 1000 | fdatetime}}</span>
                </el-table-column>
                <el-table-column label="操作" inline-template>
                    <div>
                        <permission tag="span"  @click="edit(row)" class="operate" :route="apis.url_edit"> 编辑</permission>
                        <permission tag="span" :route="apis.url_del_single">|</permission>
                        <permission tag="span" :route="apis.url_del_single" @click="delete_data(row)" class="operate">删除</permission>
                    </div>
                </el-table-column>
            </el-table>
            <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <form-info v-model="formShow" @edit-update="edit_update" @add-update="init" :info="formInfo"></form-info>
    </page>
</template>
<style lang="stylus">
    .autocomplete-li2{
        .bind{
            color: #7d7e78;
            cursor: not-allowed;
        }
    }
</style>
<script>
    import {api_get, api_del,url_del,url_add,url_edit,url_del_single,api_del_single} from '../../../api/classify-bind-buyer'
    import {api_product_category} from '../../../api/product-class'
    import {api_get_seller} from '../../../api/order-local'
    import Vue from 'vue';
    Vue.component('form-info-class', {
        functional: true,
        render: function (h, ctx) {
            var item = ctx.props.item;
            if(item.bind){
                return h('li', ctx.data, [
                    h('div', { attrs: { class: 'name bind' } }, [item.name]),
                ]);
            }else{
                return h('li', ctx.data, [
                    h('div', { attrs: { class: 'name' } }, [item.name]),
                ]);
            }
        },
        props: {
            item: { type: Object, required: true }
        }
    });
    export default{
        permission:{
            url_del,url_add,url_edit,url_del_single
        },
        page:{},
        refresh(){
            this.init();
        },
        data(){
            return {
                firstLoading:true,
                formShow:false,
                form:{
                    classify:'',
                    buyer:'',
                },
                clears:{
                    classify:'',
                    buyer:'',
                },
                data:[
                ],

                total:0,
                page:1,
                pageSize:20,
                selected:[],
                formInfo:{},
                loading:false,
            }
        },
        created(){
            this.init();
        },
        methods:{
            clear(){
                this.form.classify = '';
                this.form.buyer = '';
                delete this.form.classify_;
                delete this.form.buyer_;
                this.init();
            },
            handle_size_change(size){
                this.pageSize = size;
                this.init();
            },
            handle_current_change(page){
                this.page = page;
                this.init();
            },
            init(){
                this.loading = true;
                let params = {
                    pageSize:this.pageSize,
                    page:this.page,
                };
                if(this.form.classify_){
                    params.category_id = this.form.classify_.id;
                }
                if(this.form.buyer_){
                    params.purchase_id = this.form.buyer_.id;
                }
                this.$http(api_get, params).then(res=>{
                    this.data = res.data;
                    this.pageSize = parseInt(res.pageSize);
                    this.page = parseInt(res.page);
                    this.total = parseInt(res.count);
                    this.loading = false;
                    this.firstLoading = false;
                })
            },
            add(){
                this.formInfo = {};
                this.formShow = true;
            },
            edit(row){
                this.formInfo = row;
                this.formShow = true;
            },
            delete_data(datas){
                this.$confirm(`您将删除 ${datas.category_name}，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.$http(api_del_single, datas.id).then(res=>{
                            this.$message({
                                type:'success',
                                message:res.message||res,
                            });
                            let index = this.data.findIndex(item=>{
                            	return item.id === datas.id;
                            });
                                this.data.splice(index,1);
                                this.total-=1;
                        }).catch(code=>{
                            this.$message({
                                type:'error',
                                message:code.message||code,
                            });
                        })
                }).catch(() => {
                });
            },
            remove(datas){
                return(()=>{
                    return this.$confirm(`您将删除已选分类，确认此操作吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return this.$http(api_del,datas).then(res=>{
                            this.$message({
                                type:'success',
                                message:res.message||res,
                            });
                            datas.forEach(data=>{
                                let index = this.data.findIndex(item=>{
                                    return item.id === data;
                                });
                                this.data.splice(index,1);
                                this.total-=1;
                            });
                            return Promise.resolve()
                        }).catch(code=>{
                                        this.$message({
                                          type:'error',
                                          message:code.message || code
                                        })
                                      })
                    }).catch(() => {
                    })
                })
            },
            select(select){
                this.selected = [];
                select.forEach(res=>{
                	if(this.selected.indexOf(res.id)===-1){
                        this.selected.push(res.id);
                    }
                })
            },
            classifyQuery(query, callback){
                this.$http(api_product_category, {subclass:1,content:query}).then(res=>{
                    res = res.map(row=>{
                        return row;
                    });
                    callback(res);
                    if(res.length <=0){
                        delete this.form.classify_;
                        this.form.classify ='';
                    }
                    if(res.length === 1){
                        this.classifySelect(res[0])
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            classifySelect(select){
                console.log(select);
                this.form.classify = select.name;
                this.form.classify_ = select;
            },
            buyerQuery(query, callback){
                this.$http(api_get_seller, {content:query}).then(res=>{
                    res = res.map(row=>{
                        row.name = row.realname;
                        return row;
                    });
                    callback(res);
                    if(res.length <=0){
                        delete this.form.buyer_;
                        this.form.buyer = '';
                    }
                    if(res.length === 1){
                        this.buyerSelect(res[0]);
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            buyerSelect(select){
                this.form.buyer = select.name;
                this.form.buyer_ = select;
            },
            add_update(id,val){
                let create_time = Date.parse(new Date);
                create_time = create_time/1000;
                val.forEach(res=>{
                    let item = {
                        id:id,
                        category_name:res.category_name,
                        purchase_name:res.purchase_name,
                        create_time:create_time,
                    }
                    this.data.unshift(item);
                    this.total += 1;
                });
            },
            edit_update(val){
                this.data.forEach(res=>{
                	if(res.id===val.id){
                        res.category_name = val.category_name;
                        res.purchase_name = val.purchase_name;
                    }
                });
            }
        },
        computed:{
            hasSelected(){
                return this.selected.length <= 0;
            },
            selectTitle(){
                if(!this.hasSelected){
                    return `（已选择 ${this.selected.length} 条）`
                }else{
                    return ''
                }
            },
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            clear:require('../../../components/search-clear.vue').default,
            formInfo:require('./form-info.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
