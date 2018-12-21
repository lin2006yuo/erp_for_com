<template>
    <div class="c-card-search p-package-tab-search">
        <search-card :params="form" :clears="clears" @search="search">
            <el-row class="mb-mini">
                <label-buttons
                    :max="15"
                    class="inline p-package-tab-buttons"
                    label="类型："
                    @select="change_type"
                    :buttons="typeButtons">
                </label-buttons>
            </el-row>
            <label-item label="物流错误信息：">
                <el-input v-sf.error_info
                          v-model="form.error_info"
                          @keydown.native.enter="search"
                          placeholder="可模糊搜索"
                          class="inline enter-result s-width-large"></el-input>
            </label-item>
            <el-select v-model="form.type"
                       class="s-width-small inline ml-sm"
                       clearable
                       v-sf.creator_id>
                <el-option
                    v-for="res in typeList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <el-select v-model="form.creator_id"
                       class="s-width-small inline"
                       clearable
                       v-if="form.type==='creator'"
                       v-sf.creator_id>
                <el-option
                    v-for="res in operatorList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <el-select v-model="form.updater_id"
                       class="s-width-small inline"
                       clearable
                       v-else
                       v-sf.updater_id>
                <el-option
                    v-for="res in updaterList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <el-select v-model="form.time_type"
                       class="s-width-small inline ml-sm"
                       v-sf.time_type>
                <el-option
                    v-for="res in timeTypeList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <el-date-picker class="date inline"
                            v-model="form.starttime"
                            :picker-options="picker_b"
                            v-sf.starttime
                            placeholder="开始时间"></el-date-picker> --
            <el-date-picker
                    class="date inline"
                    placeholder="结束时间"
                    v-model="form.endtime"
                    v-sf.endtime
                    :picker-options="picker_e"></el-date-picker>
            <label-item class="ml-sm mr-sm" label="物流渠道：">
                <el-input v-sf.sn_text
                          v-model="form.shipping_name"
                          @keydown.native.enter="search"
                          placeholder="可模糊搜索"
                          class="inline enter-result s-width-large"></el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-card-search {
        .el-card {
            overflow: inherit;
            .p-package-tab-buttons {
                position: relative;
                top: 2px;
            }
        }
    }
</style>
<script>
    import {api_get_packages_error_developers,api_get_packages_error_updaters} from '@/api/error-info-solution'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'邓海波',
                createndtime:'2018-8-22',
                updatendtime:'2018-8-31'
            }
        },
        data() {
            return {
                typeList:[
                    {label:'创建人',value:'creator'},
                    {label:'更新人',value:'updater'}
                ],
                operatorList:[],
                updaterList:[],
                timeTypeList:[
                    {label:'创建时间',value:'create_time'},
                    {label:'更新时间',value:'update_time'}
                ],
                picker_b: {
                    disabledDate: (time) => {
                        if (this.form.endtime) {
                            return time.getTime() > this.form.endtime;
                        } else {
                            return time.getTime() > new Date();
                        }
                    }
                },
                picker_e: {
                    disabledDate: (time) => {
                        return time.getTime() < this.form.starttime||time.getTime()>new Date();
                    }
                },
                typeButtons:[
                    {label:'物流',value:1},
                    {label:'订单',value:2},
                    {label:'包裹',value:3},
                ]
            }
        },
        mounted(){
            this.get_creator();
            this.get_updater();
        },
        methods: {
            get_creator(){
                this.$http(api_get_packages_error_developers).then(res=>{
                    this.operatorList = [{label:'全部',value:''},...res.data.map(row=>({label:row.creator_name,value:row.creator_id}))];
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_updater(){
                this.$http(api_get_packages_error_updaters).then(res=>{
                    this.updaterList = [{label:'全部',value:''},...res.data.map(row=>({label:row.updator_name,value:row.updater_id}))];
                }).catch(code=>{
                    console.log(code);
                })
            },
            change_type(index,item){
                this.form.list_type = item.value;
                this.$emit('button-change');
            },
            search() {
                this.$emit("search");
            }
        },
        watch:{
            'form.type'(val){
                this.form.updater_id = '';
                this.form.creator_id = '';
            }
        },
        props: {
            form: {
                required: true,
                type: Object
            },
            clears: {
                required: true,
                type: Object
            }
        }
        ,
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            scrollSelect:require('@/components/scroll-select.vue').default,
            labelButtons:require('@/components/label-buttons').default,
        }
    }
</script>
