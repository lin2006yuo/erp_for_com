<template>
    <div class="p-publish-img">
        <page-dialog v-model="show" title="图片" @change="change_dialog" :close-on-click-modal="false">
            <el-row class="mb-sm">
                <el-radio-group @change="change_type" v-model="localType" fill="#20a0ff" text-color="#ffffff">
                    <el-radio-button label="local" type="primary">本地图库</el-radio-button>
                    <el-radio-button label="customer" type="primary">自定义图库</el-radio-button>
                </el-radio-group>
                <el-button type="primary" @click="all" size="mini">{{get_all?'全选':'反选'}}</el-button>
                <div class="fr" v-if="localType==='customer'">
                    <input type="file" ref="input" hidden @change="handleChange" :multiple="true">
                    <el-button type="primary" size="mini" @click="$refs.input.click();">添加本地图片</el-button>
                    <el-popover v-model="webUrl" placement="right" trigger="click">
                        <div>
                            <label>图片地址：</label>
                            <el-input v-model="imgUrl"
                                      type="textarea"
                                      :autosize="{ minRows: 2}"
                                      placeholder="多个地址以 | 隔开" class="inline" style='width:300px;'></el-input>
                            <el-button type="primary" size="mini" @click="add_url">确定</el-button>
                            <el-button size="mini" @click.native="webUrl=false">取消</el-button>
                        </div>
                        <span slot="reference">
                        <el-button type="primary" size="mini">添加网络图片</el-button>
                    </span>
                    </el-popover>
                </div>
            </el-row>
            <div class="content" v-loading="loading"
                 element-loading-text="玩命加载中...">
                <dragDrop tag="ul" v-if="list.length>0" v-model="list">
                    <li v-for="(item,item_i) in list" :key="item_i" @click="li_click(item)">
                        <!--<span class="sort-number" v-if="item.sort&&item.sort!==0">{{item.sort}}</span>-->
                        <el-checkbox :value="item.checked" class="checkbox" @input="change_check(item)"></el-checkbox>
                        <img :src="item.path" alt="图片">
                    </li>
                </dragDrop>
                <div v-else style="height: 100px;width: 100%; text-align: center">
                    <span style="margin-top: 20px;display: block">暂无数据</span>
                </div>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="submit" size="mini">确认</el-button>
                <el-button @click.native="show=false" size="mini">取 消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .p-publish-img {
        .pagination {
            height: 26px;
        }
        .content {
            min-height: 120px;
            width: 100%;
            display: flex;
            flex-direction: column;
            border: 1px silver solid;
            > ul {
                padding: 8px;
                flex: 1;
                > li {
                    width: 20%;
                    cursor: pointer;
                    padding: 3px;
                    height: 100px;
                    display: inline-block;
                    position: relative;
                    top: 0;
                    box-sizing: border-box;
                    left: 0;
                    .sort-number {
                        display: inline-block;
                        height: 16px;
                        width: 16px;
                        line-height: 16px;
                        background: #FF954F;
                        position: absolute;
                        left: 5px;
                        top: 5px;
                        color: white;
                        border: 1px solid #A66500;
                        text-align: center;
                    }
                    .checkbox {
                        position: absolute;
                        right: 5px;
                        top: 5px;
                    }
                    img {
                        border: 1px solid #BFA430;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
</style>
<script>
    import {api_ali_listing_img, api_ali_listing_img_self_up, api_ali_listing_img_self} from "../../api/publish-smt"

    export default {
        data() {
            return {
                page: 1,
                pageSize: 20,
                total: 0,
                loading: false,
                webUrl: false,
                imgUrl: '',
                show: false,
                localType: 'local',
                selected: [],
                list: [],
                sort_id: 0,
            }
        },
        created() {
        },
        mounted() {
        },
        computed: {
            get_all() {
                let find = this.list.find(row => {
                    return !row.checked
                })
                return !!find;
            },
        },
        methods: {
            all() {
                if (this.get_all) {
                    this.list.forEach(row => {
                        if (row.sort === 0) {
                            this.li_click(row);
                        }
                    })
                } else {
                    this.list.forEach(row => {
                        row.sort = 0;
                        row.checked = false;
                    });
                    this.sort_id = 0;
                }
            },
            init() {
                let data = {
                    page: this.page,
                    pageSize: this.pageSize,
                    channel_id: this.channel,
                    account_id: this.account || ''
                };
                this.loading = true;
                this.sort_id = 0;
                (this.id !== 0) && (data.goods_id = this.id);
                this.spu && (data.channel_sku = this.spu);
                this.$http(api_ali_listing_img, data).then(res => {
                    this.total = res.count
                    this.list = res.data.map(row => {
                        row.checked = false;
                        row.sort = 0;
                        return row;
                    });
                    this.loading = false;
                }).catch(code => {
                    this.list = [];
                    this.loading = false;
                    this.$message({type: "error", message: code.message || code})
                })
            },
            self_init() {
                let data = {
                    page: this.page,
                    pageSize: this.pageSize,
                    channel_id: this.channel,
                    account_id: this.account || ''
                };
                this.loading = true;
                this.sort_id = 0;
                (this.id !== 0) && (data.goods_id = this.id);
                this.spu && (data.channel_sku = this.spu);
                this.$http(api_ali_listing_img_self, data).then(res => {
                    this.total = res.count;
                    this.list = res.data.map(row => {
                        row.checked = false;
                        row.sort = 0;
                        return row;
                    });
                    this.loading = false;
                }).catch(code => {
                    this.list = [];
                    this.loading = false;
                    this.$message({type: "error", message: code.message || code})
                })
            },
            submit() {
                let data = this.list.filter(row => row.checked);
//                data=data.sort((a,b)=>{
//                    return a.sort-b.sort
//                });
                if (data.length === 0) {
                    this.$message({type: "warning", message: '请选择图片'});
                    return;
                }
                if (this.multiple) {
                    this.show = false;
                    this.$emit('submit', data);
                } else {
                    if (data.length > 1) {
                        this.$message({type: "warning", message: '请选择单张图片'});
                    } else {
                        this.show = false;
                        this.$emit('submit', data);
                    }
                }
            },
            li_click(item) {
                item.checked = !item.checked;
                if (item.checked) {
                    item.sort = ++this.sort_id;
                } else {
                    let sort = item.sort;
                    item.sort = 0;
                    this.list.forEach(row => {
                        row.sort > sort && (--row.sort);
                    });
                    --this.sort_id;
                }
            },
            change_check(item) {
                this.li_click(item)
            },
            change_type(val) {
                this.localType = val;
                if (val === 'local') {
                    this.init();
                } else {
                    this.self_init()
                }

            },
            handleChange(ev) {
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                let images = [];
                let timer = null;
                fileArr.forEach((file, index) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        let imgs = e.target.result;
                        let parm = {
                            name: file.name,
                            image: imgs,
                        };
                        images.push(parm);
                    }
                });
                timer = setInterval(() => {
                    if (fileArr.length === images.length) {
                        this.callback(images);
                        clearInterval(timer)
                    }
                }, 100)


            },
            callback(imgs) {
                this.$http(api_ali_listing_img_self_up, {
                    goods_id: this.id,
                    images: imgs,
                    channel_id: this.channel,
                    channel_sku: this.spu || '',
                    account_id: this.account || ''
                }).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    this.self_init();
                    this.imgUrl = '';
                    this.webUrl = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })

            },
            add_url() {
                if (!this.imgUrl) {
                    this.$message({type: 'info', message: "请输入网络图片地址"})
                }
                let url = this.imgUrl.split('|');
                let urlArr = url.map(row => {
                    return {
                        url: row
                    }
                });
                this.callback(urlArr)
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.init();
            },
            change_dialog(val) {
                if (val) {
                    this.init();
                    this.sort_id = 0;
                } else {
                    this.page = 1;
                    this.sort_id = 0;
                    this.pageSize = 20;
                    this.total = 0;
                    this.loading = false;
                    this.webUrl = false;
                    this.imgUrl = '';
                    this.show = false;
                    this.localType = 'local';
                    this.selected = [];
                    this.list = [];
                }
            }
        },
        filters: {},
        watch: {
            value(val) {
                this.show = val;
            },
            show(val) {
                this.$emit('input', val)
            }
        },
        props: {
            value: {},
            multiple: {
                require: true,
                default: true,
            },
            id: {
                require: true,
                default: 0
            },
            channel: {},
            account: {},
            spu: {
                default: ""
            }
        },
        components: {
            pageDialog: require('../../components/page-dialog.vue').default,
            dragDrop: require("../../components/drag-drop")
        }
    }
</script>