<template>
    <page-dialog v-model="show" :title="title" @open="open"
                 size="small" :close-on-click-modal="false">
        <el-button v-if="!status" @click.native="append" type="primary" size="mini mb-sm">新增</el-button>
        <el-table :data="data">
            <el-table-column label="负责的子类" inline-template>
                <el-autocomplete
                        class="autocomplete-li"
                        popper-class="autocomplete-li"
                        v-model="row.category_name"
                        :fetch-suggestions="(q,c)=>{classifyQuery(row,q,c)}"
                        custom-item="form-info-class"
                        placeholder="请输入子类"
                        @select="(val)=>{classifySelect(val,row)}"
                        icon="search"
                ></el-autocomplete>
            </el-table-column>
            <el-table-column label="采购员" inline-template>
                <el-autocomplete
                        class="autocomplete-li"
                        popper-class="autocomplete-li"
                        v-model="row.purchase_name"
                        :fetch-suggestions="(q,c)=>{buyerQuery(row,q,c)}"
                        custom-item="form-info-class"
                        placeholder="请输入采购员"
                        @select="(val)=>{buyerSelect(val,row)}"
                        icon="search"
                ></el-autocomplete>
            </el-table-column>
            <el-table-column v-if="!status" label="操作"
                             inline-template
            >
                <span class="btn" @click="remove(row)">删除</span>
            </el-table-column>
        </el-table>
        <span slot="footer">
            <permission tag="request-button"
                        req-key=""
                        @click="add"
                        :route="apis.url_add"
                        v-if="!status"
                        :title="data.length > 0 ? '提交保存' : '请新增子类...'"
                        :disabled="data.length <= 0">确定</permission>
            <permission tag="requestButton" :route="apis.url_edit" v-else :request="edit" type="primary">确定</permission>
            <el-button @click.native="cancel" size="mini">取消</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .autocomplete-li{
        width:100%;
        .bind{
            color: #7d7e78;
            cursor: not-allowed;
        }
    }
</style>
<script>

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
    import {api_add,api_edit,url_add,url_edit} from '../../../api/classify-bind-buyer'
    import {api_product_category} from '../../../api/product-class'
    import {api_get_seller} from '../../../api/order-local'
    export default{
    	  permission:{
          url_add,
          url_edit
        },
        data(){
            return{
                show:this.value,
                data:[],
                dataOld:{},
                allclassifys:[],
                buyers:[]
            }
        },
        methods:{
            open(){
                this.data = [];
                if(this.status){
                    this.data.push(this.info);
                }
            },
            classifyQuery(rrow, query, callback){
                this.$http(api_product_category, {subclass:1,content:query}).then(res=>{
                    res = res.map(row=>{
                        row.bind = !!this.data.find(buy=>buy.category_name === row.name)
                        return row;
                    });
                    callback(res);
                    if(res.length <= 0){
                        delete rrow.classify;
                        rrow.category_name = '';
                    }
                    if(res.length === 1){
                        this.classifySelect(res[0],rrow);
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            classifySelect(select,row){
                if(select.bind){
                    return this.$message({
                        type:'error',
                        message:'无法选择已被其它地方使用过的值'
                    })
                }
                row.category_name = select.name;
                row.classify = select;
            },
            buyerQuery(rrow, query, callback){
                this.$http(api_get_seller, {content:query}).then(res=>{
                    res = res.map(row=>{
                        row.name = row.realname;
                        return row;
                    });
                    callback(res);
                    if(res.length <= 0){
                        delete rrow.buyer
                        rrow.purchase_name = '';
                    }
//                    if(res.length === 1){
//                        this.buyerSelect(res[0],rrow)
//                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            buyerSelect(select,row){
                row.purchase_name = select.name;
                row.buyer = select;
            },
            append(){
                this.data.push({
                    category_name:'',
                    purchase_name:''
                });
            },
            cancel(){
            	this.data.forEach(res=>{
                    res.category_id = this.dataOld.category_id;
                    res.purchase_id = this.dataOld.purchase_id;
                    res.category_name = this.dataOld.category_name;
                    res.purchase_name = this.dataOld.purchase_name;
                });
                this.show = false;
            },
            add(){
                let len = this.data.length;
                let params = [];
                let addData = [];
                for(let i = 0; i < len; i++){
                    let row = this.data[i];
                    if(!row.classify || !row.buyer){
                        return this.$message({
                            'type':'error',
                            message:'有未填完行...'
                        })
                    }
                    params.push(
                        {
                            category_id:row.classify.id,
                            purchase_id:row.buyer.id,
                        }
                    );
                    addData.push(
                        {
                            category_name:row.classify.name,
                            purchase_name:row.buyer.name,
                        }
                    );
                }
                return this.$http(api_add, params).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message||res,
                    });
                    this.$emit('add-update');
//                    this.$emit('add-update',res.id,addData);
                    this.show = false;
                    return Promise.resolve()
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            edit(){
                let params = {
                    id:this.info.id,
                };
                this.data.forEach(res=>{
                    if(res.classify){
                        params.category_id = res.classify.id;
                    }else{
                        params.category_id = this.info.category_id;
                    }
                });
                this.data.forEach(res=>{
                    if(res.buyer){
                        params.purchase_id = res.buyer.id;
                    }else {
                        params.purchase_id = this.info.purchase_id;
                    }
                });
                    console.log("11",params);
                return this.$http(api_edit, params).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message||res,
                    });
                    let editData = {
                        id:this.info.id,
                    };
                    this.data.forEach(res=>{
                        editData.category_name = res.category_name;
                        editData.purchase_name= res.purchase_name;
                    });
                    this.$emit('edit-update',editData);
                    this.show = false;
                    return Promise.resolve()
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            remove(row){
                const index = this.data.indexOf(row);
                this.data.splice(index, 1);
            }
        },
        computed:{
            title(){
                if(this.status){
                    return `给分类：${this.info.category_name} 绑定采购员`;
                }else{
                    return "新增绑定"
                }
            },
            status(){
                return this.info.id;
            },
            classifys(){
                return this.allclassifys.filter(row=>{
                    this.data.find(buy=>buy.category_name === row.classifysid)
                })
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
            'info'(val){
            	if(val){
                    this.dataOld = window.clone(this.info);
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            info:{
                required:true,
                type:Object
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
