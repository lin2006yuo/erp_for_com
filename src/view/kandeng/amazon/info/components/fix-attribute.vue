<template>
    <div class="box-form" v-if="form.commonAttList&&form.commonAttList.length>0">
        <el-form ref="base_info_3" :label-width="labelWidth" :model="form" >
            <div v-for="(item, index) in form.commonAttList" :key="index">
                <div v-if="item.select === 1">
                    <el-form-item :label="`${item.name}：`" :prop="`commonAttList[${index}].value`" :rules="{
                              required: item.require === 1, message:$t('ymx-detail.req'), trigger:'change'}">
                        <el-select class="inline width-200"
                                   :placeholder="$t('ymx-detail.select')"
                                   v-model="item.value">
                            <el-option v-for="(r,i) in item.option"
                                       :key="i" :label="r"
                                       :value="r"></el-option>
                        </el-select>
                        <el-select class='inline width-xs'
                                   :placeholder="$t('ymx-detail.select')"
                                   v-model="item.unitValue"
                                   v-if="item.restriction&&item.restriction.length>0">
                            <el-option v-for="res in item.restriction"
                                       :label="res"
                                       :key="res"
                                       :value="res"></el-option>
                        </el-select>
                        <el-input v-if="show_input(item)"
                                  class="inline width-sm ml-sm"
                                  v-model="item.unitValue"></el-input>
                    </el-form-item>
                </div>
                <div v-if="item.select === 0">
                    <div v-if="item.value instanceof Array">
                        <el-form-item v-for="(row, i) in item.value" :key="i"
                                      :label="`${item.name}-${i+1}：`"
                                      :prop="`commonAttList[${index}].value[${i}].v`" :rules="{
                              required: item.require === 1, message:$t('ymx-detail.req'), trigger:'blur'
                        }">
                            <el-input class="inline width-400" v-model="row.v"></el-input>
                        </el-form-item>
                    </div>
                    <div v-else>
                        <el-form-item :label="`${item.name}：`"
                                      :prop="'commonAttList['+index+'].value'" :rules="{
                              required: item.require === 1, message:$t('ymx-detail.req'), trigger:'blur'
                        }">
                            <el-input class="inline width-400" v-model="item.value"></el-input>
                            <el-select class='inline width-xs'
                                       v-model="item.unitValue"
                                       :placeholder="$t('ymx-detail.select')"
                                       v-if="item.restriction&&item.restriction.length>0">
                                <el-option v-for="res in item.restriction"
                                           :label="res"
                                           :key="res"
                                           :value="res"></el-option>
                            </el-select>
                            <el-input v-if="show_input(item)"
                                      class="inline width-sm ml-sm"
                                      v-model="item.unitValue"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </div>
        </el-form>
    </div>
    <div class="box-form2" v-else>
        产品模板数据未加载，请点击 <el-button type="text" @click.native="reload">重新产品模板</el-button>
    </div>
</template>

<style lang="stylus">
    .width-base{
        width: 315px;
    }
    .width-400{
        width: 400px;
    }
    .box-form2{
        border:2px dotted #FFDAB9;
        padding:50px 200px;
        color:red;
        font-weight: bold
    }
    .box-form{
        padding-top:15px;
        border:2px dotted #FFDAB9;
    }
</style>
<script>
    import {api_fix_attribute} from '../../../../../api/amazon-publish-info'
    export default{
        data(){
            return {

            }
        },
        methods:{
            show_input(item){
                if(item&&item.restriction){
                    let isTrue = !(item.restriction instanceof Array);
                    return isTrue;
                }else{
                    return false
                }
            },
            reload(){
                this.$emit('reload');
            },
        },
        props: {
            form:{
                required:true,
                type:Object
            },
            labelWidth:{
                type:String
            }
        },
        components: {
        }
    }
</script>

