<template>
    <el-row class="c-product-desc">
        <div class="function-button">
            <trends-select class="inline" @trigger="add_lang($event)" :selects="language"
                           type="primary"  v-if="editAble"></trends-select>
            <el-button size="mini" class="inline"
                       :disabled="action==='中文'"
                       type="primary"
                       @click.native="show_hidden">{{showChinese?'隐藏对照':'对照中文'}}</el-button>
        </div>
        <el-tabs type="card" @tab-click="tab_click" :active-name="action">
            <el-tab-pane v-for="item in descData" :key="item.lang_name"  :label="item.lang_name" :name="item.lang_name" >
                <el-row :gutter="8" style="margin-right: 20px!important;">
                    <el-col v-if="showChinese" :span="12">
                            <div style="display: flex">
                                <label  class="label-align" >标题：</label>
                                <ui-input class="inline " style="flex: 1" :edit="editAble" v-model="chineseData.title"></ui-input>
                            </div>
                            <div class="mt-sm" style="display: flex">
                                <label  class="label-align">产品标签：</label>
                                <input-tag :tags="chineseData.tags"
                                           :get-tag="getTag"
                                           :set-tag="setTag"
                                           :disabled="!editAble" style="flex: 1;"></input-tag>
                            </div>
                            <div class="mt-sm" style="display: flex">
                                <label class="label-align">卖点描述：</label>
                                    <div style="width: 90%">
                                        <div class="mb-xs" v-for="(tag,index) in chineseData.selling_point_description" :key="index">
                                            <span>{{index+1}}、{{tag}}</span>
                                            <span v-if="editAble" class="delete-btn" @click="delete_point(tag,chineseData.selling_point_description)"></span>
                                        </div>
                                        <limit-input v-model="sellingPoint2"
                                                     style="width: 600px"
                                                     :maxlength="500"
                                                     :cur-span="23"
                                                     :show-number="true"
                                                     ref="savePointInput"
                                                     :is-textarea="false"
                                                     @keyup.enter.native="add_point2(chineseData.selling_point_description)"
                                                     v-if="isShow2"></limit-input>
                                        <el-button v-if="editAble&&!isShow2"
                                                   :disabled="chineseData.selling_point_description.length >= 5"
                                                   class="button-new-tag"
                                                   size="small"
                                                   @click="isShow2=true">添加</el-button>
                                        <el-tooltip placement="right" v-if="editAble&&!isShow2">
                                            <div slot="content">1.最多只能添加五条卖点描述<br/>2.每条卖点描述不超过500字</div>
                                            <i class="el-icon-information"></i>
                                        </el-tooltip>
                                    </div>
                            </div>
                            <div style="display: flex" class="mt-sm">
                            <div class="mt-sm label-align"  >{{chineseData.lang_name}}：</div>
                            <el-input
                                    style="flex: 1"
                                    :disabled="!editAble"
                                    type="textarea"
                                    resize="none"
                                    v-model="chineseData.description"
                                    :autosize="{minRows: 10, maxRows: 18}"
                                    placeholder="请添加描述">
                            </el-input>
                            </div>
                    </el-col>
                    <el-col  :span="showChinese?12:24">
                            <div style="display: flex">
                                <label class="label-align">标题：</label>
                                <ui-input class="inline "
                                          style="flex: 1"
                                          :edit="editAble"
                                          v-model="item.title"></ui-input>
                            </div>
                            <div class="mt-sm" style="display: flex">
                                <label class="label-align">产品标签：</label>
                                <input-tag :tags="item.tags"
                                           :get-tag="getTag"
                                           :set-tag="setTag"
                                           style="flex: 1;"
                                           :disabled="!editAble"></input-tag>
                            </div>
                            <div class="mt-sm" style="display: flex">
                                <label class="label-align">卖点描述：</label>
                                <div style="width: 90%">
                                    <!--<el-tag :key="tag"-->
                                            <!--:closable="editAble"-->
                                            <!--class="mb-xs"-->
                                            <!--v-for="tag in item.selling_point_description"-->
                                            <!--:close-transition="false"-->
                                            <!--@close="delete_point(tag,item.selling_point_description)">{{tag|tagFilter}}</el-tag>-->
                                    <div class="mb-xs" v-for="(tag,index) in item.selling_point_description" :key="index">
                                        <span>{{index+1}}、{{tag}}</span>
                                        <span v-if="editAble" class="delete-btn" @click="delete_point(tag,item.selling_point_description)"></span>
                                    </div>
                                    <limit-input v-model="sellingPoint1"
                                                 style="width: 600px"
                                                 :maxlength="500"
                                                 :cur-span="23"
                                                 :show-number="true"
                                                 ref="savePointInput"
                                                 :is-textarea="false"
                                                 @keyup.enter.native="add_point1(item.selling_point_description)"
                                                 v-if="isShow1"></limit-input>
                                    <span v-if="isShow1" style="color:gray">输入完成后按enter键添加</span>
                                    <el-button v-if="editAble&&!isShow1"
                                               :disabled="item.selling_point_description.length >= 5"
                                               class="button-new-tag"
                                               size="small"
                                               @click="isShow1 = true">添加</el-button>
                                    <el-tooltip placement="right" v-if="editAble&&!isShow1">
                                        <div slot="content">1.最多只能添加五条卖点描述<br/>2.每条卖点描述不超过500字</div>
                                        <i class="el-icon-information"></i>
                                    </el-tooltip>
                                </div>
                            </div>
                            <div style="display: flex" class="mt-sm">
                            <div class="mt-sm label-align">{{item.lang_name}}：</div>
                            <el-input
                                    style="flex: 1"
                                    :disabled="!editAble"
                                    type="textarea"
                                    v-model="item.description"
                                    resize="none"
                                    :autosize="{minRows: 10, maxRows:18}"
                                    placeholder="请添加描述">
                            </el-input>
                            </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <div class="mt-xs" style="margin-left:60px " v-if="!isAdd" >
            <div v-if="editAble">
                <request-button req-key="productDesc" @click="keep_">保 存</request-button>
                <el-button size="mini" @click="cancel_">取  消</el-button>
            </div>
            <el-button v-else size="mini" type="primary" @click="edit">编   辑</el-button>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .c-product-desc{
        position: relative;
        .label-align{
            display: inline-block;width: 60px!important;text-align: right
        }
        .function-button{
            position: absolute;
            right:0;
            top:0;
            z-index:999;
        }
         .delete-btn {
            width: 20px;
            height: 20px;
            display: inline-block;
            vertical-align: middle;
            background-color: rgba(255, 255, 255, 1);
            transition: all 0.2s;
            &:hover {
                background-color: rgba(0, 0, 0, .1);
                border-radius: 3px;
            }
        }
        .delete-btn {
            border-radius: 8px;
            background: url('../../../assets/delete(2).png') no-repeat center;
        }
        .tag-box{
            border:1px solid #ddd;
            height:120px;
            .tag-box-child{
                padding:10px 5px;
                margin:0 5px;
                border-bottom:1px dotted #ddd;
                height:70px;
                overflow-y: auto;
            }
            .input-box{
                &.el-input {
                    > .el-input__inner {
                        border-radius: 0 !important;
                        border: none !important;
                    }
                }
            }

        }

    }
</style>
<script>
    import {api_update_desc, publish_edit_lang} from '../../../api/product-library';
    import RequestButton from "../../../global-components/request-button.vue";
    export default{
        data(){
            return{
                lang: [],
                showChinese: false,
                action: "中文",
                newTags:"",
                tags:[],
                sellingPoint1:'',
                isShow1: false,
                sellingPoint2:'',
                isShow2: false
            }
        },

        mounted(){
            this.$http(publish_edit_lang).then(res => {
                this.lang = res.map(row => {
                    row.isSelect = false;
                    return row;
                })
            }).catch(code => {
                console.log(code);
            })
        },
        filters:{
            filterPoint(val){
                return val === ''?'--':val
            },
            // tagFilter(val){
            //     if(val.length>50) {
            //         let str1 = val.substring(0,50);
            //         let str2 = val.substring(50,val.length);
            //         return str1+'\n'+str2
            //     }else{
            //         return val
            //     }
            // }
        },
        computed: {
            chineseData(){
                return this.descData.find(res => {
                    if(res.lang_id === 1){
                        return res
                    };
                });
            },
            language(){
                return this.lang.map(row => {
                    let cur = this.descData.find(res => {
                        return res.lang_id === row.id
                    });
                    row.disabled = !!cur;
                    return row;
                })
            },
        },
        methods:{
            add_point1(arr){//添加卖点描述
                let sellingPoint = this.sellingPoint1;
                if(sellingPoint){
                    arr.push(sellingPoint)
                }
                this.isShow1 = false;
                this.sellingPoint1 = ''
            },
            add_point2(arr){
                let sellingPoint = this.sellingPoint2;
                if(sellingPoint){
                    arr.push(sellingPoint)
                }
                this.isShow2 = false;
                this.sellingPoint2 = ''
            },
            delete_point(tag,arr){//---删除卖点描述
                arr.splice(arr.indexOf(tag),1)
            },
            change_data(val1,val){
                val1 = val;
            },
            getTag(item){
                return item
            },
            setTag(value){
              return value
            },
            handle_close(data,i){
                data.splice(i,1);
            },
            add_new_tag(item){
                let cur = item.newTags.replace(/\s/,"");
                if(!cur) return this.$message({type:"warning",message:`请输入内容后再点击添加`});
                if(item.tags.indexOf(cur)!==-1){
                    return this.$message({type:"warning",message:`该标签已添加，请重新输入！`});
                }
                item.tags.push(cur);
                item.newTags = '';
            },
            show_hidden(){
                this.showChinese = !this.showChinese;
            },
            tab_click(val){
                this.action = val.name;
                this.showChinese = false;
            },
            add_lang(val){
                this.action = val.name;
                let cur = {
                    declare_name: "",
                    description: "",
                    goods_id: 102505,
                    lang_id: val.id,
                    lang_name: val.name,
                    packing_name: "",
                    second_title: "",
                    seo_description: "",
                    seo_keywords: "",
                    tags:[],
                    template: "",
                    title: "",
                    newTags:"",
                    selling_point_description: []
                }
                this.descData.push(cur);
            },
            keep_(){
                if(this.descData.find(row=>{return row.description===''})){
                    this.$reqKey('productDesc',false);
                    return this.$message({type:"warning",message:`请添加描述信息后，再点击保存`});
                }
                this.$emit("keep")
            },
            cancel_(){
                this.$emit("cancel")
            },
            edit(){
                this.$emit("edit")
            },
        },
        props:{
            editAble:{
                required:true,
                type:Boolean
            },
            descData:{
                required:true,
                type:Array
            },
            isAdd:{
                default(){
                    return false;
                }
            }
        },
        components:{
            RequestButton,
            uiInput:require("../../../components/ui-input.vue").default,
            uiSelect: require('../../../components/ui-select.vue').default,
            trendsSelect: require('../../mall/new-detail/trends-select.vue').default,
            inputTag:require("../../../components/input-tag.vue").default,
            html5Editor:require('../../../components/html5-editor.vue').default,
            limitInput:require('../../../view/kandeng/ebay/kandeng-list/add-edit-listing/limit-input.vue').default
        }
    }
</script>
