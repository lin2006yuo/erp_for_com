<template>
    <el-row class="c-product-desc">
        <div class="function-button">
            <trends-select class="inline" @trigger="add_lang($event)" :selects="language"
                           type="primary"  v-if="descEdit"></trends-select>
            <el-button size="mini" class="inline" :disabled="action==='中文'" type="primary" @click.native="show_hidden">
                {{showChinese?'隐藏对照':'对照中文'}}
            </el-button>
        </div>
        <el-tabs type="card" @tab-click="tab_click" :active-name="action">
            <el-tab-pane v-for="item in descForm"
                         :key="item.lang_name"
                         :label="item.lang_name" :name="item.lang_name" >
                <el-row :gutter="8">
                    <el-col v-if="showChinese" :span="12">
                        <div class="ml-lg">
                            <div>
                                <label>标题：</label>
                                <ui-input class="inline width-super" :edit="descEdit" v-model="chineseData.title"></ui-input>
                            </div>
                            <div class="mt-sm">
                                <label>产品标签</label>
                                <div class="tag-box">
                                    <div class="tag-box-child">
                                        <el-tag
                                                class="mr-sm"
                                                type="success"
                                                v-for="(tag,i) in chineseData.tags"
                                                :key="i"
                                                :closable="descEdit&&!showChinese"
                                                @close="handle_close(chineseData.tags,i)"
                                        >{{tag}}</el-tag>
                                    </div>
                                    <el-input
                                            :disabled="!descEdit || showChinese"
                                            class="input-box"
                                            v-model="newTags"
                                            @keyup.enter.native="add_new_tag(chineseData)"
                                            placeholder="请在此区域内输入，并按Enter键添加新产品标签">
                                    </el-input>
                                </div>
                            </div>
                            <div class="mt-sm">{{chineseData.lang_name}}</div>
                            <el-input
                                    :disabled="!descEdit || showChinese"
                                    type="textarea"
                                    v-model="chineseData.description"
                                    :autosize="{minRows: 6, maxRows: 8}"
                                    placeholder="请添加描述">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col  :span="showChinese?12:24">
                        <div :class="showChinese?'':'ml-lg'">
                            <div>
                                <label>标题：</label>
                                <ui-input class="inline width-super" :edit="descEdit" v-model="item.title"></ui-input>
                            </div>
                            <div class="mt-sm">
                                <label>产品标签</label>
                                <div class="tag-box">
                                    <div class="tag-box-child">
                                        <el-tag
                                                class="mr-sm"
                                                type="success"
                                                v-for="(tag,i) in item.tags"
                                                :key="i"
                                                :closable="descEdit?true:false"
                                                @close="handle_close(item.tags,i)"
                                        >{{tag}}</el-tag>
                                    </div>
                                    <el-input
                                            :disabled="!descEdit"
                                            class="input-box"
                                            @keyup.enter.native="add_new_tag(item)"
                                            v-model="item.newTags"
                                            placeholder="请在此区域内输入，并按Enter键添加新产品标签">
                                    </el-input>
                                </div>
                            </div>
                            <div class="mt-sm">{{item.lang_name}}</div>
                            <el-input
                                    :disabled="!descEdit"
                                    type="textarea"
                                    v-model="item.description"
                                    :autosize="{minRows: 6, maxRows: 8}"
                                    placeholder="请添加描述">
                            </el-input>
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <div class="ml-lg mt-xs">
            <el-button v-if="!descEdit" type="primary" size="mini" @click="edit">编辑</el-button>
            <div v-else>
                <el-button type="primary" size="mini" @click.native="save">确定</el-button>
                <el-button size="mini" @click.native="cancel">取消</el-button>
            </div>
        </div>
    </el-row>
</template>
<style lang="stylus">
.c-product-desc{
    position: relative;
    .function-button{
        position: absolute;
        right:0;
        top:0;
        z-index:999;
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
            &.el-input{
                >.el-input__inner{
                    border-radius: 0 !important;
                    border: none !important;
                }
            }
        }

    }

}
</style>
<script>
    import {api_update_desc, publish_edit_lang} from '../../../api/product';
    export default{
        data(){
            return {
                lang: [],
                showChinese: false,
                action: "中文",
                newTags:"",
                tags:[]
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
        computed: {
            chineseData(){
               return this.descForm.find(res => {
                    if(res.lang_id === 1){
                        return res
                    };
                });
            },
            language(){
                return this.lang.map(row => {
                    let cur = this.descForm.find(res => {
                        return res.lang_id === row.id
                    });
                    row.disabled = !!cur;
                    return row;
                })
            },
        },
        watch: {},
        methods: {
            handle_close(data,i){
                data.splice(i,1);
            },
            add_new_tag(item){
                let cur = item.newTags.replace(/\s/,"");
                if(!cur) return this.$message({type:"warning",message:"请输入内容后再点击添加"});
                if(item.tags.indexOf(cur)!==-1){
                    return this.$message({type:"warning",message:"该标签已添加，请重新输入！"});
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
                }
                this.descForm.push(cur);
            },
            edit(){
                this.$emit("edit");
            },
            save(){
                if(this.descForm.find(row=>{return row.description===''}))return this.$message({type:"warning",message:"请添加描述信息后，再点击保存"});
                this.$emit("save");
            },
            cancel(id){
                this.$emit("cancel");
            },
        },
        props: {
            descForm: {
                required: true,
                type: Array,
            },
            descEdit: {
                reqired: true,
                type: Boolean,
            },
            languageList: {
                reqired: true,
                type: Array,
            }
        },
        components: {
            uiInput: require('../../../components/ui-input.vue').default,
            uiSelect: require('../../../components/ui-select.vue').default,
            trendsSelect: require('./trends-select.vue').default
        }
    }
</script>
