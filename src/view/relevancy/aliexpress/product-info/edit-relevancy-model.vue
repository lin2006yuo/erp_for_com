<template>
    <page-dialog @open="open" class="edit-relevancy" title="编辑" size="large"  v-model="modelVisible" :close-on-click-modal="false">
        <el-form :label-position="labelPosition" label-width="180px">
            <el-form-item label="速卖通账号简称：" >
                <el-select class="inline" placeholder="请选择" v-model="editObject.account_id" @change="changeAccountSearch" :disabled="true">
                    <el-option
                        v-for="item in accountList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="模块名称：">
                <el-input class="inline" placeholder="请输入英文名称" v-model="editObject.name"></el-input>
            </el-form-item>
        </el-form>
        <div class="from-box">
            <div class="select-label">
                <p>关联产品内容（{{imgList.length}}）:</p>
            </div>
            <div class="select-content">
                <div style="position: relative;width: 800px;height: 100px;;border: 1px solid #ddd;">
                    <div style="height: 100px;width: 740px;margin: 5px auto;overflow: hidden;position: relative;">
                        <drag-drop tag="ul" class="img-swiper" ref="imgSwiper" id="imgSwiper">
                            <li v-for="(item,index) in imgList"><img :src="item.main_img+'_50x50.jpg'" alt=""><a @click="delectImgList(index,item)">&times;</a></li>
                        </drag-drop>
                    </div>
                    <el-button size="mini" class="prev-btn" type="primary" @click="prevImgList" :disabled="prevDisabled"> &lt;</el-button>
                    <el-button size="mini" class="next-btn" type="primary" @click="nextImgList" :disabled="nextDisabled"> &gt;</el-button>
                </div>
                <div style="padding: 10px;">
                    <el-input class="inline" placeholder="请输入刊登产品名称" v-model="searchData.title" style="width:150px"></el-input>
                    <label>产品分组：</label>
                    <ui-groups v-model="searchData.group_id" :option="groups"></ui-groups>
                    <label>到期时间：</label>
                    <el-select class="inline" v-model="searchData.expire_day" style="width:150px">
                        <el-option value="3" label="有效期剩余3天内" key="3"></el-option>
                        <el-option value="7" label="有效期剩余7天内" key="7"></el-option>
                    </el-select>

                    <el-button size="mini" type="primary" @click="searchProduct">搜索</el-button>
                    <el-button size="mini" @click="clear_search">清空搜索</el-button>
                </div>
                <div style=";border: 1px solid #ddd;">
                    <div style="height: 367px;overflow: auto">
                        <el-table
                            :data="productList"
                            @select="select_product"
                            ref="listtable"
                            v-loading="loading"
                            element-loading-text="拼命加载中"
                            @row-click="select_row"
                        >
                            <el-table-column
                                type="selection"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                inline-template
                                width="80"
                                heith="80"
                            >
                                <div class="img-box"><img :src="row.main_img+'_50x50.jpg'" alt=""></div>
                            </el-table-column>
                            <el-table-column
                                inline-template
                            >
                                <span>{{row.subject}}</span>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchData.page"
                        :page-sizes="[20, 50, 100, 200,500]"
                        :page-size="searchData.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div style="text-align: right;margin-right: 60px;">
            <el-button size="mini" type="primary" @click="edit">修改</el-button>
            <el-button size="mini" type="default" @click="previewEditModel">预览</el-button>
            <el-button size="mini" type="default" @click.native="modelVisible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .edit-relevancy{
        padding-bottom: 20px;
        .el-pagination{
            text-align: right;
        }
        .el-table__header-wrapper{
            display: none;
        }
        .dialog__body{
            max-height: 720px!important;
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
    import {api_aliexpress_list} from '../../../../api/publish-smt'
    import {api_edit,api_review,api_edit_img,api_groups,api_product_list,api_look_template} from '../../../../api/aliexpress-product-info'
    export default{
        data(){
            return{
                modelVisible:false,
                labelPosition:"right",
                productList:[],
                imgList:[],//已选择商品图片列表
                imgSwiperWidth:0,
                imgSwiperLeft:0,
                nextDisabled: true,
                prevDisabled: true,
                loading: true,
                total:0,
                groups:[],
                pickerOptions: {},
                searchData:{
                    page: 1,
                    pageSize: 50,
                    account_id: "",
                    expire_day: "",
                    group_id: "",
                    title:""
                },
                product_ids:'',
                addModelName:'',
//                id:'',
                editObject:{}
            }
        },
        methods:{
            open(){
                this.searchData = {
                    page: 1,
                    pageSize: 50,
                    account_id: "",
                    expire_day: "",
                    group_id: "",
                    title:""
                };
                this.get_template();
            },
            searchProduct(){
                this.init();
            },
            clear_search(){
                this.searchData.group_id='';
                this.searchData.expire_day='';
                this.searchData.title='';
                this.init();
            },
            not_publish(val){
                this.$http(api_groups, {account_id: val}).then(res => {
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
                }).catch(code => {
                    //console.log(code)
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                })
            },
            get_template(){
                this.$http(api_look_template,{id:this.id}).then(res=>{
                    this.editObject = res;
                    this.getImg();
                    this.imgBoxWidth();
                    this.imgSwiperLeft = 0;
                    this.searchData.account_id = this.editObject.account_id;
                    this.not_publish(this.editObject.account_id);
                    this.init();
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            init(){
                this.productList = [];
                this.loading=true;
                let data = window.clone(this.searchData);
                this.$http(api_product_list,data).then(res=>{
                    this.productList=res.data.map(row=>{
                        return {
                            'account_id':row.account_id,
                            'main_img':row.img,
                            'product_id':row.product_id,
                            'subject':row.title,
                        }
                    });
                    this.$nextTick(() => {
                        this.productList.forEach(row => {
                            let find = this.imgList.find(item => {
                                return row.product_id === item.product_id
                            });
                            if (!!find) {
                                this.$refs.listtable.toggleRowSelection(row, true);
                            }
                        })
                    });
                    this.total=res.count;
                    this.loading=false;
                }).catch(code=>{
                    //console.log(code)
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                })
            },
            getImg(){
                this.imgList = [];
                //console.log(this.editObject.module_contents);
                this.$http(api_edit_img,{product_ids:this.editObject.module_contents}).then(res=>{
                    this.imgList = res.data.map(row=>{
                        return {
                            'account_id':row.account_id,
                            'main_img':row.main_img,
                            'product_id':row.product_id,
                            'subject':row.subject,
                        }
                    });

                    this.imgBoxWidth();


                    if (this.imgList.length > 8) {
                        this.nextDisabled = false;
                    }
                    else {
                        this.nextDisabled = true;
                    }
                })

            },
            handleSizeChange(val){
                this.searchData.pageSize=val;
                this.init()
            },
            handleCurrentChange(val){
                this.searchData.page=val;
                this.init()
            },
            changeAccountSearch(){
                //console.log(this.searchData);
                this.init();
            },
            delectImgList(index,row){//删除了商品
                this.imgList.splice(index,1);
                this.productList.forEach(res=>{
                    if(res.product_id === row.product_id){
                        this.$refs.listtable.toggleRowSelection(res, false);
                    }
                });

            },
            select_row(row){//点击了某一行
                let find = this.imgList.findIndex(item => {
                    return item.product_id === row.product_id
                });
                if (find === -1) {
                    this.imgList.push(row);
                } else {
                    this.imgList.splice(find, 1);
                }

                this.productList.forEach(row => {
                    let find = this.imgList.find(item => {
                        return row.product_id === item.product_id
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
                } else {
                    this.nextDisabled = true;
                }
            },
            select_product(selection, row){//选择了商品
                let find = this.imgList.findIndex(item => {
                    return item.product_id === row.product_id
                });
                if (find === -1) {
                    this.imgList.push(row);
                } else {
                    this.imgList.splice(find, 1);
                }
                this.imgBoxWidth();//计算图片列表宽度
                if (this.imgList.length > 8) {
                    this.nextDisabled = false;
                }
                else {
                    this.nextDisabled = true;
                }
            },
            imgBoxWidth(){
                this.$nextTick(()=>{
                    let n = Math.ceil(this.imgList.length/8);
                    this.imgSwiperWidth = n*740;
                    document.getElementById('imgSwiper').style.width = this.imgSwiperWidth + `px`;

                });
            },
            prevImgList(){
                this.$nextTick(()=>{
                    this.imgSwiperLeft += 740;
                    document.getElementById('imgSwiper').style.left = this.imgSwiperLeft + `px`;
                    if(this.imgSwiperLeft>=0){
                        this.prevDisabled = true;
                        this.nextDisabled = false;
                    }
                });
            },
            nextImgList(){
                this.$nextTick(()=>{
                    this.imgSwiperLeft -= 740;
                    document.getElementById('imgSwiper').style.left = this.imgSwiperLeft + `px`;
                    if(-this.imgSwiperLeft>=(this.imgSwiperWidth-740)){
                        this.nextDisabled = true;
                        this.prevDisabled = false;
                    }
                });
            },
            edit(){//编辑模块
                if(this.imgList.length===0){
                    this.$message({
                        type:"error",
                        message:"请选择模块内容"
                    });
                    return false;
                }
                let arr=[];
                arr = this.imgList.map(row=>{
                    return row.product_id;
                });
                let param ={
                    id:this.editObject.id,
                    name:this.editObject.name,
                    module_contents:arr.join(','),
                    account_id:this.editObject.account_id
                }
                this.$http(api_edit,param).then(res=>{
                    this.$message({
                        showClose: true,
                        type:"success",
                        message: res.message || res
                    });
                    this.$emit('edit',param);
                    this.modelVisible = false;
                }).catch(code=>{
                    //console.log(code.message || code)
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                })

            },
            previewEditModel(){//预览模块
                if(this.imgList.length===0){
                    this.$message({
                        type:"error",
                        message:"请选择模块内容"
                    });
                    return false;
                }
                let arr = [];
                this.imgList.forEach((val) => {
                    arr.push(val.product_id);
                });
                this.product_ids = arr.join(',');
                this.$http(api_review,{product_ids:this.product_ids}).then(res=>{
                    //this.modelVisible = false;
                    this.$emit("previewEditModel",res.data);
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        type:"error",
                        message:code.message || code
                    })
                });
            }
        },
        watch:{
            modelVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.modelVisible = val;
            }
        },
        props:{
            value:{},
            accountList:{
                type:Array
            },
            id:{}
        },
        components:{
            pageDialog: require("../../../../components/page-dialog.vue").default,
            uiGroups: require("../../../../components/ui-groups.vue").default,
            dragDrop: require('../../../../components/drag-drop').default,
        }
    }
</script>
