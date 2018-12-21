<template>
    <div class="c-card-search p-package-tab-search">
        <search-card :params="form" :clears="clears" @search="search">
            <div class="mb-mini">
                <label-buttons
                    :max="15"
                    class="inline p-package-tab-buttons"
                    label="需求状态："
                    @select="change_channel"
                    :buttons="buttons">
                </label-buttons>
            </div>
            <label-item>
                <el-select v-model="form.sn_type"
                           class="s-width-small"
                           v-sf.sn_type>
                    <el-option
                        v-for="res in sn_typeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <el-input v-sf.sn_text
                      v-model="form.sn_text"
                      @keydown.native.enter="search"
                      :placeholder="`请输入${changeLabel}...`"
                      class="inline enter-result s-width-large"></el-input>
            <label-item label="需求分类：" class="ml-sm">
                <el-select v-model="form.type"
                           class="s-width-small"
                           v-sf.type>
                    <el-option
                            v-for="res in typeList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="需求优先级：" class="ml-sm">
                <el-select v-model="form.priority"
                           class="s-width-small"
                           v-sf.priority>
                    <el-option
                        v-for="res in priorityList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="提出人：" class="ml-sm">
                <scroll-select v-model="raiserUser" style="width:104px" class="inline"
                               textAlign="left"
                               :queryClearabled="true"
                               v-sf.raiser_id
                               :remote="'get|user'"
                               :fix-params="fix_params_account"
                               :fixResult="fix_result_account">
                </scroll-select>
            </label-item>
            <label-item class="ml-sm">
                <el-select v-model="form.time_type"
                           class="s-width-small"
                           v-sf.time_type>
                    <el-option
                        v-for="res in timeTypeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <el-date-picker class="date inline"
                            v-model="form.date_begin"
                            :picker-options="picker_b"
                            v-sf.date_begin
                            placeholder="开始时间"></el-date-picker> --
            <el-date-picker
                    class="date inline mr-sm"
                    placeholder="结束时间"
                    v-model="form.date_end"
                    v-sf.date_end
                    :picker-options="picker_e"></el-date-picker>
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
    export default {
        data() {
            return {
                sn_typeList: [
                    {label: "编号", value: "id"},
                    {label: "版本号", value: "version"},
                    {label: "需求概述", value: "summary"},
                ],
                typeList:[
                    {label:'全部',value:''},
                    {label: "新增功能", value: 0},
                    {label: "功能优化", value: 1},
                    {label: "BUG处理", value: 2},
                ],
                priorityList:[
                    {label:'全部',value:''},
                    {label:'低',value:0},
                    {label:'中',value:1},
                    {label:'高',value:2}
                ],
                raiserList:[],
                timeTypeList:[{label:'提出时间',value:'raise_time'},{label:'上线时间',value:'listing_time'}],
                picker_b: {
                    disabledDate: (time) => {
                        if (this.form.date_end) {
                            return time.getTime() > this.form.date_end;
                        } else {
                            return false;
                        }
                    }
                },
                picker_e: {
                    disabledDate: (time) => {
                        if(this.form.time_type==='listing_time') {
                            if (this.form.date_begin) {
                                return time.getTime() < this.form.date_begin;
                            } else {
                                return false;
                            }
                        }else{
                            return time.getTime() > new Date();
                        }
                    }
                },
            }
        },
        methods: {
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snType:'realname',
                    snText:keyword?keyword:''

                };
            },
            fix_result_account(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            search() {
                this.$emit("search");
            },
            change_channel(index, item) {
                this.form.status = item.value;
                this.$emit('search');
            },
        },
        computed:{
            changeLabel(){
                return this.sn_typeList.find(row=>row.value===this.form.sn_type).label
            },
            raiserUser:{
                get(){
                    return {label:this.form.raiser,
                        value:this.form.raiser_id}
                },
                set(val){
                    this.form.raiser = val.label;
                    this.form.raiser_id = val.value;
                }
            }
        },
        props: {
            form: {
                required: true,
                type: Object
            }
            ,
            clears: {
                required: true,
                type: Object
            }
            ,
            buttons: {
                required: true,
                type: Array
            }
        }
        ,
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            labelButtons: require('@/components/label-buttons').default,
        scrollSelect:require('@/components/scroll-select.vue').default,
        }
    }
</script>
