<template>
    <div class="p-sku-set">
        <div class="p-title-bg-color">
            <span>SKU设置</span>
        </div>
        <div class="p-head-border-color">
            <div style="margin-bottom: 10px;">
                <el-button type="primary" size="mini" @click="add_sku">添加SKU</el-button>
            </div>
            <table style="width: 100%" cellspacing="0" cellpadding="0">
                <thead style="background-color:#eff2f7">
                <tr>
                    <th width="35px"></th>
                    <th>SKU</th>
                    <th>捆绑/打包销售</th>
                    <th width="80px">展图</th>
                    <th>参考颜色</th>
                    <th width="160px">颜色</th>
                    <th>参考尺寸</th>
                    <th width="180px">尺寸</th>
                    <th class="required-sign" width="70px">重量(kg)</th>
                    <th width="70px">成本价(￥)</th>
                    <th width="80px">MSRP($)</th>
                    <th width="80px" class="required-sign">销售价($)</th>
                    <th width="60px" class="required-sign">数量</th>
                    <th width="80px" class="required-sign">运费($)</th>
                    <th width="100px" class="required-sign">运送时间</th>
                    <th width="50px">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr style="background: #eff2f7">
                    <td>
                        <el-checkbox v-model="checkAll" @change="select_all"></el-checkbox>
                    </td>
                    <!--本地SKU-->
                    <td></td>

                    <!--捆绑/打包销售-->
                    <td></td>

                    <!--展图-->
                    <td>
                        <!--<el-button type="text" size="mini">随机</el-button>-->
                        <el-button type="text" size="mini" @click="delete_pic">删除</el-button>
                    </td>

                    <!--参考颜色-->
                    <td></td>

                    <!--颜色-->
                    <td>
                        <ui-autocomplete
                            class="inline" style="width: 70%"
                            v-model="color"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入内容"
                            @blur="batch(color,'color')"
                        ></ui-autocomplete>
                    </td>

                    <!--参考尺寸-->
                    <td></td>

                    <!--尺寸-->
                    <td>
                        <el-input class="inline" style="width: 62%;" v-model="size"
                                  @blur="batch(size,'size')"></el-input>
                        <el-button size="mini" @click="change_new_size" type="primary" class="inline">选择</el-button>
                    </td>

                    <!--包装重量-->
                    <td>
                        <el-input class="inline" v-model="weight"
                                  @blur="batch(weight,'weight')"></el-input>
                    </td>

                    <!--成本价（RMB）-->
                    <td></td>

                    <!--MSRP（$）-->
                    <td>
                        <el-input class="inline" v-model="msrp" @blur="batch(msrp,'msrp')"></el-input>
                    </td>

                    <!--销售价($)-->
                    <td>
                        <el-input class="inline" v-model="price" @blur="batch(price,'price')"></el-input>
                    </td>

                    <!--数量-->
                    <td>
                        <el-input class="inline" v-model="inventory" @blur="batch(inventory,'inventory')"></el-input>
                    </td>

                    <!--运费($)-->
                    <td>
                        <el-input class="inline" v-model="shipping" @blur="batch(shipping,'shipping')"></el-input>
                    </td>

                    <!--运送时间-->
                    <td>
                        <el-input class="inline" style="width: 40%" v-model="start"
                                  @blur="batch(start,'start')"></el-input>
                        <el-input class="inline" style="width: 40%" v-model="end"
                                  @blur="batch(end,'end')"></el-input>
                    </td>

                    <!--操作-->
                    <td></td>
                </tr>

                <tr v-for="(row, index) in accountInfo.variant" :key="index">
                    <td>
                        <el-checkbox v-model="row.check"></el-checkbox>
                    </td>
                    <!--本地SKU-->
                    <td>
                        <span>{{row.sku}}</span>
                    </td>

                    <!--捆绑/打包销售-->
                    <td>
                        <span class="operate" @click="bundling_sales(row)">{{row.combine_sku}}</span>
                    </td>

                    <!--展图-->
                    <td>
                        <div @click="change_row_image(row)" style="vertical-align: middle">
                            <img style="vertical-align: middle;cursor: pointer"
                                 :src="get_path(row.thumb,'_100x100.',baseUrl)"
                                 v-if="row.thumb"
                                 height="26px"
                                 width="26px">
                            <p style="display: inline-block;">
                                <i class="el-icon-edit mdfhove"></i>
                            </p>
                        </div>
                    </td>

                    <!--参考颜色-->
                    <td>
                        {{row.refer_color}}
                    </td>

                    <!--颜色-->
                    <td>
                        <ui-autocomplete
                            class="inline" style="width: 70%"
                            v-model="row.color"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入内容"
                            @blur="color_blur(row)"
                            @select="handleSelect(row)"
                        ></ui-autocomplete>
                    </td>

                    <!--参考尺寸-->
                    <td>
                        {{row.refer_size}}
                    </td>

                    <!--尺寸-->
                    <td>
                        <el-input class="inline" style="width: 62%;" v-model="row.size" @blur="size_blur(row)"
                                  @input="color_input(row)"></el-input>
                        <el-button size="mini" @click="change_size(row)" type="primary" class="inline">选择</el-button>
                    </td>

                    <td>
                        <el-input v-model="row.weight"></el-input>
                    </td>

                    <!--成本价（RMB）-->
                    <td>
                        {{isAdd?row.cost_price:row.cost}}
                    </td>

                    <!--MSRP（$）-->
                    <td>
                        <el-input v-model="row.msrp"></el-input>
                    </td>

                    <!--销售价($)-->
                    <td>
                        <el-input v-model="row.price"></el-input>
                    </td>

                    <!--数量-->
                    <td>
                        <el-input v-model="row.inventory"></el-input>
                    </td>

                    <!--运费($)-->
                    <td>
                        <el-input v-model="row.shipping"></el-input>
                    </td>

                    <!--运送时间-->
                    <td>
                        <!--<el-input v-model="row.shipping_time"></el-input>-->
                        <el-input class="inline" style="width: 40%" v-model="row.start"></el-input>
                        <el-input class="inline" style="width: 40%" v-model="row.end"></el-input>
                    </td>

                    <!--操作-->
                    <td>
                        <i class="el-icon-delete" style="cursor: pointer" @click="delete_sku(index)"></i>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="mt-sm red bold-font">
                <div class="mb-xs">注意：1、产品属性值中“颜色”跟“尺寸”，请至少保证其中一项是全部符合平台刊登规则要求的；</div>
            </div>
        </div>
        <!-- 修改展图 -->
        <mdf-img v-model="picVisable"
                 :img-form="imgTemp"
                 :show-tips="false"
                 :goods-id="addGoodsId"
                 @mdfimg-submit="mdfimg_submit"
                 :base-url="baseUrl"></mdf-img>
        <!-- 添加sku -->
        <add-goods v-model="addlistVisable" @add-goods="selected"></add-goods>
        <!-- 捆绑sku -->
        <bundling-sales v-model="bundingDialog"
                        :data="transferData"
                        :is-fixed-price-item="true"
                        channel="3"
                        @submit="submit"></bundling-sales>
        <!-- 尺寸设置 -->
        <wish-size v-model="sizeVisable" @selected="selecte_size" :is-joom="true" :add="true"></wish-size>
    </div>
</template>

<style lang="stylus">
    .p-title-bg-color {
        background: #FAECE7;

    span {
        color: #FFF;
        font-weight: bold;
        padding: 5px 10px;
        font-size: 1.7rem;
        display: inline-block;
        background: #74ba4e;
    }

    }

    .mdfhove:hover {
        color: #20A0FF;
        cursor: pointer;
    }

    .p-head-border-color {
        padding: 20px;
        border-left: 3px solid #74ba4e;

    td, th {
        padding: 3px 5px;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        text-align: center;
    }

    th {
        border-top: 1px solid #ccc;
    }

    tr {
        height: 26px;

    td:first-child, th:first-child {
        border-left: 1px solid #ccc;
        background-color: #eff2f7 !important
    }

    }
    }
</style>
<script>
    import {get_path, random_img} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import {api_joom_color} from '../../../../api/publish-joom-info'
    export default{
        data(){
            return {
                checkAll: true,
                size: '',
                msrp: '',
                price: '',
                inventory: '',
                shipping: '',
                start: '',
                end: '',
                picVisable: false,
                color: '',
                imgTemp: {},
                addlistVisable: false,
                bundingDialog: false,
                transferData: [],
                curRow: {},
                weight: '',
                addGoodsId: '',
                colors: [],
                isNewChange: false,
                sizeVisable: false,
                temp:{}
            }
        },
        created(){

        },
        filters: {},
        mounted(){
            this.get_colors();
        },
        updated(){

        },
        destroy(){

        },
        methods: {
            get_path,
            random_img,
            init(){

            },
            // 捆绑sku
            bundling_sales(row){
                this.curRow = window.clone(row);
                this.bundingDialog = true;
                let combine_sku_arr = window.clone(row.combine_sku);
                combine_sku_arr = combine_sku_arr.split("|");
                this.transferData = [];
                if (combine_sku_arr.length > 0) {
                    combine_sku_arr.forEach(it => {
                        let cur = it.split("*");
                        let obj = {
                            id: row.id,
                            goods_id: row.goods_id,
                            local_sku: cur[0],
                            quantity: cur[1]
                        };
                        this.transferData.push(obj);
                    })
                }
            },
            // 捆绑后数据的处理
            submit(val, val2){
                this.bundingDialog = false;
                let cur = this.accountInfo.variant.find(row => {
                    return row.sku === this.curRow.sku
                });
                if (!!cur) {
                    cur.combine_sku = val;
                    this.transferData = val2;
                }
            },
            // 处理添加sku后的数据
            selected(val, data){
                let Size = "";
                let Color = "";
                let curColor = [];
                let curSize = "";
                if (data.keys && data.keys.length > 0) {
                    Size = data.keys.find(row => row.indexOf("Size") > 0);
                    Color = data.keys.find(row => row.indexOf("Color") > 0);
                }
                if (val.length > 0) {
                    val.forEach(row => {
                        if (!!Color) curColor = row[Color].split("|");
                        if (!!Size) curSize = row[Size];
                        let find = this.accountInfo.variant.find(item => {
                            return item.sku === row.sku
                        });

                        if (!find) {
                            let data = {
                                addGoodsId: row.goods_id,
                                check: true,
                                add_time: new Date().getTime(),
                                code: 0,
                                color: curColor[1] || "",
                                ref_color: curColor[1] || "",
                                combine_sku: `${row.sku}*1`,
                                cost: row.cost_price,
                                cost_price: row.cost_price,
                                enabled: 1,
                                hs_code: "",
                                id: '',
                                inventory: 999,
                                joom_product_id: 1,
                                lock_variant: 1,
                                main_image: "",
                                message: "",
                                msrp: "",
                                original_image_url: "",
                                price: row.market_price,
                                product_id: "",
                                run_time: 0,
                                sell_status: 0,
                                shipping: "0.00",
                                shipping_height: 0,
                                shipping_length: 0,
                                shipping_time: "15-45",
                                start: 15,
                                end: 45,
                                shipping_weight: row.weight,
                                shipping_width: 0,
                                size: curSize,
                                ref_size: curSize,
                                sku: row.sku,
                                sku_id: 0,
                                status: 1,
                                update_msg: "",
                                variant_id: "",
                                weight: row.weight,
                                thumb: row.thumb
                            };
                            this.$emit('add-sku', data);
                        } else {
                            this.$message({type: "warning", message: `${row.sku}已存在`})
                        }
                    })
                }

            },
            add_sku(){
                this.addlistVisable = true;
            },
            // 传出批量处理
            batch(value, field){
                if (value === '') {
                    return;
                }
                this.$emit('category-batch', {value, field});
                this[field]='';
            },
            delete_sku(index){
                this.$emit('delete-sku', index)
            },
            select_all(){
                this.$emit('check-all', this.checkAll);
            },
            // 打开修改图片弹出框
            change_row_image(row){
                this.picVisable = true;
                this.imgTemp = window.clone(row);
                this.imgTemp.path = [{path: this.imgTemp.thumb}];
                this.addGoodsId = row.addGoodsId || this.goodsId;
            },
            // 修改sku展图
            mdfimg_submit(val){
                let curObj = this.accountInfo.variant.find(row => row.id === val.id);
                if (!!curObj) {
                    curObj.thumb = val.path[0].path;
                    //curObj.thumb = val.path;
                }
            },
            // 删除展图
            delete_pic(){
                let filterList = this.accountInfo.variant.filter(row => !!row.check);
                if (filterList.length <= 0) return this.$message({type: "warning", message: "请先选择要操作的数据"});
                this.$confirm('此操作将删除当前SKU列表中已勾选数据的展图,确认进行此操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    filterList.forEach(row => {
                        row.thumb = '';
                    })
                }).catch(code => {
                    this.$message({
                        type: 'info',
                        message: "已取消删除  "
                    })
                });
            },
            // 修改颜色
            color_blur(item){
                if (item.color === "" && item.size === "") {
                    item.error_size = true;
                    item.error_color = true;
                } else if (item.size === "" && item.color !== "") {
                    let bool_color = this.verify_color(item.color, item);
                    if (bool_color) {
                        item.error_size = false;
                        item.error_color = false;
                    } else {
                        item.error_size = true;
                        item.error_color = true
                    }
                } else if (item.size !== "" && item.color === "") {
                    let bool_size = this.verify_size(item.size);
                    if (bool_size) {
                        item.error_size = false;
                        item.error_color = false;
                    } else {
                        item.error_size = true;
                        item.error_color = true
                    }
                } else {
                    let bool_color = this.verify_color(item.color, item);
                    let bool_size = this.verify_size(item.size);
                    bool_size && (item.error_size = false);
                    !bool_size && (item.error_size = true);
                    bool_color && (item.error_color = false);
                    !bool_color && (item.error_color = true);
                }
            },
            // 验证尺寸
            verify_size(str){
                let custom_format = /^[a-zA-Z0-9][\ ]*([a-zA-Z0-9.\-&\'\"\(\)\[\]\/][\ ]*)*$/gi;
                if (str.match(custom_format) && str.length <= 50)return true;
                return false
            },
            // 验证颜色
            verify_color(color, item){
                let find = '';
                if (color.includes('&')) {
                    let newColorList = color.split('&');
                    let findList = [];
                    newColorList.forEach(res => {
                        let obj = this.colors.find(row => {
                            return row.value.toLowerCase().trim().includes(res.toLowerCase().trim());
                        })
                        findList.push(!!obj);
                    });
                    if (!color.includes(' & ')) item.color = newColorList.join(' & ');
                    find = !findList.find(row => !row);
                } else {
                    find = this.colors.find((row, index) => {
                        return row.value.toLowerCase().trim() === color.toLowerCase().trim();
                    })
                }
                return !!find
            },
            get_colors(){
                let storage = window.sessionStorage;
                if (storage.publish_wish_colors) {
                    let a = window.sessionStorage.getItem("publish_joom_colors");
                    this.colors = JSON.parse(a)
                } else {
                    this.$http(api_joom_color).then(res => {
                        this.colors = res
                        storage.setItem("publish_joom_colors", JSON.stringify(this.colors))
                    }).catch(code => {
                        console.log(code)
                    })
                }
            },
            handleSelect(item){
                setTimeout(() => {
                    this.color_blur(item)
                }, 300)
            },
            querySearch(queryString, cb){
                let colors = this.colors;
                let results = queryString ? colors.filter(this.createFilter(queryString)) : colors;
                cb(results)
            },
            createFilter(queryString){
                return (item) => {
                    return (item.value.indexOf((queryString.toLowerCase())) === 0)
                }
            },
            change_size(row){
                this.isNewChange = false;
                this.temp = row;
                this.sizeVisable = true;
            },
            selecte_size(val){
                if (this.isNewChange) {
                    this.size = val;
                    this.batch( this.size,'size');
                } else {
                    this.temp.size = val;
                }
            },
            size_blur(item){
                this.color_blur(item);
            },
            change_new_size(){
                this.isNewChange = true;
                this.sizeVisable = true;
            },
        },
        computed: {},
        watch: {},
        props: {
            accountInfo: {},
            baseUrl: {},
            goodsId: {},
            isAdd: {}
        },
        components: {
            mdfImg: require('../../ebay/kandeng-list/add-edit-listing/mdf-img.vue').default,
            addGoods: require('../../../../api-components/add-goods.vue').default,
            bundlingSales: require('../../ebay/kandeng-list/add-edit-listing/bundling-sales.vue').default,
            uiAutocomplete: require("../../../../components/ui-autocomplete.vue").default,
            wishSize: require("../../wish/info/wish-size.vue").default,
        }
    }
</script>

