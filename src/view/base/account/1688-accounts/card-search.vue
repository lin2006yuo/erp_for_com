<template>
    <div class="c-card-search">
        <search-card :params="form" @enter="search" :clears="clears" @search="search">
            <label-buttons :buttons="statusList"
                           label="状态："
                           @select="click_button"></label-buttons>
            <label-item label="1688状态：" >
                <el-select v-model="form.enabled"
                           class="s-width-default"
                           v-sf.enabled
                           filterable>
                    <el-option
                        v-for="res in enabledList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="是否授权：" class="ml-sm">
                <el-select v-model="form.is_authorization"
                           class="s-width-small"
                           v-sf.is_authorization
                           filterable>
                    <el-option
                        v-for="res in authorization"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="" class="ml-sm">
                <el-select v-model="form.type"
                           class="s-width-small"
                           v-sf.type
                           filterable>
                    <el-option
                        v-for="res in typeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
                <el-input v-model="form.text"
                          class="width-super mr-sm ml-xs" v-sf.text></el-input>
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
                statusList:[
                    {label:"全部",value:''},
                    {label:"启用",value:1},
                    {label:"停用",value:0}
                ],
                enabledList:[
                    {label:"全部",value:''},
                    {label:"失效",value:0},
                    {label:"有效",value:1},
                ],
                authorization:[
                    {label:"全部",value:''},
                    {label:"未授权",value:0},
                    {label:"已授权",value:1},
                ],
                typeList:[
                    {label:"账号",value:'account_name'},
                    {label:"简称",value:'code'},
                ]
            }
        },
        methods:{
            click_button(val){
                let value = this.statusList[val].value;
                this.$emit('click-button',value);
            },
            search(){
                this.$emit('search');
            },
        },
        props:{
            form:{
                require:true,
                type:Object
            },
            clears:{
                require:true,
                type:Object
            },
        },
        components: {
            labelItem:require('../../../../components/label-item.vue').default,
            labelButtons:require('../../../../components/label-buttons.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,

        }
    }
</script>
