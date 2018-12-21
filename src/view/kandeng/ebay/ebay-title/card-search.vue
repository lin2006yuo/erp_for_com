<template>
    <div class="c-search-list">
       <search-card @search="search" :clears="clears" :params="form" >
           <label-item label="" >
               <el-select v-model="form.searchType"
                          class="s-width-small"
                          @change="change">
                   <el-option v-for="item in spu"
                              :label="item.label"
                              :key="item.value"
                              :value="item.value"></el-option>
               </el-select>
           </label-item>
           <label-item label="">
               <order-input class="width-super mr-sm"
                            v-model="form.searchContent"
                            @keydown="key_down"
                            :placeholder="placeholder"></order-input>
           </label-item>
           <label-item label="产品分类：">
               <ui-groups class="mr-sm " v-model="form.localCategoryId"
                          :parent-click="parentClick"
                          :option="categoryTree"></ui-groups>
           </label-item>
           <label class="inline">发布时间：</label>
           <el-date-picker
                   class="inline date"
                   v-model="form.startDate"
                   type="date"
                   placeholder="开始时间"
                   :picker-options="pickerstart"></el-date-picker><span class="inline">- -</span><el-date-picker
               class="inline mr-sm date"
               v-model="form.endDate"
               type="date"
               placeholder="结束时间"
               :picker-options="pickerend"></el-date-picker>
           <label>标题库设置：</label>
           <el-select v-model="form.isset"
                      class="inline s-width-small mr-sm"
                      default-first-option
                      filterable clearable>
               <el-option
                   v-for="res in setList"
                   :label="res.label"
                   :value="res.value"
                   :key="res.value"
               ></el-option>   
           </el-select>   
       </search-card>
    </div>
</template>

<script>
    import {api_joom_category_tree} from  '../../../../api/ebay-title-key'
    export default {
        data() {
            return {
                placeholder:"可批量搜索，Shift+回车换行...",
                parentClick:true,
                categoryTree: [],
                setList:[
                    {label:'全部',value:''},
                    {label:'已设置',value:1},
                    {label:'未设置',value:0},
                ],
                spu: [
                    {label:'本地SPU',value:'spu'},
                    {label:'产品名称',value:'name'},
                    {label:'本地SKU',value:'sku'}
                ],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.form.endDate){
                            return time.getTime()>this.form.endDate;
                        }else{
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.form.startDate){
                            return time.getTime()<this.form.startDate;
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        mounted(){
            this.get_category_tree();
        },
        methods: {
            change(val){
                this.placeholder = val==='name'?'支持模糊搜索':"可批量搜索，Shift+回车换行...";
            },
            search() {
                this.$emit('search')
            },
            get_category_tree(){
                this.$http(api_joom_category_tree).then(res => {
                    this.categoryTree = this.data_format(res.data);
                });
            },
            data_format(val){
                if (val.length === 0) {
                    return null
                }
                return val.map(item => {
                    return {
                        label: item.title,
                        value: item.id,
                        children: this.data_format(item.childs)
                    }
                });
            },
            key_down() {
                this.search();
            },
            data_picker_b(val){
                this.form.startDate = val
            },
            data_picker_e(val){
                this.form.endDate = val
            },
        },
        props:{
            clears:{},
            form:{}
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            uiGroups: require("@/components/ui-groups.vue").default,
        }
    }
</script>

<style lang="stylus">
    .c-search-list{
        z-index :999;
        .el-card{
            overflow: inherit;
        }
    }
</style>