<template>
    <div>
        <el-row class="mt-xs mb-xs ml-xs">
            <el-button size="mini" type="primary"
                       :disabled="!judge"
                       @click.native="$emit('add-param')">添加参数
            </el-button>
        </el-row>
        <template v-if="platformTable.length">
            <table width="100%"
                   style="border-collapse: collapse;" class="template scroll-bar">
                <template>
                    <tr v-for="(item, key) in platformTable" :key="key">
                        <th style="width: 40%"><span>{{item.title}}</span></th>
                        <td>
                            <template v-if="item.type===1">
                                <el-input v-model.trim="item.value"
                                          class="inline" :disabled="!judge">
                                </el-input>
                                <span>{{item.remark}}</span>
                            </template>
                            <template v-if="item.type===2">
                                <el-input v-model.trim="item.value"
                                          type="textarea"
                                          placeholder="请输入内容"
                                          class="inline" :disabled="!judge">
                                </el-input>
                                <span>{{item.remark}}</span>
                            </template>
                            <template v-if="item.type===3">
                                <template v-if="item.choose_type===0">
                                    <template v-if="item.show">
                                        <el-switch :on-text="item.setting[0].key"
                                                   :off-text="item.setting[1].key"
                                                   v-model="item.currentVal"
                                                   @change="change_switch(item,$event)"
                                                   :disabled="!judge">
                                        </el-switch>
                                    </template>
                                    <template v-else>
                                        <el-radio-group v-model="item.currentVal">
                                            <el-radio  v-for="radio in item.setting"
                                                       :label="radio.value"
                                                       :key="radio.value"
                                                       :disabled="!judge">{{radio.key}}
                                            </el-radio>
                                        </el-radio-group>
                                        <template v-if="item.setting&&item.setting.length" v-for="radio in item.setting">
                                            <template v-if="item.currentVal===radio.value&&!!radio.child.length">
                                                <template v-if="radio.choose_type===1">
                                                    <el-checkbox v-for="child in radio.child"
                                                                 :key="child.key"
                                                                 v-model="child.checked"
                                                                 :disabled="!judge">{{child.key}}
                                                    </el-checkbox>
                                                </template>
                                                <template v-else>
                                                    <el-radio-group v-model="radio.choose" :disabled="!judge">
                                                        <el-radio v-for="child in radio.child"
                                                                  :label="child.value"
                                                                  :key="child.value">{{child.key}}
                                                        </el-radio>
                                                    </el-radio-group>
                                                </template>
                                            </template>
                                        </template>
                                    </template>
                                </template>
                                <template v-else>
                                    <el-checkbox v-for="child in item.setting"
                                                 :key="child.key"
                                                 v-model="child.checked"
                                                 :disabled="!judge">{{child.key}}
                                    </el-checkbox>
                                    <template v-if="item.setting&&item.setting.length" v-for="child in item.setting">
                                        <template v-if="child.checked&&child.child.length">
                                            <template v-if="child.choose_type===1">
                                                <el-checkbox v-for="it in child.child"
                                                             :key="it.key"
                                                             v-model="it.checked"
                                                             :disabled="!judge">{{it.key}}
                                                </el-checkbox>
                                            </template>
                                            <template v-else>
                                                <el-radio-group v-model="child.choose" :disabled="!judge">
                                                    <el-radio v-for="radio in child.child"
                                                              :label="radio.value"
                                                              :key="radio.value">{{radio.key}}
                                                    </el-radio>
                                                </el-radio-group>
                                            </template>
                                        </template>
                                    </template>
                                </template>
                            </template>
                        </td>
                        <td width="55">
                            <span :class="[judge?'operate':'disabled']" @click="del(item)">删除</span>
                        </td>
                    </tr>
                </template>
            </table>
        </template>
        <template v-else>
            <div class="t-center table-empty">
                {{emptyString}}
            </div>
        </template>
        <el-row class="mt-xs ml-xs">
            <el-button type="primary" size="mini" v-if="judge&&platformTable.length"
                       @click.native="$emit('submit')">保 存
            </el-button>
        </el-row>
    </div>
</template>

<script>
    import {api_delete_single_config} from '@/api/platform-management'
    export default {
        name: "platform-param",
        computed:{
            emptyString(){
                return `暂无参数${this.judge?',请按添加参数按钮添加':''}`;
            }
        },
        methods: {
            change_switch(item,val){
                this.$confirm(`您将${val?'开启':'关闭'}${item.title}，确认该操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    item.currentVal=val;
                }).catch(() => {
                    item.currentVal=!val;
                });
            },
            del(item){
                if(!this.judge)return;
                this.$http(api_delete_single_config,{id:item.id}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.$emit('del',item)
                }).catch( error =>{
                   error&&this.$message({type:'error', message:error.message||error});
                });
            }
        },
        props: {
            platformTable:Array,
            judge:Boolean
        },
    }
</script>

