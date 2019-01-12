<template>
    <div class="spu-publish">
        <search-card :params="searchData" :clears="clears" @search="search" @enter="search">

            <label-item label="平台：">
                <el-select
                    v-model="searchData.channel_id"
                    class="width-super"
                    size="small"
                    clearable filterable multiple
                    collapse-tags
                >
                    <el-option
                        v-for="item in channels"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select class="s-width-default inline"
                           v-sf.account_id
                           filterable remote clearable
                           placeholder="请输入简称"
                           :remote-method="remote_method"
                           v-model="searchData.account_id"
                >
                    <el-option v-for="item in options"
                               :key="item.value"
                               :value="item.value"
                               :label="item.label"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item label="SPU：" class="ml-sm">
                <el-input class="inline width-super"
                          v-model="searchData.spu"
                          placeholder="可批量搜索，Shift+回车换行"
                          v-sf.spu
                          type="textarea"
                          v-enter="textarea_search"
                >
                </el-input>
            </label-item><br/>
            <label-item label="销售员：" class="mt-mini mb-mini">
                <el-input placeholder="请选择/输入..."></el-input>
            </label-item>
            <label-item label="上架数量范围：" class="ml-sm">
                <input type="number" v-model="searchData.range_min" class="number width-mini" v-range.number min="0" :max="searchData.range_max">
                <span>&nbsp;--&nbsp;</span>
                <input type="number" v-model="searchData.range_max" class="number width-mini" v-range.number :min="searchData.range_min || 0">
            </label-item>
            <label-item label="刊登日期：" class="ml-sm">
                <el-date-picker
                    class="inline date"
                    v-model="searchData.date_b"
                    type="date"
                    placeholder="开始时间"
                    :picker-options="pickerstart"
                    v-sf.date_b
                ></el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                    class="inline mr-sm date"
                    v-model="searchData.date_e"
                    type="date"
                    placeholder="结束时间"
                    :picker-options="pickerend"
                    v-sf.date_e
                ></el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>

<script>
    import {api_get_channel} from  '../../../../api/report-channel'
    export default {
        data() {
            return {
                channel_id:'',
                channels:[],
                clears:{},
                query:'',
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_e){
                            return time.getTime()>this.searchData.date_e;
                        }else{
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_b){
                            return time.getTime()<this.searchData.date_b;
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        mounted(){
            this.clears=clone(this.searchData);
            this.init_status();
        },
        methods: {
            remote_method(query){
                this.query = query;
            },
            search(){
                this.$emit('search',this.channel_id);
            },
            init_status(){
                this.$http(api_get_channel).then(res=>{
                    this.channels = res
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            change_status(val){
                let channel_id=val+1;
                this.channel_id=val+1;
                this.$emit('search',channel_id);
                this.$emit('getStatus',channel_id)
            },
            textarea_search() {
                console.log('textarea_search')
            }
        },
        computed:{
            options(){
                if(this.query){
                    return this.accountList.filter(row=>{
                        return row.label.toLowerCase()
                            .indexOf(this.query.toLowerCase())>-1
                    })
                }else{
                    if(this.accountList){
                        return this.accountList.length>=50?this.accountList.splice(1,50):this.accountList;
                    }
                }
            },
        },
        props:{
            searchData:{},
            accountList:{}
        },
        components:{
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
        },
        directives: {
            //回车执行回调，shift+回车换行
            enter: {
                // key: "Enter"
                bind(el, binding) {
                    const TEXTAREA_DOM = el.querySelector('textarea');
                    const callback = binding.value;
                    TEXTAREA_DOM.addEventListener('keydown', function (e) {
                        //换行
                        if(e.key === 'Enter' && e.shiftKey === true) {
                            e.preventDefault();
                            TEXTAREA_DOM.value += '\n';
                        } else if(e.key === 'Enter') {
                            e.preventDefault();
                            callback()
                        }
                    })
                }
            },
            //限制输入字母，限制输入范围(可选)
            range: {
                update(el, binding) {
                    let max;
                    let min;
                    if(binding.max) {
                        max = binding.value.max;
                        min = binding.value.min;
                    }
                    const INPUT_DOM = el;
                    const handleInput = () => {
                        //如果指定限制输入number
                        if(binding.modifiers.number) {
                            INPUT_DOM.value = INPUT_DOM.value.replace(/[^0-9]/g, "")
                        }
                        //如果超出指定范围
                        if(max && min) {
                            if(INPUT_DOM.value > max) {
                                INPUT_DOM.value = max;
                                console.log(INPUT_DOM.value)
                            } else if(INPUT_DOM.value < min) {
                                INPUT_DOM.value = 0
                            }
                        }
                    };
                    el.addEventListener('keyup', handleInput)
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .spu-publish >>> .el-select__tags > span {
        display: inline-block;
        width: 100%;
    }
    .spu-publish >>> .el-input__inner {
        height 26px !important
    }
    .spu-publish >>> .el-select .el-tag {
        height 22px;
        line-height:22px
    }
    .spu-publish >>> textarea {
        height: 26px;
        line-height: 15px;
    }
    .number {
        background-color: #fff;
        background-image: none;
        border-radius: 3px;
        outline none;
        border: 1px solid #C0CCDA;
        padding: 3px 10px
        &:focus {
            border-color: #33B2FC;
        }
    }
</style>
