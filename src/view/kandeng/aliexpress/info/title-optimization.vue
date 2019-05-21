<template>
    <page-dialog v-model="show" @open="open" title="标题优化" size="large" class="c-title-optimization">
        <el-row>
            <el-col :span="4">
                <img :src="mainImg" height="120px" width="120px">
            </el-col>
            <el-col :span="20">
                <p>类目：{{get_cate()}}</p>
                <p>标题：{{singleData.title}}</p>
                <p>
                    <label-buttons class="inline btn-ml" label="语言：" title="请选择状态" :buttons="langList" @select="select_lang"></label-buttons>
                </p>
            </el-col>
        </el-row>
        <div class="tag-flex mb-sm">
            <div class="tag-flex-content">
                <input-title-tag :tag="tags"
                                 :title="title"
                                 @get-title="get_title"
                                 ref="tagData"
                                 type="primary"></input-title-tag>
            </div>
        </div>
        <div class="mb-sm">
            <label-buttons class="inline btn-ml" label="" title="请选择状态" :buttons="btnList" @select="select_btn"></label-buttons>
        </div>
        <ui-table
            v-if="btnStatus===0"
            ref="word"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            @sort-click="sort_click"
            :has-data="tableData.length>0"
            :body-height="85"
            :heads="[
                        {label:'关键词',width:'14'},
                        {label:'搜索人气',isSort:true,order_type:'search_popularity',status:btnStatus},
                        {label:'搜索指数',width:'14'},
                        {label:'点击率',width:'14'},
                        {label:'转化率',width:'14'},
                        {label:'竞争',width:'14'},
                        {label:'国家',width:'14'}
                       ]">
            <tbody>
            <tr v-for="(item,i) in tableData" :key="i" v-if="tableData.length">
                <td @click="add_word(item.word)">
                    <ui-tip :content="item.word" :width="95" class="operate"></ui-tip>
                </td>
                <td>
                    <ui-progress :max-num="maxList.search_popularity" :self-num="item.search_popularity" :show-text="showText"></ui-progress>
                </td>
                <td>
                    <ui-progress :max-num="maxList.search_index" :self-num="item.search_index" :show-text="showText"></ui-progress>
                </td>
                <td>
                    <ui-progress :max-num="maxList.click_rate"
                                 :self-num="item.click_rate"
                                 percent="true"
                                 :show-text="showText"></ui-progress>
                </td>
                <td>
                    <ui-progress :max-num="maxList.translate_rate"
                                 :self-num="item.translate_rate"
                                 percent="true"
                                 :show-text="showText"></ui-progress>
                </td>
                <td>
                    <ui-progress :max-num="maxList.competition" :self-num="item.competition" :show-text="showText"></ui-progress>
                </td>
                <td><ui-tip :content="item.country" :width="95"></ui-tip></td>
            </tr>
            </tbody>
        </ui-table>
        <ui-table
            v-if="btnStatus===1"
            ref="bcar"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            @sort-click="sort_click"
            :has-data="tableData.length>0"
            :body-height="85"
            :heads="[
                        {label:'关键词',width:'20'},
                        {label:'热搜词',width:'15',isSort:true,order_type:'searchs',status:btnStatus},
                        {label:'类目相关度',width:'15'},
                        {label:'竞争',width:'15'},
                        {label:'均价',width:'10'},
                        {label:'高流量',width:'6'},
                        {label:'推荐',width:'6'},
                        {label:'高订单',width:'6'},
                        {label:'高转化',width:'7'},
                       ]">
            <tbody>
            <tr v-for="(item,i) in tableData" :key="i" v-if="tableData.length">
                <td @click="add_word(item.word)">
                    <ui-tip :content="item.word" :width="95" class="operate"></ui-tip>
                </td>
                <td>
                    <ui-progress :max-num="maxList.searchs" :self-num="item.searchs" :show-text="showText"></ui-progress>
                </td>
                <td>
                    <ui-progress :max-num="maxList.cate_relevance" :self-num="item.cate_relevance" :show-text="showText"></ui-progress>
                </td>
                <td>
                    <ui-progress :max-num="maxList.competition"
                                 :self-num="item.competition"
                                 :show-text="showText"></ui-progress>
                </td>
                <td>
                    <ui-tip :content="item.avg_price" :width="95"></ui-tip>
                </td>
                <td>
                    <span class="el-icon-check check-color" v-if="item.high_flow"></span>
                    <span class="el-icon-close" v-else></span>
                </td>
                <td>
                    <span class="el-icon-check check-color" v-if="item.recommend"></span>
                    <span class="el-icon-close" v-else></span>
                </td>
                <td>
                    <span class="el-icon-check check-color" v-if="item.high_order"></span>
                    <span class="el-icon-close" v-else></span>
                </td>
                <td>
                    <span class="el-icon-check check-color" v-if="item.high_transform_rate"></span>
                    <span class="el-icon-close" v-else></span>
                </td>
            </tr>
            </tbody>
        </ui-table>
        <el-pagination
            class="fr mt-sm"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="size"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click.native="keep">确定</el-button>
            <el-button size="mini" type="primary" @click.native="show = false">关闭</el-button>
        </span>
    </page-dialog>
</template>
<style lang="stylus">
    .c-title-optimization{
        .check-color{
            color: #67C23A;
        }
        .operate{
            >a{
                color: #69f !important;
                cursor: pointer !important;
                &:hover{
                    text-decoration:underline;
                }
            }
        }
    }
</style>
<script>
    import {
        api_alihel_hotlang,
        api_alihelp_hot_word,
        api_alihelp_bcar
    } from '../../../../api/publish-smt'
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    export default{
        data(){
            return{
                show:this.value,
                showText:false,
                langList:[],
                btnList:[
                    {label:"热词",value:1},
                    {label:"直通车",value:2},
                ],
                langStatus:"",
                btnStatus:"",
                tableData:[],
                loading:false,
                maxList:{},
                page:1,
                total:0,
                size:20,
                clickWord:"",
                title:"",
                tags:[],
                order:"",
            }
        },
        mounted(){
        },
        methods:{
            open(){
                this.langList = [];
                this.tableData = [];
                this.title = window.clone(this.singleData.title);
                this.tags = this.title.split(" ");
                this.init();
            },
            get_path,
            //获取语言列表
            init(){
                this.$http(api_alihel_hotlang).then( res =>{
                    for(let key in res){
                        this.langList.push(
                            {label:res[key],value:key},
                        )
                    }
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                });
            },
            //点击排序
            sort_click(val){
            	this.order = val.order === 'asc' ? "up": "down";
                this.tableData = [];
                this.loading = true;
                switch (val.status){
                    case 0:
                        this.hot_word();
                        break;
                    case 1:
                        this.hot_bcar();
                        break;
                    default:
                        break;
                }
            },
            //点击表格添加词
            add_word(word){
                this.clickWord = word;
                let find = this.tags.find(row=>{
                	return row===word;
                });
                if(!find){
                    this.tags.push(word);
                }else{
                	this.$message({type:"warning", message: "已存在"});
                }
            },
            //选择语言
            select_lang(val){
                this.langStatus= val;
                this.ajax_btns();
            },
            handleCurrentChange(page){
                this.page = page;
                this.ajax_btns();
            },
            select_btn(val){
                this.btnStatus = val;
                this.page = 1;
                this.order = "";
                this.ajax_btns();
            },
            ajax_btns(){
                this.tableData = [];
                this.loading = true;
//                console.log('this.btnStatus',this.btnStatus,"this.langStatus",this.langStatus)
                switch (this.btnStatus){
                    case 0:
                        this.hot_word();
                        break;
                    case 1:
                        this.hot_bcar();
                        break;
                    default:
                        break;
                }
            },
            //热词
            hot_word(){
                let lang = this.langList[this.langStatus]&&this.langList[this.langStatus].value;
                let obj = {
                    category:parseInt(this.singleData.category_id)||"",
                    page:this.page,
                    lang:lang || "en",
                    sort: this.order,
                }
                this.$http(api_alihelp_hot_word,obj).then( res =>{
                    this.tableData = res.list;
                    this.maxList = res.max;
                    this.loading = false;
                    this.total = res.pageMsg.total;
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error", message: code.message || code});
                });
            },
            //直通车
            hot_bcar(){
                let lang = this.langList[this.langStatus]&&this.langList[this.langStatus].value;
                let obj = {
                    category:parseInt(this.singleData.category_id)||"",
                    page:this.page,
                    lang:lang || "en",
                    sort:this.order,
                }
                this.$http(api_alihelp_bcar,obj).then( res =>{
                    this.tableData = res.list;
                    this.maxList = res.max;
                    this.loading = false;
                    this.total = res.pageMsg.total;
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error", message: code.message || code});
                });
            },
            get_cate(){
                let find = this.singleData.categoryArray.find(row=>{
                    return row.category_id === this.singleData.category_id
                });
                if(!!find){
                    return find.category_name||find.name;
                }
            },
            get_title(val){
                this.title = val;
            },
            keep(){
            	if(this.title.length>128){
            		this.$message({type:"warning", message: "标题字数超过限制"});
            		return ;
                }
                this.singleData.title = this.title;
                this.show = false;
            },
        },
        computed:{
            mainImg(){
                if(this.singleData.imgs.length){
                	return get_path(this.singleData.imgs[0].path,"_200x200.",this.singleData.base_url);
                }
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
            tags(val){
            	this.title = val.join(" ");
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            singleData:{
                required: true,
                type: Object
            },
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
            inputTitleTag:require("../../../../components/input-title-tag.vue").default,
            uiProgress:require("../../../../components/ui-progress.vue").default,
            labelButtons:require('../../../../components/label-buttons.vue').default,
            uiTable:require('../../../../components/ui-table.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
        }
    }
</script>
