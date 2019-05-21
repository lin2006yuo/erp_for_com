<template>
    <page-dialog class="c-test-print"
                 v-model="visible"
                 @open="open"
                 @close="close"
                 title="测试面单水印设置">
        <div>
            <label-item label="水印坐标：" class="mb-xs">
                <span>x:</span>
                <el-input-number v-model="coordinate.x"
                                 :min="0"
                                 :max="100"
                                 size="small width-xs ml-xs"
                ></el-input-number>
                <span class="ml-xs">%</span>
                <span class="ml-sm">y:</span>
                <el-input-number v-model="coordinate.y"
                                 :min="0"
                                 :max="100"
                                 size="small width-xs ml-xs"
                ></el-input-number>
                <span class="ml-xs">%</span>
            </label-item>
            <label-item label="水印内容：" class="mb-xs">
                <el-input v-model="mark" class="width-xs"></el-input>
                <span class="ml-sm red">内容为空时请填’##‘</span>
            </label-item>
            <label-item label="水印字体大小：" class="mb-xs">
                <integer-input v-model="size" @change="change_size" :min="0"></integer-input>
                <!--<el-select v-model="size" @change="change_size">
                    <el-option v-for="item in sizes"
                               :value="item"
                               :label="item"
                               :key="item"
                    ></el-option>
                </el-select>-->
            </label-item>
        </div>
        <div class="review-print" :style="`width:${testWidth};height:${testHeight}`">
            <div v-if="printParams.type === 'html'" v-html="printParams.content"></div>
            <div v-else id="page1">
                <img :src="printParams.img"
                     :width="`${(parseFloat(this.printParams.Width) * (this.dips.y / 25.4)).toFixed(4)}`">
            </div>
            <div id="coordinate"
                 :style="`left:${coordinate.x}%;bottom:${coordinate.y}%;display:${coordinateVisible ? 'none' : 'block'};`">
                {{mark}}
            </div>
        </div>
        <div slot="footer">
            <permission tag="requestButton"
                        :route="apis.url_shipping_coordinate_keep"
                        size="mini"
                        type="primary"
                        @click="save"
                        req-key="api_shipping_coordinate_keep">
                保存
            </permission>
            <el-button type="primary"
                       size="mini"
                       @click.native="sure">打印
            </el-button>
            <el-button size="mini"
                       @click.native="visible = false">取消
            </el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-test-print {
        .review-print {
            margin: 0 auto;
            position: relative;
        }

        #coordinate {
            position: absolute;
            border: 2px solid #000;
            border-radius: 50%;
            font-size: 14pt;
            font-weight: bold;
            padding: 3px;
        }
    }
</style>
<script>
    import {api_shipping_coordinate_keep, url_shipping_coordinate_keep} from "@/api/setLogistics";

    export default {
        permission: {
            url_shipping_coordinate_keep
        },
        data() {
            return {
                visible: this.value,
                coordinate: {
                    x: 0,
                    y: 0
                },
                mark: "##",
                dips: {},
                size: 14,
                coordinateNode: null,
                testWidth: "",
                testHeight: ""
            };
        },
        mounted() {
            this.dips = getDPI();
        },
        methods: {
            open() {
                if (this.printParams.coordinate) {
                    let coordinate = this.printParams.coordinate.split(",");
                    this.coordinate.x = coordinate[0];
                    this.coordinate.y = coordinate[1];
                }
                if (this.printParams.watermark !== "##") {
                    this.mark = this.printParams.watermark;
                }
                this.size = this.printParams.fontSize;
                this.$nextTick(() => {
                    this.get_true_size();
                });
                this.get_test_size();
            },
            save() {
                if(!this.validate()) {
                    this.$reqKey('api_shipping_coordinate_keep', false);
                    return;
                }
                let data = {
                    shipping_id: this.shipping_id,
                    coordinate_data: {
                        default: this.coordinate,
                    },
                    label_font_size: Number(this.size),
                };
                this.$http(api_shipping_coordinate_keep, data).then(res => {
                    this.$message({type: 'success', message: res.message || res});
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey('api_shipping_coordinate_keep', false);
                    }, 200);
                });

            },
            sure() {
                if(!this.validate()) {
                    return;
                }
                let data = {
                    coordinate: `${this.coordinate.x},${this.coordinate.y}`,
                    watermark: this.mark,
                    fontSize: this.size,
                };
                this.$emit("test-print", data);
            },
            validate() {
                this.mark = this.mark.trim();
                this.size = Number(this.size);
                this.coordinate.x = Number(this.coordinate.x);
                this.coordinate.y = Number(this.coordinate.y);
                switch (true) {
                    case isNaN(this.coordinate.x):
                    case isNaN(this.coordinate.y):
                    case this.coordinate.x < 0:
                    case this.coordinate.y < 0:
                    case this.coordinate.x > 100:
                    case this.coordinate.y > 100:
                        this.$message({type: "error", message: "水印坐标有误"});
                        return false;
                    case this.mark === "":
                        this.$message({type: "error", message: `内容为空时请填##`});
                        return false;
                    case isNaN(this.size):
                        this.$message({type: 'error', message: '字号大小设置有误'});
                        return false;
                }
                return true;
            },
            close() {
                this.coordinate = {
                    x: 0,
                    y: 0
                };
                this.mark = "##";
                this.coordinateNode = null;
                this.size = 14;
            },
            get_true_size() {
                //
                let mainContent = this.$el.querySelector(".review-print");
                let pageOne = document.querySelector("#page1");
                pageOne.style.height = 'auto';
                pageOne.style.position = "relative";

                let coordinate = document.querySelector("#coordinate");
                this.coordinateNode = coordinate.cloneNode(true);

                if (this.printParams.type === "url") {
                    let img = pageOne.querySelector("img");
                    img.onload = () => {
                        let imgStyle = getComputedStyle(img);
                        pageOne.style.width = imgStyle.width;
                        pageOne.style.height = imgStyle.height;
                        this.testHeight = imgStyle.height;
                        this.testWidth = imgStyle.width;
                        pageOne.appendChild(this.coordinateNode);
                    };
                } else {
                    let printContent = document.createElement('div');
                    printContent.style.position = 'absolute';
                    let width = parseInt(pageOne.style.width);
                    printContent.style.width = width - 4 + 'pt';
                    printContent.style.height = Number(this.printParams.Height) === 100 ? (width + 4 + 'pt') : (width * 1.5 + 4 + 'pt');
                    printContent.style.left = '0';
                    printContent.style.top = '0';
                    pageOne.appendChild(printContent);
                    printContent.appendChild(this.coordinateNode);
                }
                this.change_size(this.size);
                this.$nextTick(() => {
                    mainContent.removeChild(coordinate);
                });
                this.sync_width();
            },
            get_test_size() {
                //获取容器大小尺寸
                this.testHeight =
                    (parseFloat(this.printParams.Height) * (this.dips.y / 25.4)).toFixed(
                        4
                    ) + "px";
                this.testWidth =
                    (parseFloat(this.printParams.Width) * (this.dips.x / 25.4)).toFixed(4) +
                    "px";
            },
            change_size(val) {
                // 字体大小
                val = val.trim();
                if (this.coordinateNode) {
                    this.coordinateNode.style.fontSize = val + "pt";
                    this.sync_width();
                }
            },
            sync_width() {//同步水印宽度
                if (!this.mark.trim() || this.mark.trim() == "##") {
                    if (this.coordinateNode) {
                        this.coordinateNode.style.display = "none";
                    }
                } else {
                    setTimeout(() => {
                        if (this.coordinateNode) {
                            this.coordinateNode.style.display = "block";
                            this.coordinateNode.innerText = this.mark;
                            let width = this.coordinateNode.getBoundingClientRect().width;
                            this.coordinateNode.style.height = width - 10 + "px";
                            this.coordinateNode.style.lineHeight = width - 10 + "px";
                        }
                    }, 300);
                }
            }
        },
        computed: {
            coordinateVisible() {
                if (this.mark !== undefined) {
                    return (this.mark.trim() === "" || this.mark.trim() === "##");
                }
                return true;
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit("input", val);
            },
            mark(val) {
                if (val !== undefined) {
                    this.sync_width();
                }
            },
            "coordinate.x"(val) {
                if (this.coordinateNode) {
                    this.coordinateNode.style.left = val + "%";
                }
            },
            "coordinate.y"(val) {
                if (this.coordinateNode) {
                    this.coordinateNode.style.bottom = val + "%";
                }
            }
        },
        props: {
            value: {},
            printParams: {},
            shipping_id: {},
        },
        components: {
            pageDialog: require("@/components/page-dialog.vue").default,
            integerInput: require("@/components/integer-input.vue").default,
            labelItem: require("@/components/label-item.vue").default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    };
</script>
