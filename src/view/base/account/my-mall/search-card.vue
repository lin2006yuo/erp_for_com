<template>
    <div class="c-search-card">
        <search-card @search="search" @enter="search" :params="form" :clears="clears">
            <div>
                <label-buttons class='inline' label="状态：" v-sf.is_invalid
                               @select="select" :buttons="buttons"></label-buttons>
                <label-item label="授权状态：" class="ml-sm inline mb-mini">
                    <el-select class='s-width-small' v-sf.is_authorization
                               @change="change_select"
                               v-model="form.is_authorization" default-first-option filterable clearable>
                        <el-option
                                v-for="res in authorization"
                                :label="res.label"
                                :value="res.value"
                                :key="res.value"
                        ></el-option>
                    </el-select>    
                </label-item>
            </div>
            <label-item label="">
                <el-select class="inline s-width-small mr-xs" v-sf.snType v-model="form.snType"
                           default-first-option filterable clearable>
                    <el-option
                        v-for="res in snTypeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>   
                </el-select>
                <el-input class="inline width-super mr-sm" v-sf.snText v-model="form.snText"
                          default-first-option filterable clearable></el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                authorization:[
                    {label:'全部',value:''},
                    {label:'未授权',value:0},
                    {label:'已授权',value:1},
                ],
                snTypeList:[
                    {label:'MyMall账号',value:'account_name'},
                    {label:'简称',value:'code'},
                ],
                buttons:[
                    {label:'全部',value:''},
                    {label:'已启用',value:1},
                    {label:'已停用',value:0},
                ]
            }
        },
        methods:{
            search(){
                this.$emit('search');
            },
            select(index){
                this.form.is_invalid = this.buttons[index].value;
                this.$emit('select');
            },
            change_select(){
                this.$emit('change-select');
            },
        },
        props:{
            form:{//搜索参数
                type:Object,
                required:true
            },
            clears:{//带有默认值的参数
                type:Object,
                required:true
            },
        },
        components: {
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
            labelButtons:require('../../../../components/label-buttons.vue').default,
        }
    }
</script>