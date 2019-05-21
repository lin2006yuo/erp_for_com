<template>
    <!--此页面暂时废弃-->
        <el-row>
            <div v-if="showList">
                <card :must-fill="items.required" v-if="specEdit" :label="items.name"
                      v-for="items in specData" :key="items.name">
                    <template v-if='show_item(items)'>
                        <el-col class="mb-xs" :span="4"
                                v-if="items.is_alias===0"
                                v-for="(item,index) in get_select(items)"
                                :key="index">
                            <el-checkbox-group v-model="item.selected"
                                               @change.native="change_pro(items,index,lookspecData,comHeader)"
                                               style="height:27px;line-height:25px;overflow:hidden">
                                <el-checkbox>
                                    <span class="color-box" v-if="!(item.icon==='')"></span>
                                    <span>{{item.value}}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                        <el-col :span="4" v-if="items.is_alias===0">
                            <el-select v-model="items.selectValue"
                                       filterable clearable
                                       @change="change_value(items,$event,lookspecData,comHeader)"
                                       class="inline width-sm">
                                <el-option
                                        v-for="res in get_options(items)"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </template>
                    <template v-else>
                        <el-col class="mb-xs"
                                :span="4"
                                v-if="items.is_alias===0"
                                v-for="(item,index) in items.attribute_value"
                                :key="index">
                            <el-checkbox-group v-model="item.selected"
                                               @change.native="change_pro(items,index,lookspecData,comHeader)"
                                               style="height:27px;line-height:25px;overflow:hidden">
                                <el-checkbox>
                                    <span class="color-box" v-if="!(item.icon==='')"></span>
                                    <span>{{item.value}}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </template>
                    <el-col class="mb-xs" :span="4" v-if="items.is_alias===1&&item.selected"
                            v-for="(item,index) in items.attribute_value" :key="index">
                        <el-checkbox-group v-model="item.selected"
                                           @change.native="change_pro(items,index,lookspecData,comHeader)"
                                           style="height:27px;line-height:25px;overflow:hidden">
                            <el-checkbox>
                                <span class="color-box" v-if="!(item.icon==='')"></span>
                                <el-input class="inline width-xs"  v-model="item.value"></el-input>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                    <input
                            class="inline el-input__inner width-xs"
                            v-if="items.is_alias===1"
                            @keyup.enter="add_user_defined(items,lookspecData,comHeader)"
                            v-model="items.newValue"
                            placeholder="自定义输入框">
                </card>

                <table class="template mt-xs">
                    <tr>
                        <th v-if="specEdit" style="width:60px">是否启用</th>
                        <th>SKU编码</th>
                        <th v-for="header in lookspecData.headers" :key="header.name">{{header.name}}</th>
                        <th style="width:120px">采购价/销售价</th>
                        <th style="width:120px">产品重量(g)</th>
                        <th style="width:120px">长/宽/高(cm)</th>
                    </tr>
                    <tbody>
                        <template>
                            <tr v-for="(list,index) in lookspecData.lists" :key="index" v-if="specEdit || list.enabled">
                                <td v-if="specEdit"><el-checkbox v-model="list.enabled"></el-checkbox></td>
                                <td>
                                    <ui-tips :content="list.sku"></ui-tips>
                                </td>
                                <td  v-for="(item,i) in lookspecData.headers "
                                     :key="item.attribute_id">
                                    <!--{{item[header.attribute_id].value}}-->
                                    <el-select :value="get_value(item,list)"
                                               v-if="specEdit"
                                               @input="(val)=>{set_value(item,list,val)}"
                                               filterable clearable>
                                        <el-option
                                                v-for="res in get_value(item,list,'options')"
                                                :label="res.value"
                                                :value="res.value"
                                                :key="res.value"
                                        ></el-option>
                                    </el-select>
                                    <div v-else>{{get_value(item,list)}}</div>
                                </td>
                                <!--采购价/销售价-->
                                <td class="width-xs">
                                    <ui-input v-model="list.cost_price"
                                              :edit="specEdit"
                                              :disabled="!list.enabled"
                                              @input="sku_change(index)"></ui-input>
                                    <ui-input v-model="list.retail_price"
                                              :edit="specEdit"
                                              :disabled="!list.enabled"
                                              @input="sku_change(index)"></ui-input>
                                </td>
                                <!--产品重量(g)-->
                                <td class="width-xs">
                                    <ui-input v-model="list.weight"
                                              :edit="specEdit"
                                              :disabled="!list.enabled" @input="sku_change(index)"></ui-input>
                                </td>
                                <!--长/宽/高(cm)-->
                                <td class="width-xs">
                                    <ui-input v-model="list.length"
                                              :edit="specEdit"
                                              :disabled="!list.enabled"
                                              @input="sku_change(index)"></ui-input>
                                    <ui-input v-model="list.width"
                                              :edit="specEdit"
                                              :disabled="!list.enabled" @input="sku_change(index)"></ui-input>
                                    <ui-input v-model="list.height"
                                              :edit="specEdit"
                                              :disabled="!list.enabled" @input="sku_change(index)"></ui-input>
                                </td>
                            </tr>
                            <tr>
                                <td :colspan="lineNumber" class="left">
                                    <el-button type="primary"
                                               size="mini"
                                               class="mt-mini mb-mini mr-lg fr"
                                               @click.native = "add_sku(lookspecData)">添加SKU</el-button>
                                </td>
                            </tr>

                    </template>
                </tbody>
            </table>
            <el-col class="mt-xs" :span="18" style="margin-left:50px">
                <el-button v-if="!specEdit" type="primary" size="mini" @click.native="edit">编辑</el-button>
                <div v-else>
                    <el-button type="primary" size="mini" @click.native="save">确定</el-button>
                    <el-button  size="mini" @click.native="cancel">取消</el-button>
                </div>
            </el-col>
            </div>
            <div v-else class="ml-lg mt-sm">
                暂无规格参数信息...
            </div>
        </el-row>
    </template>
    <style lang="stylus">
        .color-box{
            width:24px;
            height:24px;
            display:inline-block;
            border:1px solid #ddd;
            vertical-align: middle;
        }
        .spec-hidden{
            vertical-align:middle;
            max-width:200px;
            display: inline-block;
            text-overflow: ellipsis;
            word-break: keep-all;
            white-space: nowrap;
            overflow:hidden;
        }
    </style>
    <script>
        import {get_value,
            set_value,
            show_item,
            get_select,
            get_options,
            change_value,
            change_pro,
            add_user_defined,
            add_sku} from '../../product/manager/public-specification-info';
        export default{
            data(){
                return{

                }
            },
            computed:{
                showList(){
                    return this.specData.length>0 || this.lookspecData.lists.length>0?true:false;
                },
                lineNumber(){
                    return 5+this.lookspecData.headers.length
                },
                comHeader:{
                    get(){
                        return this.specData.filter(res=>{
                            return !!res.attribute_value.find(row=>row.selected)
                        }).map(res=>{
                            let options = res.attribute_value.filter(res=>res.selected);
                            return {
                                name:res.name,
                                attribute_id:res.attribute_id,
                                options:options
                            }
                        })
                    }
                },
            },
            methods:{
                get_value,
                set_value,
                show_item,
                get_select,
                get_options,
                change_value,
                change_pro,
                add_user_defined,
                add_sku,
                sku_change(index){
                    this.$emit("sku-change",index);
                },
                edit(){
                    this.$emit("edit");
                },
                save(){
                    this.$emit("save");
                },
                cancel(){
                    this.$emit("cancel");
                }
            },
            props:{
                specData:{
                    required:true,
                    type:Array
                },
                lookspecData:{
                  required:true,
                  type:Object,
                },
                specEdit:{
                    required:true,
                    type:Boolean,
                },
            },
            components:{
                card:require("../../../components/card.vue").default,
                uiInput:require("../../../components/ui-input.vue").default,
                uiTips:require('../../../components/ui-tips.vue').default,
            }
        }
    </script>
