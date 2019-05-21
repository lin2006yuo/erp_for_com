<template>
    <div class="c-search-module">
        <search-card @search="$emit('search')" @enter="$emit('search')" :params="searchData" :clears="clears">
            <el-row>
                <label-buttons label="状态："
                               :buttons="status"
                               @select="select_status"
                               :defaultIndex="1"
                               class="ml-xs">
                </label-buttons>
            </el-row>
            <label-item label="邮箱号：" class="ml-xs">
                <el-input type="text"
                          placeholder="模糊搜索..."
                          @keyup.enter.native="$emit('search')"
                          clearable
                          v-sf.corporation
                          v-model="searchData.email"
                          class="s-width-middle">
                </el-input>
            </label-item>
            <label-item label="手机号：" class="ml-sm">
                <el-input type="text"
                          placeholder="模糊搜索..."
                          @keyup.enter.native="$emit('search')"
                          clearable
                          v-sf.corporation
                          v-model="searchData.phone"
                          class="s-width-middle">
                </el-input>
            </label-item>
            <label-item label="被绑定账号数：" class="inline ml-sm">
                <natural-number-input v-model.number="searchData.account_count_st"
                                      v-sf.account_count_start
                                      @keyup.enter.native="$emit('search')"
                                      :min="0"
                                      :is-appear="false"
                                      style="width:80px">
                </natural-number-input>
                <label>~</label>
                <natural-number-input v-model.number="searchData.account_count_nd"
                                      v-sf.account_count_end
                                      @keyup.enter.native="$emit('search')"
                                      :min="0"
                                      :is-appear="false"
                                      style="width:80px">
                </natural-number-input>
            </label-item>
            <label-item label="是否有异常报错：" class="ml-sm">
                <el-select class="width-xs"
                           v-sf.id
                           v-model="searchData.is_error"
                           filterable
                           clearable
                           placeholder="请选择">
                    <el-option
                            v-for="item in errorName"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="注册日期：" class="ml-sm">
                <el-date-picker type="date"
                                placeholder="选择日期"
                                class="inline date"
                                v-sf.reg_time_st
                                :picker-options="inputTimeStart"
                                v-model="searchData.reg_time_st">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker type="date"
                                placeholder="选择日期"
                                class="inline date mr-sm"
                                v-sf.reg_time_nd
                                :picker-options="inputTimeEnd"
                                v-model="searchData.reg_time_nd">
                </el-date-picker>
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

                companyName:[
                    {label:'全部',value:''},
                    {label:'是',value:1},
                    {label:'否',value:0},
                ],
                errorName:[
                    {label:'全部',value:''},
                    {label:'有异常',value:1},
                    {label:'无异常',value:0},
                ],
                inputTimeStart: {
                    disabledDate: (time) => {
                        if (this.searchData.reg_time_nd) {
                            return time.getTime() > this.searchData.reg_time_nd;
                        } else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.reg_time_st) {
                            return time.getTime() < new Date(this.searchData.reg_time_st).getTime()-24*60*60*1000|| time.getTime() > Date.now();
                        } else {
                            return false
                        }
                    }
                },//结束时间
            }
        },
        mounted(){
            this.isFirst=true
        },
        methods:{
            select_status(index,item){
                this.searchData.status=item.value;
                this.$emit('search');

            },
        },
        props:{
            clears:{},
            searchData:{
                required:true,
                type:Object
            },
            status:{
                required:true,
                type:Array
            }
        },
        components: {
            naturalNumberInput,
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
        }
    }
</script>