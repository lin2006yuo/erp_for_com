<template>
    <div>
        <page-dialog class="p-template-set" :title="isEdit?'编辑':'添加'" v-model="visible" size="large"
                     :close-on-click-modal="false">
            <el-form class="border" label-width="115px">
                <div style="border-bottom: 1px solid #aaa">
                    <el-form-item class="inline" style="width: 23%" label="平台站点：" required>
                        <el-select class="inline width-sm" v-model="siteValue">
                            <el-option v-for="item in site" :label="item.label" :value="item.value"
                                       :key="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="inline" style="width: 38%" label="上传刊登模板：" required>
                        <el-button type="primary" size="mini" @click="update_template" :disabled="!siteValue">点击上传
                        </el-button>
                        <span>只能上传从平台导出的刊登Excel文件</span>
                    </el-form-item>
                    <el-form-item class="inline no-right-border" style="width: 38%" label="产品模板：" required>
                        <el-select class="inline width-sm" v-model="first_category_id" disabled>
                            <el-option v-for="item in category" :label="item.category_name" :value="item.id"
                                       :key="item.id"></el-option>
                        </el-select>
                        <el-select class="inline width-sm" v-model="second_category_id" disabled>
                            <el-option v-for="item in second_category" :label="item.category_name" :value="item.id"
                                       :key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item class="no-right-border" label="已有固定属性：">
                    <div style="min-height: 50px;" class="border">
                        <el-tag style="margin: 3px;" type="info" v-for="(item, index) in fix" :key="index">
                            {{item.name}}
                        </el-tag>
                    </div>
                </el-form-item>
            </el-form>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="分类属性" name="1">
                    <div v-if="activeName==='1'">
                        <p>更多平台分类属性设置</p>
                        <el-table :data="common" border class="scroll-bar common">
                            <el-table-column label="属性标题名称" width="200">
                                <template slot-scope="scope">
                                    <ui-tip :content="scope.row.name"></ui-tip>
                                </template>
                            </el-table-column>
                            <el-table-column label="属性设置">
                                <template slot-scope="scope">
                                    <el-checkbox :checked="!!scope.row.enable" v-model="scope.row.enable">是否启用
                                    </el-checkbox>
                                    <el-checkbox :checked="!!scope.row.is_requried" v-model="scope.row.is_requried">
                                        是否必填
                                    </el-checkbox>
                                    <el-checkbox :checked="!!scope.row.is_hand" v-model="scope.row.is_hand">是否指定属性值
                                    </el-checkbox>
                                    <el-checkbox @change="is_sku_property(scope.$index, $event)"
                                                 :checked="!!scope.row.is_sku" v-model="scope.row.is_sku">是否为SKU属性
                                    </el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="指定属性值">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.values" :disabled="!scope.row.is_hand"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                        <p>绑定 Listing SKU属性（Variation Theme）</p>
                        <el-table :data="variant" border class="scroll-bar common">
                            <el-table-column label="Variation Theme 名称">
                                <template slot-scope="scope">
                                    <ui-tip :content="scope.row.variant"></ui-tip>
                                </template>
                            </el-table-column>
                            <el-table-column label="对应平台属性" align="left">
                                <template slot-scope="scope">
                                    <div>
                                        <div class="inline" style="width: 90%"
                                             v-for="(item, index) in scope.row.selected" :key="index">
                                            <el-select class="inline" style="width: 90%" v-model="item.xsd_id"
                                                       @change="select_attr(item, $event)">
                                                <el-option v-for="(item, i) in skuCategory" :key="i" :value="item.id"
                                                           :label="item.label"></el-option>
                                            </el-select>
                                            <el-button type="danger" size="mini" class="el-icon-delete ml-sm"
                                                       @click="reduce(scope.row.selected,index)"></el-button>
                                        </div>
                                        <el-button class="fr" style="margin-right: 10px;" type="primary" size="mini"
                                                   @click="if_null_add(scope.row)">添加
                                        </el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="基本属性" name="2">
                    <div v-if="activeName==='2'">
                        <p>更多平台基本属性设置</p>
                        <el-table :data="base" border class="scroll-bar base">
                            <el-table-column label="属性标题名称" width="200">
                                <template slot-scope="scope">
                                    <ui-tip :content="scope.row.name"></ui-tip>
                                </template>
                            </el-table-column>
                            <el-table-column label="属性设置">
                                <template slot-scope="scope">
                                    <el-checkbox :checked="!!scope.row.enable" v-model="scope.row.enable">是否启用
                                    </el-checkbox>
                                    <el-checkbox :checked="!!scope.row.is_requried" v-model="scope.row.is_requried">
                                        是否必填
                                    </el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="指定属性值">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.values" :disabled="!scope.row.is_hand"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="update">确认</el-button>
                <el-button size="mini" @click="visible=false">取消</el-button>
            </div>
        </page-dialog>
        <page-dialog class="p-update-excel" title="上传刊登模板" v-model="updateTemplateVisible" size="small"
                     :show-close-icon="false">
            <el-form label-width="100px">
                <el-form-item label="产品模板：" required>
                    <el-select class="inline width-sm" v-model="first_category_id">
                        <el-option v-for="item in category" :label="item.category_name" :value="item.id"
                                   :key="item.key"></el-option>
                    </el-select>
                    <el-select class="inline width-sm" v-model="second_category_id">
                        <el-option v-for="item in second_category" :label="item.category_name" :value="item.id"
                                   :key="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传刊登模板：" required>
                    <div class="file-btn">
                        请选择要导入的Excel文件
                        <input type="file" ref="file" multiple @change="file_change">
                    </div>
                    <ul class="files">
                        <li v-if="files.length > 0" v-for="(file, index) in files" :key='index'>
                            <div>
                                <span>{{file.file.name}}</span>
                                <el-tag
                                    :class="{'error-color':file.errors.length, 'success-color':!file.errors.length && file.result}">
                                    {{file.result ? file.result : '未上传'}}
                                </el-tag>
                                <i v-if="!file.result" class="el-icon-circle-cross" @click="remove(file)"></i>
                            </div>
                            <p v-if="file.errors.length > 0" class="error">
                                {{file.errors}}
                            </p>
                        </li>
                        <li v-if="files.length <= 0" class="prompt-message">
                            请选择要导入的文件！
                        </li>
                    </ul>


                </el-form-item>
            </el-form>
            <p v-if="fullscreenLoading" style="text-align: center">
                正在上传中，请勿关闭...
            </p>
            <div style="float: right">
                <el-button type="primary" size="mini" @click="upload" :disabled="files.length<=0 || fullscreenLoading">
                    确认上传
                </el-button>
                <el-button size="mini" @click="updateTemplateVisible = false" :disabled="fullscreenLoading">取消
                </el-button>
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus" type="text/stylus">
    .p-template-set {
        .border {
            border: 1px solid #aaa;
        }
        .el-form-item {
            margin-bottom: 0;
            background-color: #eff2f7;
            .el-form-item__content {
                padding: 5px;
                background-color: #fff;
                border-left 1px solid #aaa;
                border-right 1px solid #aaa;
            }
            .el-form-item__label {
                padding: 5px;
            }
        }
        .no-right-border {
            .el-form-item__content {
                padding: 5px;
                background-color: #fff;
                border-right 0;
            }
        }
        .common {
            .el-table__body-wrapper {
                max-height 136px;
            }
        }
        .base {
            .el-table__body-wrapper {
                max-height 351px;
            }
        }
        .fr {
            float right
        }
    }

    .p-update-excel {
        li {
            padding: 5px;
            margin: 5px;
            .error {
                margin-top: 5px;
                padding: 10px;
            }
        }
        .file-btn {
            display: inline-block;
            cursor: pointer;
            height: 26px;
            width: 150px;
            text-align: center;
            line-height: 26px;
            background: #008BCE;
            border-radius: 4px;
            position: relative;
            color: #fff;
            input {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                width: 100%;
                opacity: 0;
            }
        }
    }
</style>

<script>
    import {
        api_amazon_xsd_attribute,
        api_amazon_get_category,
        api_update_excel,
        api_save_attr
    } from './../../../../api/amazon-publish-template-set';
    export default{
        data(){
            return {
                visible: false,
                updateTemplateVisible: false,
                activeName: '1',
                siteValue: '',
                first_category_id: '',
                second_category_id: '',
                common: [],
                base: [],
                fix: [],
                variant: [],
                importExcelShow: false,
                skuCategory: [],
                apiPort: api_amazon_xsd_attribute,
                //excel 上传
                errors: [],
                files: [],
                file: `downfile`,
                fullscreenLoading: false
            }
        },
        created(){

        },
        filters: {},
        mounted(){
            //this.get_category();
        },
        updated(){

        },
        destroy(){

        },
        methods: {
            init(){
                let data = {
                    site: this.siteValue,
                    first_category_id: this.first_category_id,
                    second_category_id: this.second_category_id
                };
                this.$http(api_amazon_xsd_attribute, data).then(res => {
                    this.common = res.common;
                    this.base = res.base;
                    this.variant = res.variant;
                    this.fix = res.fix;
                    //this.category = res.category;
                    this.skuCategory = this.common.filter(row => {
                        return row.is_sku === true || row.is_sku === 1;
                    });
                    this.skuCategory = this.skuCategory.map(row => {
                        return {
                            label: row.name,
                            id: row.id
                        }
                    });
                    console.log(this.skuCategory);
                })
            },
            update(){
                let data = {
                    attributes: {
                        common: this.common,
                        base: this.base,
                        variant: this.variant
                    },
                    site: this.siteValue,
                    first_category_id: this.first_category_id,
                    second_category_id: this.second_category_id
                };
                this.$http(api_save_attr, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.visible = false;
                    this.$emit('update', {
                        site: this.siteValue,
                        first_category_id: this.first_category_id,
                        second_category_id: this.second_category_id
                    })
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: '接口出错'
                    })
                });
            },
            handleClick(tab, event){

            },
            update_template(){
                this.updateTemplateVisible = true;
            },
            is_sku_property(index, val){
                console.log(index, this.common[index]);
                let item = this.common[index];
                let bl = item.is_sku;
                let id = item.id;
                if (bl) {
                    console.log(id, this.skuCategory);
                    let find = this.skuCategory.findIndex(row => {
                        return id === row.id;
                    });
                    console.log("test", find);
                    if (find === -1) {
                        this.skuCategory.push({label: item.name, id: item.id})
                    }
                } else {
                    let find = this.skuCategory.findIndex(row => {
                        return id === row.id;
                    });
                    if (find !== -1) {
                        this.skuCategory.splice(find, 1);
                    }
                }
                console.log('this.skuCategory', this.skuCategory);
            },
            if_null_add(row){
                row.selected.push({xsd_id: '', xsd_name: ''});
                console.log('row.selected', row.selected)

            },
            reduce(row, index){
                row.splice(index, 1);
            },
            update_model(){
                this.importExcelShow = true;
            },
            select_attr(item, val){
                console.log(item, val);
                let find = this.skuCategory.find(item => {
                    return item.id === val;
                });
                item.xsd_name = find.label
            },


            // excel 上传方法
            remove(file){
                const index = this.files.indexOf(file);
                this.files.splice(index, 1);
                console.log(this.$refs.file.files)
            },
            upload() {
                this.fullscreenLoading = true;
                this.files.forEach(({file}) => {
                    let data = {
                        extension: file.name.substring(file.name.lastIndexOf('.') + 1),
                        content: '',
                        //name: file.name
                        first_category_id: this.first_category_id,
                        second_category_id: this.second_category_id,
                        site: this.siteValue
                    };
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        data.content = e.target.result;
                        this.submit(file, data);
                    };
                });
            },
            submit(file, data) {
                const index = this.files.indexOfFun(f => f.file === file);
                this.$http(api_update_excel, data).then(res => {
                    this.fullscreenLoading = false;
                    this.updateTemplateVisible = false;
                    // 上传成功请求数据
                    this.init();

                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.files[index].result = res.message;
                }).catch(code => {
                    this.fullscreenLoading = false;
                    this.files[index].result = "上传有失败, 请重新上传！";
                    this.files[index].errors = code.message;
                });
                //this.init();
            },
            file_change() {
                const files = this.$refs.file.files;
                Object.keys(files).forEach(key => {
                    let file = files[key];
                    console.log(file);
                    if ((/\.(?!(xlsx$|xls$))/.test(file.name))) {
                        this.$message({
                            type: "error",
                            message: "文件类型错误，请选择Excel文件上传！"
                        });
                    } else {
                        this.files.push({file: file, result: '', errors: []});
                    }
                });
                this.$refs.file.value = '';
            },
        },
        computed: {
            second_category(){
                this.second_category_id = '';
                if (!!this.first_category_id) {
                    let find = this.category && this.category.find(item => {
                            return item.id === this.first_category_id
                        });
                    if (!!find) {
                        return find.children;
                    }
                }
            },
            is_enable_update(){

            }
        },
        watch: {
            value(val){
                this.visible = val;
                if (val) {
                    if (this.isEdit) {
                        console.log(this.edit);
                        this.siteValue = this.edit.sites;
                        this.first_category_id = this.edit.f_id;
                        this.second_category_id = this.edit.id;
                        console.log('111');
                        this.init();
                    } else {
                        this.siteValue = '';
                        this.first_category_id = '';
                        this.second_category_id = '';
                        this.common = [];
                        this.base = [];
                        this.variant = [];
                        this.fix = [];
                        this.files = [];
                    }
                }
            },
            visible(val){
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            site: {
                required: true,
                type: Array
            },
            category: {
                required: true,
                type: Array
            },
            edit: {},
            isEdit: {}
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default,
            uiTip: require("../../../../components/ui-tip.vue").default
        }
    }
</script>

