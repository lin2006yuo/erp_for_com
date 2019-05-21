<template>
    <div class="c-card-search p-package-tab-search">
        <search-card :params="form" :clears="clears" @search="search">
            <label-item label="标题搜索：">
                <el-input v-sf.sn_text
                          v-model="form.snText"
                          @keydown.native.enter="search"
                          placeholder="请输入..."
                          class="inline enter-result s-width-large"></el-input>
            </label-item>
            <label-item label="通知类型：" class="ml-sm">
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
            <label-item label="接收者：" class="ml-sm">
                <scroll-select v-model="receiverUser" style="width:120px" class="inline"
                               textAlign="left"
                               v-sf.receiver_id
                               :remote="urlCreate"
                               :fix-params="fix_params_account"
                               :fixResult="fix_result_account"></scroll-select>
            </label-item>
            <label class="ml-sm">发送时间：</label>
            <el-date-picker class="date inline"
                            v-model="form.btime"
                            :picker-options="picker_b"
                            v-sf.btime
                            placeholder="开始时间"></el-date-picker> --
            <el-date-picker
                    class="date inline mr-sm"
                    placeholder="结束时间"
                    v-model="form.etime"
                    v-sf.etime
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
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'邓海波',
                createTime:'2018-8-22',
                updateTime:'2018-8-31'
            }
        },
        data() {
            return {
                receiver:'',
                urlCreate:'get|user',
                receiverList:[],
                picker_b: {
                    disabledDate: (time) => {
                        if (this.form.etime) {
                            return time.getTime() > this.form.etime;
                        } else {
                            return time.getTime() > new Date();
                        }
                    }
                },
                picker_e: {
                    disabledDate: (time) => {
                        return time.getTime() < this.form.btime||time.getTime()>new Date();
                    }
                },
            }
        },
        methods: {
            search() {
                this.$emit("search");
            },
            change_channel(index, item) {
                this.form.status = item.value;
                this.$emit('search');
            },
            fix_params_account({page,pageSize,keyword}){
                if(!keyword){
                    this.receiverUser = {label:'',value:''};
                }
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
        },
        props: {
            form: {
                required: true,
                type: Object
            },
            clears: {
                required: true,
                type: Object
            },
            typeList:{
                required:true,
                type:Array
            }
        },
        computed:{
            receiverUser:{
                get(){
                    return {label:this.receiver,
                        value:this.form.receiver_id}
                },
                set(val){
                    this.receiver = val.label;
                    this.form.receiver_id = val.value;
                }
            }
        },
        watch:{
            'form.receiver_id'(val){
                if(!val){
                    this.receiver = '';
                }
            }
        },
        components: {
            searchCard: require('@/components/search-card.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            scrollSelect:require('@/components/scroll-select.vue').default,
        }
    }
</script>
