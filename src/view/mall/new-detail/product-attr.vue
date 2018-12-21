<template>
    <el-row class="c-product-attr">
        <div class="ml-lg mt-sm" v-if="this.attributeForm.length<=0"> 暂无属性信息...</div>
        <card v-else :label="items.group_name" v-for="items in attributeForm" :key="items.group_name">
            <el-row class="card">
                <div  v-for="item in items.attributes" class="text" :key="item.name" >
                    <div v-if="item.type===2">
                        <el-col :span="6">
                            <span>{{item.name}}</span>:
                            <ui-input :edit="attrEdit" v-model="item.attribute_value" class="inline" ></ui-input>
                        </el-col>
                    </div>
                    <div  v-if="item.type!==2" class="text-check " >
                        <label style="line-height:26px">{{item.name}}:</label>
                        <div v-for="it in item.attribute_value" :key="it" class="inline">
                            <el-checkbox-group v-model="it.selected"  style="margin-left:3px;" >
                                <el-checkbox  :disabled="!attrEdit">
                                    <span class="color-box" v-if="!(it.icon==='')"></span>
                                    <span>{{it.value}}</span>
                                    <span>{{it.create_time}}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
            </el-row>
            <el-row>
                <div style="margin-left:60px" >
                    <el-button size="mini" v-if="!attrEdit"  type="primary" @click="edit">编辑</el-button>
                    <div v-else>
                        <request-button  req-key="productAttr" @click="save">确定</request-button>
                        <el-button  size="mini" @click="cancel">取消</el-button>
                    </div>
                </div>
            </el-row>
        </card>
    </el-row>
</template>
<style lang="stylus">
    .c-product-attr{
        .lineh{
            line-height: 26px;
            font-size: 1.2rem;
        }
        .text-check{
            line-height: 26px;
            font-size: 1.2rem;
        }
        .text{
            line-height: 26px;
        }
    }
</style>
<script>
    import cardText from "../../../components/card-text.vue";
    import card from "../../../components/card.vue"
    import  uiInput from  '../../../components/ui-input.vue'
    export default{
        data(){
            return{

            }
        },
        methods:{
            save(){
                this.$emit("save")
            },
            cancel(){
                this.$emit("cancel")
            },
            edit(){
                this.$emit("edit")
            },

        },
        components:{
            cardText,
            card,
            uiInput
        },
        props:{
            attributeForm:{
                required:true,
                type:Array
            },
            attrEdit:{
                required:true,
                type:Boolean
            },
            isShow:{
                default(){
                    return false;
                }
            },
            isAdd:{
                default(){
                    return false;
                }
            }

        },
    }
</script>
