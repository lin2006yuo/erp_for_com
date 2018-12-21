<template>
    <el-row class="c-product-attr">
        <div v-if="attrData.length>0">
            <card :label="items.group_name" v-for="items  in  attrData" :key="items.group_name">
                <div v-for="(item,i) in items.attributes" class="text " :key="i">
                    <div v-if="item.type===2" class="text-input">
                        <el-col :span="7">
                            <el-checkbox v-if="editAble" v-model="item.enabled">
                                <span class="lineh"><ui-tips :content="item.name"></ui-tips> :</span>
                                <el-input v-model="item.attribute_value" class="inline"
                                          :disabled="!item.enabled"></el-input>
                            </el-checkbox>
                            <div v-else>
                                <span class="lineh">
                                    <ui-tips :content="item.name"></ui-tips>:
                                </span>
                                <span class="ml-xs">{{item.attribute_value}}</span>
                            </div>
                        </el-col>
                    </div>
                    <div v-else-if="item.type===1" class="text-check ">
                        <el-checkbox v-if="editAble" v-model="item.enabled">
                            <span class="lineh"> <ui-tips :content="item.name"></ui-tips> :</span>
                            <div v-for="it in  item.attribute_value" :key="it.value" class="inline" style=" margin-top:-4px; ">
                                <span v-show="!item.enabled" class="text-mar">{{it.value}}</span>
                                <el-checkbox-group v-model="it.selected" style="margin-left:3px;" v-show="item.enabled">
                                    <el-checkbox>
                                        <span class="color-box" v-if="!(item.icon==='')"></span>
                                        <span class="ml-xs">{{it.value}}</span>
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </el-checkbox>
                        <div v-else>
                            <span class="lineh"><ui-tips :content="item.name"></ui-tips>:</span>
                            <div v-for="it in item.attribute_value" :key="it.value" class="inline">
                                <span class="ml-xs">{{it.value}}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="item.type===0">
                        <el-checkbox v-if="editAble" v-model="item.enabled">
                            <span class="lineh"> <ui-tips :content="item.name"></ui-tips> :</span>
                            <el-select v-model="item.radio"
                                       placeholder="请选择"
                                       ref="radio"
                                       v-mouse-side.mousewheel="()=>{$refs.radio.visible = false}"
                                       v-if="item.enabled">
                                <el-option
                                        :key="is.id"
                                        v-for="is in item.attribute_value"
                                        :label="is.value"
                                        :value="is.id">
                                </el-option>
                            </el-select>
                            <div v-if="!item.enabled" class="inline">
                                <span v-for="ia in item.attribute_value" :key="ia.value" class="ml-xs">{{ia.value}}</span>
                            </div>
                        </el-checkbox>
                        <div v-else>
                            <span class="lineh"><ui-tips :content="item.name"></ui-tips>：</span>
                            <div v-for="it in  item.attribute_value" class="inline" :key="it.value">
                                <span class="ml-xs">{{it.value}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </card>
            <div style="margin:5px 0  0 50px" v-if="!isAdd">
                <div v-if="editAble">
                    <request-button req-key="productAttr" @click="keep_">保 存</request-button>
                    <el-button size="mini" @click="cancel_">取  消</el-button>
                </div>
                <el-button size="mini" v-else type="primary" @click="edit">编   辑</el-button>
            </div>
        </div>
        <div v-else style="height:80px;width: 100%;text-align: center">
             <span style="display: inline-block;margin-top: 10px">暂无数据</span>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .c-product-attr {
        .el-checkbox__label {
            white-space: normal;
        }
        .lineh {
            display: inline-block;
            width: 50px;
            line-height: 26px;
            font-size: 1.2rem;
        }
        .text-check {
            line-height: 26px;
            font-size: 1.2rem;
        }
        .text {
            width: 100%;
            line-height: 26px;
            > .page-card .body {
                min-height: 26px;
            }
        }
        .text-input {
            float: none;
        }
        .text-mar {
            margin-left: 10px;
        }
    }
</style>
<script>
    import cardText from "../../../components/card-text.vue";
    import card from "../../../components/card.vue"
    import  uiInput from  '../../../components/ui-input.vue'
    export default{
        data(){
            return {
                attributeValue: [
                    {name: "产品名称", value: "Sound Intone BT-06"},
                    {name: "兼容平台", value: "ANDROID Windows Phone iOS  "},
                    {name: "套餐类型", value: "官方标配"},
                    {name: "灵敏度", value: "108dB/mW"},
                    {name: "适用音乐类型", value: " 摇滚金属重低音类型"},
                    {name: "阻抗", value: " 32Ω"},
                ]
            }
        },
        computed: {

        },
        methods: {
            keep_(){
                this.$emit("keep")
            },
            cancel_(){
                this.$emit("cancel")
            },
            edit(){
                this.$emit("edit")
            },

        },
        components: {
            cardText,
            card,
            uiInput,
            uiTips: require("../../../components/ui-tips.vue").default
        },
        props: {
            attrData: {
                required: true,
                type: Array
            },
            editAble: {
                required: true,
                type: Boolean
            },
//            isShow: {
//                default(){
//                    return false;
//                }
//            },
            isAdd: {
                default(){
                    return false;
                }
            }
        },
    }
</script>
