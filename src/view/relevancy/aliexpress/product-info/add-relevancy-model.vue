<template>
    <page-dialog class="add-relevancy" @open="open" title="添加" size="large" v-model="modelVisible" :close-on-click-modal="false">
        <el-form :label-position="labelPosition" label-width="120px" :model="ruleForm"  >
            <el-form-item
                label="速卖通账号简称："
                :rules="[{required: true, message: '请选择速卖通账号简称', trigger: 'change', type:'number'}]"
                prop="searchData.account_id"
            >
                <el-select class="inline" placeholder="请选择" v-model="ruleForm.searchData.account_id" @change="changeAccountSearch" filterable>
                    <el-option
                        v-for="item in accountList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="模块名称："
                :rules="[{required: true, message: '请输入模块名称', trigger: 'blur', type:'string'}]"
                prop="addModelName"
            >
                <el-input  class="inline" placeholder="请输入英文名称" v-model="ruleForm.addModelName"></el-input>
            </el-form-item>
        </el-form>
        <div class="from-box">
            <div class="select-label">
                <p>关联产品内容（{{imgList.length}}）:</p>
            </div>
            <div class="select-content">
                <div style="position: relative;width: 800px;height: 100px;;border: 1px solid #ddd;">
                    <div style="height: 100px;width: 740px;margin: 5px auto;overflow: hidden;position: relative;">
                        <drag-drop tag="ul" class="img-swiper" ref="imgSwiper" style="left:0;width:0;" id="imgSwiper">
                            <li v-for="(item,index) in imgList"><img :src="item.img+'_50x50.jpg'" alt=""><a
                                @click="delectImgList(index,item)">&times;</a></li>
                        </drag-drop>
                    </div>
                    <el-button size="mini" class="prev-btn" type="primary" @click="prevImgList" :disabled="prevDisabled"> &lt;</el-button>
                    <el-button size="mini" class="next-btn" type="primary" @click="nextImgList" :disabled="nextDisabled"> &gt;</el-button>
                </div>
                <div style="padding: 10px 0;">
                    <el-input class="inline" placeholder="请输入刊登产品名称" v-model="ruleForm.searchData.title" style="width:150px"></el-input>
                    <label>产品分组：</label>
                    <ui-groups v-model="ruleForm.searchData.group_id" :option="groups"></ui-groups>
                    <label>到期时间：</label>
                    <el-select class="inline" v-model="ruleForm.searchData.expire_day" style="width:150px">
                        <el-option value="3" label="有效期剩余3天内" key="3"></el-option>
                        <el-option value="7" label="有效期剩余7天内" key="7"></el-option>
                    </el-select>
                    <el-button size="mini" type="primary" @click="search">搜索</el-button>

                    <el-button size="mini" @click="clear_search">清空搜索</el-button>
                </div>
                <div style=";border: 1px solid #ddd;">
                    <div style="height: 350px;overflow: auto">
                        <el-table
                            :data="productList"
                            ref="listtable"
                            v-loading="loading"
                            element-loading-text="拼命加载中"
                            @select="select_product"
                            @row-click="select_row"
                        >
                            <el-table-column
                                type="selection"
                                width="35">
                            </el-table-column>
                            <el-table-column
                                inline-template
                                width="80"
                                heith="80"
                            >
                                <div class="img-box"><img :src="row.img+'_50x50.jpg'" alt=""></div>
                            </el-table-column>
                            <el-table-column
                                inline-template
                            >
                                <span>{{row.title}}</span>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="ruleForm.searchData.page"
                        :page-sizes="[20, 50, 100, 200,500]"
                        :page-size="ruleForm.searchData.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div style="text-align: right;margin-right: 60px;">
            <el-button size="mini" type="primary" @click="addModel">确定</el-button>
            <el-button size="mini" type="default" @click="previewModel">预览</el-button>
            <el-button size="mini" type="default" @click.native="modelVisible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .add-relevancy {
        .el-pagination{
            text-align: right;
        }
        padding-bottom: 20px;
        .el-table__header-wrapper{
            display: none;
        }
        .img-box {
            width: 60px;
            height: 60px;
            img {
                width: 60px;
                height: 60px;
            }
        }
        .img-swiper {
            position: absolute;
            top: 0;
            left: 0;
            width: 740px;
            li {
                width: 80px;
                text-align: center;
                border: 1px solid #aaa;
                float: left;
                margin-left: 10px;
                position: relative;
                a {
                    position: absolute;
                    right: 0;
                    top: 0;
                    height: 20px;
                    width: 20px;
                    text-align: center;
                    line-height: 20px;
                    cursor: pointer;
                    background: #fff;
                    color: #000;
                }
                img {
                    width: 80px;
                    height: 80px;
                    vertical-align: middle;
                }
            }
        }
        .el-select, .el-input {
            width: 150px;
            display: inline-block;
        }
        .from-box {
        }
        .select-label {
            width: 115px;
        }
        .select-label p {
            text-align: right;
        }
        .select-content {
            width: 800px;
            position: relative;
            left: 120px;
            top: -26px;
            .prev-btn {
                position: absolute;
                left: 5px;
                top:5px;
                width: 25px;
                height: 85px;
                font-size: 15px;
            }
            .next-btn {
                position: absolute;
                bottom: 0;
                right: 5px;
                top:5px;
                width: 25px;
                height: 85px;
                font-size: 15px;
            }
        }
    }
</style>

<script>
    import {api_aliexpress_list, api_aliexpress_base_info} from '../../../../api/publish-smt'
    import {api_create_category, api_review, api_groups,api_product_list} from '../../../../api/aliexpress-product-info'
    export default{
        data(){
            return {
                selecteds: [],
                modelVisible: false,
                labelPosition: "right",
                productList: [],//商品列表
                imgList: [],//已选择商品图片列表
                groups: [],//商品分组
                imgSwiperWidth: 0,
                imgSwiperLeft: 0,
                nextDisabled: true,
                prevDisabled: true,
                loading: false,
                total: 0,
                selectionLength: 0,
                pickerOptions: {
                },
                ruleForm:{
                    searchData: {
                        page: 1,
                        pageSize: 50,
                        account_id: "",
                        expire_day: "",
                        group_id: "",
                        title:""
                    },
                    addModelName: ''
                }
                ,
                product_ids: ''
            }
        },
        created(){

        },
        mounted(){

        },
        updated(){
            //console.log(this.accountList);

            //this.init();
        },
        destroy(){
        },
        filters: {},
        methods: {
            open(){
                this.imgSwiperLeft = 0;
                this.imgBoxWidth();
                this.productList=[];
                this.imgList= [];
                this.groups=[];
                this.product_ids =[];
                this.ruleForm={
                    searchData: {
                        page: 1,
                        pageSize: 50,
                        account_id: "",
                        expire_day: "",
                        group_id: "",
                        title:""
                    },
                    addModelName: ''
                }
            },
            not_publish(val){
                this.$http(api_groups, {account_id: val}).then(res => {//获取商品分组
                    this.groups = res.map(row=>{
                        return{
                            'label':row.group_name,
                            'value':row.group_id,
                            'children': (function () {
                                if(!!row.children){
                                    return row.children.map(item => {
                                        return {
                                            'label':item.group_name,
                                            'value':item.group_id
                                        }
                                    })
                                }
                            })()
                        }
                    });
                    //console.log(this.groups);
                }).catch(code => {
                    //console.log(code)
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                })
            },
            init(){
                this.productList = [];
                this.loading = true;
                let data = window.clone(this.ruleForm.searchData);
                return this.$http(api_product_list, data).then(res => {
                    this.productList = res.data;
                    this.$nextTick(() => {
                        this.productList.forEach(row => {
                            let find = this.imgList.find(item => {
                                return row.id === item.id
                            })
                            if (!!find) {
                                this.$refs.listtable.toggleRowSelection(row, true);
                            }
                        })
                    });
                    this.total = res.count;
                    this.loading = false;
                    return Promise.resolve();
                }).catch(code => {
                    //console.log(code)
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                });


            },
            handleSizeChange(val){
                this.ruleForm.searchData.pageSize = val;
                this.init();
            },
            handleCurrentChange(val){
                this.ruleForm.searchData.page = val;
                this.init();
            },
            changeAccountSearch(){
                this.loading = true;
                this.imgList = [];
                this.init();
                this.not_publish(this.ruleForm.searchData.account_id);
            },
            delectImgList(index, row){//删除了商品
                this.imgList.splice(index, 1);
                this.$refs.listtable.toggleRowSelection(row, false);
            },
            search(){
                this.init();
            },
            select_product(selection, row){//选择了商品
                let find = this.imgList.findIndex(item => {
                    return item.id === row.id
                });
                if (find === -1) {
                    this.imgList.push(row);
                } else {
                    this.imgList.splice(find, 1);
                }
                this.imgBoxWidth();//计算图片列表宽度
                let arr = [];
                this.imgList.forEach((val) => {
                    arr.push(val.product_id);
                });
                this.product_ids = arr.join(',');
                if (this.imgList.length === 0) {
                } else {
                }
                if (this.imgList.length > 8) {
                    this.nextDisabled = false;
                }
                else {
                    this.nextDisabled = true;
                }
            },
            select_row(row){//点击了某一行
                let find = this.imgList.findIndex(item => {
                    return item.id === row.id
                });
                if (find === -1) {
                    this.imgList.push(row);
                } else {
                    this.imgList.splice(find, 1);
                }
                this.productList.forEach(row => {
                    let find = this.imgList.find(item => {
                        return row.id === item.id
                    })
                    if (!!find) {
                        this.$refs.listtable.toggleRowSelection(row, true);
                    }else {
                        this.$refs.listtable.toggleRowSelection(row, false);
                    }
                });
                this.imgBoxWidth();//计算图片列表宽度
                let arr = [];
                this.imgList.forEach((val) => {
                    arr.push(val.product_id);
                });
                this.product_ids = arr.join(',');
                if (this.imgList.length === 0) {
                } else {
                }
                if (this.imgList.length > 8) {
                    this.nextDisabled = false;
                }
                else {
                    this.nextDisabled = true;
                }
            },
            imgBoxWidth(){
                let n = Math.ceil(this.imgList.length / 8);
                this.imgSwiperWidth = n * 740;
                document.getElementById('imgSwiper') && (document.getElementById('imgSwiper').style.width = this.imgSwiperWidth + `px`);
            },
            prevImgList(){
                this.imgSwiperLeft += 740;
                document.getElementById('imgSwiper') && (document.getElementById('imgSwiper').style.left = this.imgSwiperLeft + `px`);
                if (this.imgSwiperLeft >= 0) {
                    this.prevDisabled = true;
                }else {
                    this.prevDisabled = false;
                }
                if (-this.imgSwiperLeft >= (this.imgSwiperWidth - 740)) {
                    this.nextDisabled = true;
                }else {
                    this.nextDisabled = false;
                }
            },
            clear_search(){
                this.ruleForm.searchData.group_id='';
                this.ruleForm.searchData.expire_day='';
                this.ruleForm.searchData.title='';
                this.init();
            },
            nextImgList(){
                this.imgSwiperLeft -= 740;
                document.getElementById('imgSwiper') && (document.getElementById('imgSwiper').style.left = this.imgSwiperLeft + `px`);
                if (-this.imgSwiperLeft >= (this.imgSwiperWidth - 740)) {
                    this.nextDisabled = true;
                }else {
                    this.nextDisabled = false;
                }
                if (this.imgSwiperLeft >= 0) {
                    this.prevDisabled = true;
                }else {
                    this.prevDisabled = false;
                }
            },
            addModel(){//添加模块
                if(this.product_ids.length ===0){
                    this.$message({
                        showClose:true,
                        type:"error",
                        message:"关联产品内容必填"
                    })
                    return false;
                }
                let param = {
                    name: this.ruleForm.addModelName,
                    module_contents: this.product_ids,
                    account_id: this.ruleForm.searchData.account_id
                }
                return this.$http(api_create_category, param).then(res => {
                    this.$message({
                        showClose: true,
                        type:"success",
                        message: res.message || res
                    });
                    this.$emit('add-model',param)
                    this.modelVisible = false;
                    this.productList=[];
                    this.imgList= [];
                    this.groups=[];
                    this.product_ids =[];
                    this.ruleForm={
                        searchData: {
                            page: 1,
                            pageSize: 50,
                            account_id: "",
                            expire_day: "",
                            group_id: "",
                            title:""
                        },
                        addModelName: ''
                    }
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        type:"error",
                        message: code.message || code
                    });
                })
            },
            previewModel(){//预览模块
                if(this.product_ids.length===0){
                    this.$message({
                        showClose:true,
                        type:"error",
                        message:"请选择模块内容"
                    });
                    return false;
                }
                return this.$http(api_review, {product_ids: this.product_ids}).then(res => {
                    //this.modelVisible = false;
                    this.$emit("previewModel", res.data)
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                });
            }
        },
        computed: {
//      imgList(){
//        this.imgBoxWidth();
//      },
            showSelecteds(){
                let ret = [];
                return ret;
            }
        },
        watch: {
            modelVisible(val){
                this.$emit('input', val);
            },
            value(val){
                this.modelVisible = val;
            }
        },
        props: {
            value: {},
            accountList: {
                type: Array
            }
        },
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default,
            uiGroups: require("../../../../components/ui-groups.vue").default,
            dragDrop: require('../../../../components/drag-drop').default,
        }
    }
</script>
