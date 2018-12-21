<template>
    <page-dialog :title="action.title"
                 size="full"
                 v-model="visible"
                 @open="open"
                 :close-on-click-modal="false">
        <el-form :model="ruleData" class="mt-sm mb-sm" label-width="150px">
            <el-form-item :label="$t('ymx-up-lower-rule.ruleName')+'：'" required class="inline ml-sm mr-sm">
                <el-col>
                    <el-input v-model="ruleData.rule_name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item :label="$t('ymx-up-lower-rule.availableTime')+'：'" required class="inline mr-sm">
                <el-col>
                    <el-date-picker
                            v-model="ruleData.start_time"
                            type="date"
                            :placeholder="$t('ymx-up-lower-rule.startDate')"
                            class="inline date"
                            @change="data_picker_b"
                            :picker-options="inputTimeStart">
                    </el-date-picker>
                    <label>&nbsp;--&nbsp;</label>
                    <el-date-picker
                            v-model="ruleData.end_time"
                            type="date"
                            :placeholder="$t('ymx-up-lower-rule.endDate')"
                            class="inline date mr-sm"
                            @change="data_picker_e"
                            :picker-options="inputTimeEnd">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item :label="$t('ymx-up-lower-rule.status')+'：'" class="inline">
                <el-col>
                    <el-switch v-model="ruleData.status"
                               :onText="$t('ymx-up-lower-rule.enable')"
                               :offText="$t('ymx-up-lower-rule.disable')">
                    </el-switch>
                </el-col>
            </el-form-item>
        </el-form>

        <table class="template">
            <tr style="background-color: #d6e9c6">
                <td colspan="16">
                    <div class="inline fl mt-xs mb-xs">
                        <label-item :label="$t('ymx-up-lower-rule.displayDate')+'：'" class="ml-sm inline mr-sm">
                            <el-time-select v-model="up_value"
                                            class="inline mr-sm"
                                            style="width: 115px"
                                            :picker-options="timeOptions"
                                            :placeholder="$t('ymx-up-lower-rule.selectTime')"></el-time-select>
                        </label-item>
                        <label-item :label="$t('ymx-up-lower-rule.removeDate')+'：'" class="inline mr-sm">
                            <el-time-select v-model="lower_value"
                                            class="inline mr-sm"
                                            style="width: 115px"
                                            :picker-options="timeOptions"
                                            :placeholder="$t('ymx-up-lower-rule.selectTime')"></el-time-select>
                        </label-item>
                        <el-button type="primary" size="mini" class="inline" @click.native="add_list" :disabled="up_value===''||lower_value===''">{{$t('ymx-up-lower-rule.addBtn')}}</el-button>
                    </div>
                    <div style="color: red;font-size: 16px;" class="fr inline mt-xs mb-xs">{{$t('ymx-up-lower-rule.note')}}</div>
                </td>
            </tr>
            <tr style="background-color: #cccc77">
                <td colspan="2">
                    <el-checkbox v-model="ruleData.monday_up_lower.is_check">{{$t('ymx-up-lower-rule.monday')}}</el-checkbox>
                </td>
                <td colspan="2">
                    <el-checkbox v-model="ruleData.tuesday_up_lower.is_check">{{$t('ymx-up-lower-rule.tuesday')}}</el-checkbox>
                </td>
                <td colspan="2">
                    <el-checkbox v-model="ruleData.wednesday_up_lower.is_check">{{$t('ymx-up-lower-rule.wednesday')}}</el-checkbox>
                </td>
                <td colspan="2">
                    <el-checkbox v-model="ruleData.thursday_up_lower.is_check">{{$t('ymx-up-lower-rule.thursday')}}</el-checkbox>
                </td>
                <td colspan="2">
                    <el-checkbox v-model="ruleData.friday_up_lower.is_check">{{$t('ymx-up-lower-rule.friday')}}</el-checkbox>
                </td>
                <td colspan="2">
                    <el-checkbox v-model="ruleData.saturday_up_lower.is_check">{{$t('ymx-up-lower-rule.saturday')}}</el-checkbox>
                </td>
                <td colspan="2">
                    <el-checkbox v-model="ruleData.sunday_up_lower.is_check">{{$t('ymx-up-lower-rule.sunday')}}</el-checkbox>
                </td>
                <td colspan="2">
                    <span>{{$t('ymx-up-lower-rule.operation')}}</span>
                </td>
            </tr>
            <tr>
                <td>{{$t('ymx-up-lower-rule.displayDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.removeDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.displayDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.removeDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.displayDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.removeDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.displayDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.removeDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.displayDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.removeDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.displayDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.removeDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.displayDate')}}</td>
                <td>{{$t('ymx-up-lower-rule.removeDate')}}</td>
                <td colspan="2"></td>
            </tr>
            <tr v-for="(item, index) in ruleData.monday_up_lower.up_lower_tme" :key="index">
                <td>
                    <el-time-select v-model="ruleData.monday_up_lower.up_lower_tme[index].up_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.monday_up_lower.up_lower_tme[index].lower_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.tuesday_up_lower.up_lower_tme[index].up_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.tuesday_up_lower.up_lower_tme[index].lower_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.wednesday_up_lower.up_lower_tme[index].up_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.wednesday_up_lower.up_lower_tme[index].lower_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.thursday_up_lower.up_lower_tme[index].up_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.thursday_up_lower.up_lower_tme[index].lower_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.friday_up_lower.up_lower_tme[index].up_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.friday_up_lower.up_lower_tme[index].lower_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.saturday_up_lower.up_lower_tme[index].up_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.saturday_up_lower.up_lower_tme[index].lower_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.sunday_up_lower.up_lower_tme[index].up_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-time-select v-model="ruleData.sunday_up_lower.up_lower_tme[index].lower_time"
                                    class="inline mr-sm"
                                    style="width: 80px;"
                                    :picker-options="timeOptions"></el-time-select>
                </td>
                <td>
                    <el-button type="text" @click.native="delete_list(index)">{{$t('ymx-up-lower-rule.deleteBtn')}}</el-button>
                </td>
            </tr>
        </table>

        <div slot="footer" class="dialog-footer">
            <request-button @click="sure(ruleData)" req-key="addEditServer">{{$t('ymx-up-lower-rule.confirmBtn')}}</request-button>
            <el-button size="mini" @click.native="visible = false">{{$t('ymx-up-lower-rule.cancelBtn')}}</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus">

</style>

<script>
    import {api_up_lower_rule_detail, api_add_up_lower_rules, api_edit_up_lower_rules} from '@/api/up-lower-rule-list'
    export default {
        data(){
            return {
                visible: false,
                up_value: '',
                lower_value: '',
                timeOptions: {
                    start: '00:00',
                    step: '01:00',
                    end: '23:00'
                },
                ruleData: {
                    id: '',
                    rule_name: '',
                    start_time: '',
                    end_time: '',
                    status: '',
                    monday_up_lower: {
                        is_check: '',
                        up_lower_tme: [{ up_time: '', lower_time: ''}],
                    },
                    tuesday_up_lower: {
                        is_check: '',
                        up_lower_tme: [{ up_time: '', lower_time: ''}],
                    },
                    wednesday_up_lower: {
                        is_check: '',
                        up_lower_tme: [{ up_time: '', lower_time: ''}],
                    },
                    thursday_up_lower: {
                        is_check: '',
                        up_lower_tme: [{ up_time: '', lower_time: ''}],
                    },
                    friday_up_lower: {
                        is_check: '',
                        up_lower_tme: [{ up_time: '', lower_time: ''}],
                    },
                    saturday_up_lower: {
                        is_check: '',
                        up_lower_tme: [{ up_time: '', lower_time: ''}],
                    },
                    sunday_up_lower: {
                        is_check: '',
                        up_lower_tme: [{ up_time: '', lower_time: ''}],
                    },
                },
                inputTimeStart: {//开始时间
                    disabledDate: (time)=> {
                        if(this.ruleData.end_time){
                            return time.getTime() > new Date(this.ruleData.end_time).getTime();
                        }
                    }
                },
                inputTimeEnd: {//结束时间
                    disabledDate: (time)=> {
                        if (this.ruleData.start_time) {
                            return time.getTime() < new Date(this.ruleData.start_time).getTime()-24*60*60*1000;
                        }
                    }
                },
            }
        },
        methods: {
            open(){//弹框打开回调函数
                this.up_value = '';
                this.lower_value = '';
                //判断是添加还是编辑
                if(this.action.type === 'add'){
                    this.ruleData = {
                        id: '',
                        rule_name: '',
                        start_time: '',
                        end_time: '',
                        status: true,
                        monday_up_lower: {
                            is_check: true,
                            up_lower_tme: [],
                        },
                        tuesday_up_lower: {
                            is_check: true,
                            up_lower_tme: [],
                        },
                        wednesday_up_lower: {
                            is_check: true,
                            up_lower_tme: [],
                        },
                        thursday_up_lower: {
                            is_check: true,
                            up_lower_tme: [],
                        },
                        friday_up_lower: {
                            is_check: true,
                            up_lower_tme: [],
                        },
                        saturday_up_lower: {
                            is_check: true,
                            up_lower_tme: [],
                        },
                        sunday_up_lower: {
                            is_check: true,
                            up_lower_tme: [],
                        },
                    }
                }else if(this.action.type === 'edit'){
                    this.$http(api_up_lower_rule_detail, {id:this.action.id}).then(res => {
                        for(let key in res){
                            if(key.indexOf('up_lower') !== -1){
                                res[key] = JSON.parse(res[key]);
                                res[key].is_check = res[key].is_check === 0 ? false : true
                            }
                        }
                        this.ruleData = {
                            id: res.id,
                            rule_name: res.rule_name,
                            start_time: res.start_time,
                            end_time: res.end_time,
                            status: res.status === 0 ? true : false,
                            monday_up_lower: res.monday_up_lower,
                            tuesday_up_lower:res.tuesday_up_lower,
                            wednesday_up_lower: res.wednesday_up_lower,
                            thursday_up_lower: res.thursday_up_lower,
                            friday_up_lower: res.friday_up_lower,
                            saturday_up_lower: res.saturday_up_lower,
                            sunday_up_lower: res.sunday_up_lower,
                        };
                    })
                }
            },
            sure(row){//确定
                for(let key in row){
                    if(key.indexOf("up_lower") !== -1){
                        row[key].is_check = row[key].is_check === true ? 1 : 0;
                    }
                }
                let data = {
                    id: row.id,
                    rule_name: row.rule_name,
                    start_time: row.start_time,
                    end_time: row.end_time,
                    status: row.status === true ? 0 : 1,
                    monday_up_lower: row.monday_up_lower,
                    tuesday_up_lower: row.tuesday_up_lower,
                    wednesday_up_lower: row.wednesday_up_lower,
                    thursday_up_lower: row.thursday_up_lower,
                    friday_up_lower: row.friday_up_lower,
                    saturday_up_lower: row.saturday_up_lower,
                    sunday_up_lower: row.sunday_up_lower
                };
                if(this.action.type === 'add') delete data.id;
                let api = this.action.type === 'add' ? api_add_up_lower_rules : api_edit_up_lower_rules;
                this.$http(api, data).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.visible = false;
                    this.$emit('update')
                }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addEditServer', false);
                    }, 300)
                })
            },
            add_list(){//添加一行上下架时间
                for(let key in this.ruleData){
                    if(key.indexOf('up_lower') !== -1){
                        let timeArr = this.ruleData[key].up_lower_tme.map(row => row.up_time);
                        if(timeArr.indexOf(this.up_value) === -1){
                            this.ruleData[key].up_lower_tme.push({up_time: this.up_value, lower_time: this.lower_value})
                        }else {
                            this.$message({type: 'warning', message: '有日期下已存在该上架时间，已将其变为空值，你可以重新编辑它！'})
                            this.ruleData[key].up_lower_tme.push({up_time: '', lower_time: ''})
                        }

                    }
                }
            },
            delete_list(index){//删除一行上下架时间
                for(let key in this.ruleData){
                    if(key.indexOf('up_lower') !== -1){
                        this.ruleData[key].up_lower_tme.splice(index,1)
                    }
                }
            },
            data_picker_b(val){
                this.ruleData.start_time = val
            },
            data_picker_e(val){
                this.ruleData.end_time = val
            },
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{},
            action:{}
        },
        components: {
            pageDialog:require("@/components/page-dialog.vue").default,
            requestButton:require('../../../../global-components/request-button').default,
            labelItem:require('@/components/label-item.vue').default,
        },
    }
</script>
