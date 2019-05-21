<template>
    <el-row class="c-replenish">
        <rainbow-header title="补充与重上规则" background-color="#004098">
            <el-form :model="form" label-width="220px">
                <el-form-item label="自动补在线数量：">
                    <el-radio v-model="form.list.replen" :label="1">卖出多少，即补多少</el-radio>
                    <el-radio v-model="form.list.replen" :label="0">不补</el-radio>
                </el-form-item>
                <el-form-item label="重上规则：">
                    <div class="mb-xs">
                        <el-checkbox :value="form.list.restart" @input="(val)=>{change_restart(val)}">自动重新刊登</el-checkbox>
                    </div>
                    <el-radio-group v-model="form.set.restart_rule" :disabled="!form.list.restart">
                        <div class="ml-sm mb-xs">
                            <el-radio :label="1">只要物品结束</el-radio>
                        </div>
                        <div class="ml-sm mb-xs">
                            <el-radio :label="2">所有物品卖出</el-radio>
                        </div>
                        <div class="ml-sm mb-xs">
                            <el-radio :label="3">没有物品卖出</el-radio>
                        </div>
                        <div class="ml-sm mb-xs">
                            <el-radio :label="4">没有物品卖出后仅刊登一次</el-radio>
                        </div>
                        <div class="ml-sm mb-xs">
                            <el-radio :label="5">当物品卖出数量大于或等于
                                <el-input class="inline width-xs"
                                          v-model="form.set.restart_count"
                                          :disabled="!form.list.restart||form.set.restart_rule!==5"></el-input>
                            </el-radio>
                        </div>
                        <div class="ml-sm mb-xs">
                            <span>重上时间：</span>
                            <el-radio-group :value="form.set.restart_way" @input="(val)=>{change_restart_way(val)}">
                                <el-radio :label="1" :disabled="!form.list.restart">立即重上</el-radio>
                                <el-radio :label="2" :disabled="!form.list.restart">
                                    定时重上，执行时间
                                    <el-time-select
                                            style="display: inline-block"
                                            class="width-xs"
                                            v-model="comTime"
                                            :disabled="form.set.restart_way!==2||!form.list.restart"
                                            :picker-options="{
                                            start: '00:00',
                                            step: '00:10',
                                            end: '23:59'
                                        }"
                                            placeholder="选择时间">
                                    </el-time-select>
                                    ，到期时间
                                    <el-date-picker
                                            style="display: inline-block"
                                            type="date"
                                            placeholder="到期时间"
                                            :disabled="form.set.restart_way!==2||!form.list.restart"
                                            v-model="form.set.restart_invalid_time"
                                            class="date"></el-date-picker>
                                </el-radio>
                            </el-radio-group>
                            <div class="mt-mini">小提示：GTC仅支持【卖出多少，即补多少】，不支持【重上规则】，即使您在刊登内选择了带有【重上规则】设定的规则，重新刊登也不会生效！但eBay会进行自动重新刊登;重上时间和到期时间均为站点时间</div>
                        </div>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </rainbow-header>
    </el-row>
</template>
<style lang="stylus" scoped>
</style>
<script>

    export default{
        data(){
            return {}
        },
        computed:{
            comTime:{
                get(){
                    if(isNaN(this.form.set.restart_time)){
                        return this.form.set.restart_time;
                    }else{
                        return this.form.set.restart_time?datef("HH:mm",this.form.set.restart_time):"";
                    }
                },
                set(val){
                    this.form.set.restart_time = val;
                }
            }
        },
        methods:{
            /*自动重新刊登*/
            change_restart(val){
                this.form.list.restart = val;
                if(!this.form.list.restart){
                    this.form.set.restart_rule = 1;
                    this.form.set.restart_count = "";
                }
            },
            /*更改 重上时间*/
            change_restart_way(val){
                this.form.set.restart_way = val;
                this.form.set.restart_time = "";
                this.form.set.restart_invalid_time = "";
            }
        },
        props:{
            form:{},
        },
        components: {
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>