<template>
    <div class="c-card-search">
        <search-card @search="$emit('search')" @enter="$emit('search')" :params="searchData" :clears="clears" @init-params="init_params">
            <el-row>
                <label-buttons label="状态："
                               :buttons="status"
                               @select="select_status"
                               :defaultIndex="1"
                               class="ml-xs">
                </label-buttons>
            </el-row>
            <el-select class="inline s-width-small"
                       v-sf.snType
                       v-model="searchData.snType">
                <el-option v-for="item in conditionList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input class="inline"
                      v-sf.snText
                      :placeholder="`请输入${changeLabel}...`"
                      v-model="searchData.snText"
            ></el-input>
            <label class="inline ml-sm">信用卡类别：</label>
            <el-select class="inline s-width-small"
                       v-sf.site
                       v-model="searchData.card_category" filterable clearable>
                <el-option v-for="item in cardListalan"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <label-item label="被绑定账号数：" class="inline ml-sm">
                <natural-number-input v-model.number="searchData.account_count_start"
                                      v-sf.account_count_start
                                      @keyup.enter.native="$emit('search')"
                                      :min="0"
                                      :is-appear="false"
                                      style="width:80px">
                </natural-number-input>
                <label>~</label>
                <natural-number-input v-model.number="searchData.account_count_end"
                                      v-sf.account_count_end
                                      @keyup.enter.native="$emit('search')"
                                      :min="0"
                                      :is-appear="false"
                                      style="width:80px">
                </natural-number-input>
            </label-item>
            <label-item label="抓取店铺信用卡数据：" class="inline ml-sm">
                <el-select v-model="searchData.taskCondition"
                           class="inline"
                           style="width:60px"
                           v-sf.taskCondition
                           filterable>
                    <el-option
                            v-for="res in taskList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"></el-option>
                </el-select>
                <el-select v-model="searchData.taskTime"
                           class="inline s-width-small ml-xs"
                           v-sf.taskTime
                           filterable>
                    <el-option
                            v-for="res in taskTimeList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import naturalNumberInput from '@/view/base/server-management/natural-number-input'
    export default {
        data() {
            return {
                conditionList: [
                    {value: 'card_number', label: '卡号'},
                    {value: 'card_master', label: '卡主姓名'},
                    {value: 'validity_date', label: '有效期'},
                ],
                taskList: [
                    {label: "=", value: 'eq'},
                    {label: "<", value: 'lt'},
                    {label: ">", value: 'gt'},
                ],
                taskTimeList: [
                    {label: "全部", value: ''},
                    {label: "未启用", value: 0},
                    {label: "30分钟", value: 30},
                    {label: "1小时", value: 60},
                    {label: "2小时", value: 120},
                    {label: "3小时", value: 180},
                    {label: "4小时", value: 240},
                    {label: "5小时", value: 300},
                    {label: "6小时", value: 360},
                    {label: "7小时", value: 420},
                    {label: "8小时", value: 480},
                    {label: "9小时", value: 540},
                    {label: "10小时", value: 600},
                    {label: "11小时", value: 660},
                    {label: "12小时", value: 720},
                    {label: "24小时", value: 1440}
                ]
            }
        },
        methods:{
            select_status(index,item){
                this.searchData.card_status=item.value;
                this.$emit('search');
            },
            init_params(){
                this.$emit('init-params')
            }
        },
        computed:{
            changeLabel() {
                if (this.searchData.snType === 'card_number') {
                    return `卡号`;
                } else if(this.searchData.snType === 'card_master'){
                    return `卡主姓名`;
                } else{
                    return `有效期`
                }
            }
        },
        props:{
            searchData:{},
            clears:{},
            status:{},
            cardListalan:{},
        },
        components: {
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            naturalNumberInput
        }
    }
</script>