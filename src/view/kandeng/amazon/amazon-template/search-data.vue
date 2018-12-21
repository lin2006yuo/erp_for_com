<template>
    <div class="c-search-list">
         <search-card :params="searchData" @search="search" :clears="clears">
             <label-buttons label="状态："
                            @select="change_status"
                            :buttons="statusList"></label-buttons>
             <label-item label="站点：">
                 <el-select v-model="searchData.site"
                            class="s-width-small"
                            v-sf.site
                            filterable clearable>
                     <el-option
                         v-for="res in siteList"
                         :label="res.label"
                         :value="res.value"
                         :key="res.id"
                     ></el-option>   
                 </el-select>   
             </label-item>
             <label-item label="创建人：" class="ml-sm">
                 <el-select v-model="searchData.create_id"
                            v-sf.create_id
                            class="s-width-default"
                            filterable clearable>
                     <el-option
                         v-for="res in creatorList"
                         :label="res.label"
                         :value="res.value"
                         :key="res.value"
                     ></el-option>
                 </el-select>
             </label-item>
             <label-item label="产品模板名称："class="ml-sm mr-sm">
                 <el-input v-model="searchData.name" class="s-width-middle" @keyup.native.enter="search" v-sf.name></el-input>
             </label-item>
         </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_site_creator} from '../../../../api/product-category-api';
    export default {
        data() {
            return {
                siteList:[],
                creatorList:[],
                statusList:[//空值为全；1已启用，0已停用
                    {label:"全部",value:""},
                    {label:"已启用",value:1},
                    {label:"已停用",value:0},
                ]
            }
        },
        mounted(){
            this.get_site_creator();
        },
        methods:{
            get_site_creator(){//type类别，1产品，2分类
                this.$http(api_get_site_creator,this.type).then(res=>{
                    this.siteList = res.site;
                    this.creatorList = res.creator;
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            change_status(val){
                let value = this.statusList[val].value;
                this.$emit('change-status',value);
            },
            search(){
                this.$emit('search');
            },
        },
        props:{
            searchData:{},
            clears: {},
            type:{
                required:true,
                type:Number
            }
        },
        components: {
            labelItem:require('../../../../components/label-item.vue').default,
            labelButtons:require('../../../../components/label-buttons.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
        }
    }
</script>