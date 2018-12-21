<template>
    <div class="c-category-box">
        <ul class="category-box">
            <li style="cursor: pointer"
                v-for="(item,index) in data"
                :key="`${index}`"
                :class="[item.show?'highlight':'']" @click="cur_category(data,item,index)">
                <ui-tip :key="`${index}${item.category_name}`" :content="item.category_name || item.category_name_zh" :width="98"></ui-tip>
            </li>
        </ul>
        <template>
            <category-box :data="curData.children"
                          v-if="curData.children && curData.children.length>0"
                          :request="get_request()"
                          @last="last"
                          :site="site"
                          :channel="channel"
                          which-one="category"
            ></category-box>
        </template>
    </div>
</template>
<style lang="stylus">
    .c-category-box {
        display: inline;
        word-wrap: break-word;

        ul.category-box {
            box-sizing: border-box;
            width: 237px;
            display: inline-block;
            border: 1px solid transparent;
            height: 200px;
            overflow-y: auto;
            overflow-x: hidden;
            margin-top:10px;
            background-color: #e4e8f1;
            li {
                height: 26px;
                line-height: 26px;
                padding: 0 10px;
                &:hover {
                    /*background-color: #e5e9f2;*/
                    background-color: rgba(228,232,241,0.8);
                }
            }
            .highlight {
                background-color: #2e90fe;
                a{
                    color: #fff !important;
                }
                &:hover {
                    background-color: #2e90fe;
                }
            }
        }
    }
</style>
<script>
    import {api_get_categorys} from '../../../api/ebay-kandeng-public-module';
    import {api_get_custom_category} from '../../../api/ebay-kandeng-public-module';
    import {api_aliexpress_classify} from "../../../api/publish-smt";
    import {api_product_category, api_product_search} from '../../../api/amazon-publish-info';
    import {api_shopee_category} from '../../../api/shopee-publish';
    export default{
        name: "category-box",
        data(){
            return {
                curData: {},
                curCategoryName: "",
            }
        },
        computed: {
            current(){
                let find = this.data.find(row => {
                    return row.show;
                })
                if (!!find) {
                    return find
                } else {
                    return ""
                }
            }
        },
        methods: {
            last(val,val2){
                //val2 是亚马逊平台需要的，最后一个分类的完整数据
                this.$emit("last", val,val2);
            },
            get_request(){
                let request = window.clone(this.request);
                let enabled = this.current.variations_enabled;
                let obj = {
                    variations_enabled:enabled===0||enabled===1?enabled:'',
                    compatibility_enabled:this.current.item_compatibility_enabled,
                    category_id: this.current.category_id,
                    category_name: this.current.category_name
                };

                return [...request, obj]
            },
            cur_category(data, item, index){
                /*取消其他行的高亮*/
                let cur = data.find((row, i) => {
                    if (i !== index && row.hasOwnProperty("show")) {
                        return row.show === true;
                    }
                });
                if (cur) cur.show = false;
                /*高亮当前行*/
                item.show = true;
                /*调用子级数据*/
                switch (this.channel) {
                    case 'ebay':
                        let params = {
                            category_id: item.category_id,
                            site: this.site,
                        };
                        this.$set(item, 'children', []);
                        this.curData = item;
                        if (this.whichOne === "category") {
                            this.$http(api_get_categorys, params).then(res => {
                                res.data.forEach(re => {
                                    this.$set(re, 'show', false);
                                });
                                item.children = res.data;
                                if (item.children.length <= 0) {
                                    this.$emit("last", this.get_request());
                                }
                                this.curData = item;
                                /*当前选择的分类*/
                            }).catch(code => {
                                console.log("code", code);
                            })
                        } else if (this.whichOne === "store") {
                            this.$http(api_get_custom_category, params).then(res => {
                                res.data.forEach(re => {
                                    this.$set(re, 'show', false);
                                });
                                item.children = res.data;
                                if (item.children.length <= 0) {
                                    this.$emit("last", this.get_request());
                                }
                                this.curData = item;
                                /*当前选择的分类*/
                            }).catch(code => {
                                console.log("code", code);
                            })
                        }
                        break;
                    case 'aliexpress':
                        if (this.whichOne === "category") {
                            let params = {
                                category_id: item.category_id,
                            };
                            this.$set(item, 'children', []);
                            this.curData = item;
                            this.$http(api_aliexpress_classify, params).then(res => {
                                res.forEach(re => {
                                    this.$set(re, 'show', false);
                                })
                                item.children = res;
                                if (item.children.length <= 0) {
                                    this.$emit("last", this.get_request());
                                }
                                this.curData = item;
                                /*当前选择的分类*/
                            }).catch(code => {
                                console.log("code", code);
                            })
                        }
                        break;
                    case 'amazon':
                        let amazon = {
                            category_id: item.id,
                            site: this.site,
                        };
                        this.$set(item, 'children', []);
                        this.curData = item;
                        this.$http(api_product_category, amazon).then(res => {
                            res.forEach(row=>{
                                this.$set(row, 'show', false);
                                this.$set(row, 'category_name', row.en_name);
                            });
                            item.children = res;
                            this.curData = item;
                            if (item.children.length <= 0) {
                                this.$emit("last", this.get_request(),this.curData);
                            }
                        }).catch(code => {
                            console.log("code", code);
                        });
                        break;
                    case 'shopee':
                        this.$set(item,'children',[]);
                        this.curData = item;
                        this.$http(api_shopee_category,{category_id:item.category_id,site:this.site}).then(res => {
                            res.forEach(row=>{
                                this.$set(row, 'show', false);
                            });
                            item.children = res;
                            if (item.children.length <= 0) {
                                this.$emit("last", this.get_request());
                            }
                            this.curData = item;
                        }).catch(code => {
                            console.log(code,'code');
                        });
                    default:
                        break;
                }


            },
        },
        props: {
            data: {},
            site: {},
            request: {
                type: Array,
                required: true
            },
            whichOne: {
                required: true
            },
            channel: {}
        },
        components: {
            uiTip:require("../../../components/ui-tip.vue").default,
        }
    }
</script>
