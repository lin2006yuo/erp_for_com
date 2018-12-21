<template>
    <page class="print-p-add-edit">
        <page-dialog v-model="show" :title="titless" size="full"
                     :close-on-click-modal="false" @open="open">
            <el-row>
                <label>模板名称：</label>
                <el-input v-model="templateData.temp_name" class="inline width-sm"></el-input>
                <label>模板类型：</label>
                <el-select v-model="templateData.temp_type" placeholder="请选择" class="mr-sm inline width-sm"
                           @change="get_list(true)">
                    <el-option
                            v-for="item in templateType"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <label> 纸张大小（宽×高）：</label>
                <el-input v-model="templateData.size.width" class="inline" style="width: 50px" :limit="1"></el-input>
                <span>×</span>
                <el-input v-model="templateData.size.height" class="inline" style="width: 50px"></el-input>
                <label-item label="仓库：" class="inline ml-sm">
                    <el-select v-model="templateData.warehouse_id" clearable class="s-width-default">
                        <el-option v-for="item in warehouseList"
                                   :value="item.value"
                                   :label="item.label"
                                   :key="item.value"></el-option>
                    </el-select>
                </label-item>
                <el-checkbox v-model="templateData.is_default">设为默认模板</el-checkbox>
                <label-item label="关联模板：" v-if="templateData.temp_type !== 3">
                    <el-select v-model="templateData.sub_temp" multiple placeholder="请选择关联模板" class="inline">
                        <el-option
                                v-for="item in subList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label-item>
            </el-row>
            <el-row class="mb-sm mt-sm ml-sm">
                <el-button class="inline" size="mini" :disabled="templateData.temp_type===''" type="primary"
                           v-for="item in button" :key="item.label" @click="button_click(item)">{{item.label}}
                </el-button>
                <el-popover
                        v-model="barShow"
                        placement="bottom"
                        trigger="click">
                    <div style="width:300px;text-align: center;">
                        <el-row>
                            <span>条形码类型:</span>
                            <el-select v-model="barSelect" placeholder="请选择" class="inline" style="width: 100px"
                                       filterable>
                                <el-option
                                        v-for="item in leftList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.field">
                                </el-option>
                            </el-select>
                            <el-checkbox v-model="barCheck" class="inline">显示文字</el-checkbox>
                            <el-button size="mini" @click.native="barsure" type="primary" class="inline">确定</el-button>
                        </el-row>
                    </div>
                    <el-button slot="reference" class="inline" size="mini" :disabled="templateData.temp_type===''"
                               type="primary">条形码
                    </el-button>
                </el-popover>
                <el-popover
                        v-model="qrcodeShow"
                        placement="bottom"
                        trigger="click">
                    <div style="width:400px;text-align: center;">
                        <el-row>
                            <span>二维码类型:</span>
                            <el-select v-model="qrType" placeholder="请选择添加的类型" class="inline" style="width: 100px"
                                       @change="change_qr_type" filterable>
                                <el-option
                                        v-for="item in qrsel"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <span>大小(mm)：</span>
                            <ui-limit-number v-model="qrsize" class="inline" style="width:80px;"
                                             :limit="1"></ui-limit-number>
                            <el-button size="mini" @click.native="qrcode_sure" type="primary" class="inline">确定
                            </el-button>
                            <el-row class="mt-xs">
                                <drag-drop v-model="selects" tag="div">
                                    <div v-for="sel in selects " :key="sel.value" class="mb-xs">
                                        <el-checkbox v-model="sel.checked" title="选中名称将加入二维码"
                                                     v-if="sel.value!==-2&&sel.value!==-1&&sel.value!==-3"></el-checkbox>
                                        <span>{{sel.label}}:</span>
                                        <el-input v-model="sel.input" placeholder="请选择"
                                                  class="inline" style="width: 100px"
                                                  v-if="sel.value===-1"></el-input>
                                        <span v-if="sel.value===-2||sel.value===-3">{{sel.input}}</span>
                                        <span v-if="sel.value!==-2&&sel.value!==-1&&sel.value!==-3">{{sel.value}}</span>
                                        <i class="el-icon-delete" @click="qr_delete(sel)"></i>
                                    </div>
                                </drag-drop>
                            </el-row>

                        </el-row>
                    </div>
                    <el-button slot="reference" class="inline" size="mini" :disabled="templateData.temp_type===''"
                               type="primary">二维码
                    </el-button>
                </el-popover>
                <label>字体：</label>
                <el-select v-model="fontStyle" placeholder="请选择" style="width: 70px" @change="change_font"
                           class="inline">
                    <el-option
                            v-for="item in font"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <label>大小：</label>
                <el-select v-model="fontSize" placeholder="请选择" style="width: 60px" @change="change_size"
                           class="inline">
                    <el-option
                            v-for="item in size"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <label>粗细：</label>
                <el-select v-model="fontWeight" placeholder="请选择" style="width: 70px" @change="change_weight"
                           class="inline">
                    <el-option
                            v-for="item in weight"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <span>|</span>
                <div v-for="item in style" :class="[item.class,'inline',item.check?'dasheds':'','ml-xs']"
                     @click="style_click(item)"></div>
                <div v-for="item in algins" :class="[item.class,'inline',item.check?'dasheds':'','ml-xs']"
                     @click="style_click(item)"></div>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="3">
                    <ul class="left">
                        <el-popover
                                v-if="templateData.temp_type!==''"
                                v-model="combinationShow"
                                placement="right"
                                ref="combination"
                                trigger="click">
                            <div style="width:400px;text-align: center;">
                                <el-row>
                                    <span>组合选项:</span>
                                    <el-select v-model="combinationType"
                                               placeholder="请选择添加的类型"
                                               class="inline"
                                               filterable
                                               style="width: 100px"
                                               @change="change_combination_type">
                                        <el-option
                                                v-for="item in qrsel"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-button size="mini" @click.native="combination_sure" type="primary"
                                               class="inline">确定
                                    </el-button>
                                    <el-row class="mt-xs">
                                        <drag-drop v-model="combinationSelects" tag="div">
                                            <div v-for="sel in combinationSelects " :key="sel.value" class="mb-xs">
                                                <el-checkbox v-model="sel.checked" title="选中名称将加入标签"
                                                             v-if="sel.value!==-2&&sel.value!==-1&&sel.value!==-3"></el-checkbox>
                                                <span>{{sel.label}}:</span>
                                                <el-input v-model="sel.input" placeholder="请选择"
                                                          class="inline" style="width: 100px"
                                                          v-if="sel.value===-1"></el-input>
                                                <span v-if="sel.value===-2||sel.value===-3">{{sel.input}}</span>
                                                <span v-if="sel.value!==-2&&sel.value!==-1&&sel.value!==-3">{{sel.value}}</span>
                                                <i class="el-icon-delete" @click="combination_delete(sel)"></i>
                                            </div>
                                        </drag-drop>
                                    </el-row>

                                </el-row>
                            </div>
                        </el-popover>
                        <li class="mb-xs" v-popover:combination v-if="templateData.temp_type!==''">组合标签</li>
                        <hr v-if="templateData.temp_type!==''"/>
                        <li v-for="item in leftList" @click="left_tag_click(item)" v-drag="{func:ndrag,params:item}">
                            {{item.name}}
                        </li>
                        <!--<li v-for="item in leftList"   @click="left_tag_click(item)"  >{{item.name}}</li>-->
                    </ul>
                </el-col>
                <el-col :span="21">
                    <div class="canvas">
                        <div class="target" :style="get_target_style" ref="target" data-target="target">
                            <div v-for="(item,i) in templateData.temp_data" :key="item.id" :data-key="`${item.datakey}`"
                                 v-change="get_style(item)" :class="[item.light?'highlight':'nonelight','single']"
                                 @click="tag_click(item,i)" tabindex="0" @keydown.delete="keydown(item,i)">
                                <!--单个标签-->  <!--组合标签-->
                                <span v-if="item.type===1">{{item.label}}</span>
                                <!--文本-->
                                <!--<span v-if="item.type===2&&item.value===1"  >-->
                                <!--<textarea   rows="1" style="border-radius: 4px;outline: none;width: 88%;height: 88%"></textarea>-->
                                <!--</span>-->
                                <!--图片-->
                                <!--表格-->
                                <!--水平线-->
                                <div v-if="item.type===2&&item.value===4" class="bold-hr"></div>
                                <!--垂直线-->
                                <div v-if="item.type===2&&item.value===5" class="vertical"></div>
                                <!--虚线-->
                                <div v-if="item.type===2&&item.value===6" class="hr"></div>
                                <!--条形码-->
                                <bar-code :value="item.label" :showFont="!!item.showFont"
                                          v-if="item.type===2&&item.value===7"></bar-code>
                                <!--二维码-->
                                <qrcode value="qrcode" type="img" :size="item.size"
                                        v-if="item.type===2&&item.value===8"></qrcode>
                            </div>
                            <!--<div class="rightClick" v-Clickoutside="close" :style="deletes">-->
                            <!--<span>删除</span>-->
                            <!--</div>-->
                        </div>

                    </div>
                </el-col>
            </el-row>
            <div slot="footer">
                <!--<el-button type="primary" size="mini" @click.native="print">打印</el-button>-->
                <request-button req-key='addEditSave' @click="save" :mintime="300">确定</request-button>
                <el-button size="mini" @click.native="show=false">关闭</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .print-p-add-edit {
        .bg-purple {

        }
        .rightClick {
            z-index: 9999;
            position: fixed;
            top: 0;
            left: 0;
            width: 60px;
            height: 26px;
            border: 1px solid #96a4d5;
            background-color: #9fbbd5;
            display: none;
        }
        .bold-hr {
            border-top: 1px solid #cccccc;
            border-bottom: 1px solid #cccccc;
            height: 0;
            width: 100%;
        }
        .hr {
            border-top: 1px dashed #cccccc;
            height: 0;
            width: 100%;
        }
        .vertical {
            border-left: 1px solid #cccccc;
            border-right: 1px solid #cccccc;
            width: 0;
            height: 100%;
        }
        .menu {
            position: absolute;
            border: 1px solid black;
        }
        .highlight {
            color: red;
            border: 1px dashed red;
        }
        .nonelight {
            border: 1px solid transparent;
        }
        .left {
            padding: 5px;
            overflow-y: auto;
            border: 1px solid #d3dce6;
            border-radius: 4px;
            height: 578px;
            > li {
                text-align: center;
                padding: 3px 6px;
                line-height: 20px;
                border: 1px solid #99a9bf;
                border-radius: 3px;
                margin-bottom: 3px;
                cursor: pointer;
                &:hover {
                    background: #20A0FF;
                    color: white;
                }
            }
        }
        .canvas {
            position: relative;
            min-height: 590px;
            overflow-y: auto;
            border: 1px solid #d3dce6;
            min-width: 100%;
            border-radius: 4px;
            box-sizing: border-box;
            .target {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto;
                /*transform: translate(-50%,-50%);*/
                border: 1px solid #20A0FF;
                .single {
                    box-sizing: border-box;
                    > span {
                        font-size: inherit;
                        white-space: nowrap;
                    }
                }
                img{border: none
            }
        }
    }

    .middle {
        background: url("../../../assets/middle.png") white no-repeat 0 0;
        background-size: 100% 100%;
        width: 26px;
        height: 26px;
        cursor: pointer;
    }

    .alginright {
        background: url("../../../assets/alginright.png") white no-repeat 0 0;
        background-size: 100% 100%;
        width: 26px;
        height: 26px;
        cursor: pointer;
    }

    .alginleft {
        background: url("../../../assets/alginleft.png") white no-repeat 0 0;
        background-size: 100% 100%;
        width: 26px;
        height: 26px;
        cursor: pointer;
    }

    .bold {
        background: url("../../../assets/bold.png") white no-repeat 0 0;
        background-size: 100% 100%;
        width: 26px;
        height: 26px;
        cursor: pointer;
    }

    .underline {
        background: url("../../../assets/underline.png") white no-repeat 0 0;
        background-size: 100% 100%;
        width: 26px;
        height: 26px;
        cursor: pointer;
    }

    .italic {
        background: url("../../../assets/Italic.png") white no-repeat 0 0;
        background-size: 100% 100%;
        width: 26px;
        height: 26px;
        cursor: pointer;
    }

    .dasheds {
        box-sizing: border-box;
        border: 1px dashed red;
    }

    }

</style>
<script>
    import {font, size, weight, style, button, print, algins} from "./action"
    import {api_label_type, api_label_edit_type, api_label_list} from "@/api/print"
    import {api_warehous_local} from "@/api/entrepot-picking";
    import uiLimitNumber from '@/components/ui-limit-number'

    export default {
        data() {
            return {
                combinationShow: false,
                qrcodeShow: false,
                barShow: false,
                barSelect: '',
                barCheck: false,
                show: false,
                templateType: [],
                font: font,
                size: size,
                weight: weight,
                style: style,
                algins,
                button: button,
                fontStyle: '微软雅黑',
                fontSize: '12px',
                fontWeight: '400',
                leftList: [],
                deletes: {},
                warehouse_id: 0,
                is_default: false,
                qrType: '',
                qrsize: '20',
                qrsel: [
                    {label: '自定义', value: -1},
                    {label: '分割符(换行)', value: -2},
                    {label: '分割符(分号)', value: -3},
                ],
                warehouseList: [],
                selects: [],
                subList: [],
                combinationType: '',
                combinationSelects: []
            }
        },
        mounted() {
            this.get_type();
            this.warehouses_init();
        },
        computed: {
            titless() {
                let title = '';
                switch (this.flag) {
                    case 0:
                        title = "添加打印模板";
                        break;
                    case 1:
                        title = `编辑模板：${this.templateData.temp_name} 信息`;
                        break;
                    case 2:
                        title = `复制模板：${this.templateData.temp_name} 信息`;
                        break;
                }
                return title
            },
            dpi() {
                let dips = getDPI();
                return dips.y;
            },
            get_target_style() {
                let height = (parseFloat(this.templateData.size.height) * (this.dpi / 25.4)).toFixed(4)
                let width = (parseFloat(this.templateData.size.width) * (this.dpi / 25.4)).toFixed(4)
                return {
                    height: `${height}px`,
                    width: `${width}px`
                }
            },
            get_hr() {
                let width = (parseFloat(this.templateData.size.width) * (this.dpi / 25.4)).toFixed(4)
                return {
                    width: `${width}px`
                }
            },
            get_vertical() {
                let height = (parseFloat(this.templateData.size.height) * (this.dpi / 25.4)).toFixed(4)
                return {
                    height: `${height}px`,
                }
            }
        },
        methods: {
            test_drag() {

            },
            ndrag(el, key, target) {
                let findtarget = (child) => {
                    if (child.tagName === 'BODY') {
                        return false;
                    } else {
                        if (child === this.$refs.target) {
                            return true
                        } else {
                            return findtarget(child.parentNode)
                        }
                    }
                };
                let flag = findtarget(target);
                if (flag) {
                    this.left_tag_click(key);
                }
            },
            warehouses_init() {
                this.$http(api_warehous_local).then(res => {
                    this.warehouseList = res.map((item) => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            init_subList() {
                let data = {
                    temp_name: '',
                    temp_type: 3,
                    page: 1,
                    pageSize: 20
                };
                this.$http(api_label_list, data).then(res => {
                    this.subList = res.data.map(row => {
                        return {label: row.temp_name, value: row.id};
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            qr_delete(item) {
                let i = this.selects.findIndex(row => row.mark === item.mark)
                this.selects.splice(i, 1)
            },
            combination_delete(item) {
                let i = this.combinationSelects.findIndex(row => row.mark === item.mark)
                this.combinationSelects.splice(i, 1)
            },
            change_qr_type(val) {
                if (!val) {
                    return
                }
                let find = this.qrsel.find(row => row.value === val);
                switch (val) {
                    case -1:
                        this.selects.push({label: find.label, value: val, mark: Date.now(), input: ''});
                        break;
                    case -2:
                        this.selects.push({label: find.label, value: val, mark: Date.now(), input: '\n'});
                        break;
                    case -3:
                        this.selects.push({label: find.label, value: val, mark: Date.now(), input: ';'});
                        break;
                    default:
                        this.selects.push({label: find.label, value: val, mark: Date.now(), checked: !!find.checked});
                        break;
                }
                this.$nextTick(() => {
                    this.qrType = '';
                })
            },
            change_combination_type(val) {
                if (!val) {
                    return
                }
                let find = this.qrsel.find(row => row.value === val);
                switch (val) {
                    case -1:
                        this.combinationSelects.push({label: find.label, value: val, mark: Date.now(), input: ''});
                        break;
                    case -2:
                        this.combinationSelects.push({label: find.label, value: val, mark: Date.now(), input: '\n'});
                        break;
                    case -3:
                        this.combinationSelects.push({label: find.label, value: val, mark: Date.now(), input: ';'});
                        break;
                    default:
                        this.combinationSelects.push({
                            label: find.label,
                            value: val,
                            mark: Date.now(),
                            checked: !!find.checked
                        });
                        break;
                }
                this.$nextTick(() => {
                    this.combinationType = '';
                })
            },
            qrcode_sure() {
                if (!this.selects.length) {
                    this.$message({type: "warning", message: '请选择二维码绑定的值'});
                    return
                }
                ;
                let flag = true;
                this.selects.forEach(row => {
                    row.value === -1 && row.input === '' && (flag = false)
                });
                if (!flag) {
                    return this.$message({type: "info", message: "请输入自定义的值"})
                }
                ;
                if (!parseInt(this.qrsize)) {
                    return this.$message({type: "info", message: "请二维码输入大小"})
                }
                if (parseInt(this.templateData.size.height) < parseInt(this.qrsize) || parseInt(this.templateData.size.width) < parseInt(this.qrsize)) {
                    return this.$message({type: "info", message: '二维码应该小于纸张高度和宽度的最小值'})
                }
                ;
                this.templateData.temp_data.forEach(row => {
                    row.light = false;
                })
                let data = {
                    label: this.selects,
                    value: 8,
                    type: 2,
                    light: true,
                    style: {
                        fontFamily: this.fontStyle,
                        fontSize: this.fontSize,
                        fontWeight: this.fontWeight,
                        textAlign: 'left',
                    },
                    size: parseInt(this.qrsize * this.dpi / 25.4)
                }
                this.templateData.temp_data.push(data);
                this.selects = [];
                this.qrcodeShow = false;
                this.qrsize = '20';
            },
            combination_sure() {
                if (!this.combinationSelects.length) {
                    this.$message({type: "warning", message: '请选择组合的值'});
                    return
                }
                ;
                let flag = true;
                this.combinationSelects.forEach(row => {
                    row.value === -1 && row.input === '' && (flag = false)
                });
                if (!flag) {
                    return this.$message({type: "info", message: "请输入自定义的值"})
                }
                ;
                this.templateData.temp_data.forEach(row => {
                    row.light = false;
                })
                let string = this.combinationSelects.map(row => {
                    switch (row.value) {
                        case -1:
                            return row.input
                            break
                        case -2:
                            return '\n(换行)'
                            break
                        case -3:
                            return ';'
                            break
                        default:
                            if (row.checked) {
                                return `${row.label}:(值)`
                            } else {
                                return row.label
                            }
                            break;
                    }
                }).join('')
                let data = {
                    label: string,
                    value: this.combinationSelects,
                    type: 1,
                    light: true,
                    style: {
                        fontFamily: this.fontStyle,
                        fontSize: this.fontSize,
                        fontWeight: this.fontWeight,
                        textAlign: 'left',
                    },
                    isCombination: true,
                }
                this.templateData.temp_data.push(data);
                this.combinationSelects = [];
                this.combinationShow = false;
            },
            barsure() {
                if (!this.barSelect) {
                    this.$message({type: "warning", message: '请选择条形码绑定的值'});
                    return
                }
                this.barShow = false;
                let find = this.leftList.find(row => {
                    return row.field === this.barSelect
                });
                if (!!find) {
                    let data = {
                        label: find.field,
                        value: 7,
                        type: 2,
                        light: false,
                        showFont: this.barCheck,
                        style: {
                            fontFamily: this.fontStyle,
                            fontSize: this.fontSize,
                            fontWeight: this.fontWeight,
                            textAlign: 'center',
                        }
                    }
                    this.templateData.temp_data.push(data);
                    this.barSelect = '';
                    this.barCheck = false;
                }

            },
            keydown(item, item_i) {
                this.templateData.temp_data.splice(item_i, 1)
            },
            closesss() {
            },
            del_tag(i, event) {
                event.preventDefault();
                this.$set(this.deletes, "display", 'block');
                this.$set(this.deletes, 'left', `${event.clientX}px`);
                this.$set(this.deletes, 'top', `${event.clientY}px`);
            },
            close(e) {
                this.$set(this.deletes, "display", 'none');
            },
            print() {
                print.call(this, true)
            },
            save() {
                return print.call(this, false)
            },
            style_click(item) {
                let find = this.templateData.temp_data.find(row => row.light);
                if (!!find) {
                    item.action.call(this, item, find)
                }
            },
            change_font() {
                let find = this.templateData.temp_data.find(row => row.light);
                if (!find && find.type === 2) {
                    return;
                }
                if (!!find) {
                    this.$set(find.style, 'fontFamily', this.fontStyle)
                }
            },
            change_size() {
                let find = this.templateData.temp_data.find(row => row.light);
                if (!find || find.type === 2) {
                    return;
                }
                if (!!find) {
                    let size = parseInt(this.fontSize);
                    let webkit = '-webkit-transform';
                    let data = {};
                    data.fontSize = this.fontSize;
                    if (size < 12 && 0 < size) {
                        let scale = (size / 12).toFixed(3);
                        data[`${webkit}`] = `scale(${scale})`;
                        Object.assign(find.style, data)
                    } else {
                        data[`${webkit}`] = `scale(1)`;
                        Object.assign(find.style, data)
                    }
                    find.datakey = this.fontSize;
                }
            },
            change_weight() {
                let find = this.templateData.temp_data.find(row => row.light);
                if (!find || find.type === 2) {
                    return;
                }
                if (!!find) {
                    let data = {};
                    data.fontWeight = this.fontWeight;
                    Object.assign(find.style, data);
                }
            },
            left_tag_click(item) {
                this.templateData.temp_data.forEach(row => {
                    row.light = false;
                })
                let data = {
                    id: Date.now() + "",
                    label: `#1 ${item.name}`,
                    value: item.field,
                    type: item.type,
                    light: true,
                    style: {
                        fontFamily: this.fontStyle,
                        fontSize: this.fontSize,
                        fontWeight: this.fontWeight,
                        textAlign: 'left',
                    },
                    datakey: this.fontSize,
                    isCombination: false,
                };
                let size = parseInt(this.fontSize);
                let webkit = '-webkit-transform';
                let addData = {};
                addData.fontSize = this.fontSize;
                if (size < 12 && 0 < size) {
                    let scale = (size / 12).toFixed(3);
                    addData[`${webkit}`] = `scale(${scale})`;
                    Object.assign(data.style, addData)
                } else {
                    addData[`${webkit}`] = `scale(1)`;
                    Object.assign(data.style, addData)
                }
                this.templateData.temp_data.push(data);
            },
            tag_click(item, i) {
                this.templateData.temp_data.forEach(row => {
                    row.light = false;
                });
                item.light = true;
                item.style.fontSize && (this.fontSize = item.style.fontSize || '12px');
                item.style.fontWeight && (this.fontWeight = item.style.fontWeight || '400');
                item.style.fontFamily && (this.fontStyle = item.style.fontFamily || '微软雅黑');
                this.style[0].check = (item.style.fontWeight > 500 ? true : false);
                this.style[1].check = (item.style.fontStyle === 'italic' ? true : false);
                this.style[2].check = ((item.style.textDecoration && item.style.textDecoration.match('underline') && item.style.textDecoration.match('underline').length > -1) ? true : false);
                this.algins.forEach(row => {
                    row.check = false;
                });
                switch (item.style.textAlign) {
                    case  'left':
                        this.algins[0].check = true;
                        break;
                    case  'center':
                        this.algins[1].check = true;
                        break;
                    case  'right':
                        this.algins[2].check = true;
                        break;
                }
            },
            get_style(item) {
                return item.style;
            },
            get_type() {
                this.$http(api_label_type).then(res => {
                    this.templateType = res;
                }).catch(code => {
                    console.log(code);
                })
            },
            get_list(bool) {
                this.$http(api_label_edit_type, this.templateData.temp_type).then(res => {
                    this.leftList = res;
                    this.qrsel = [{label: '自定义', value: -1},
                        {label: '分割符(换行)', value: -2},
                        {label: '分割符(分号)', value: -3}, ...res.map(row => {
                            return {label: row.name, value: row.field, checked: false}
                        })]
                    if (bool) {
                        this.templateData.temp_data = [];
                    }
                    this.init_subList();
                }).catch(code => {
                    console.log(code)
                })
            },

            button_click(item) {
                item.action.call(this, item)
            },
            open() {
                this.qrcodeShow = false;
                this.selects = [];
                this.barShow = false;
                this.barCheck = false;
                this.combinationSelects = [];
                this.combinationShow = false;
                this.leftList = [];
            }
        },
        filters: {},
        watch: {
            value(val) {
                this.show = val
            },
            show(val) {
                this.$emit("input", val)
            },
        },
        props: {
            value: {},
            templateData: {},
            flag: {
                required: true,
                type: Number,
            }
        },
        components: {
            pageDialog: require("../../../components/page-dialog.vue").default,
            qrcode: require("../../../components/qrcode.vue").default,
            barCode: require("../../../components/bar-code.vue").default,
            dragDrop: require('../../../components/drag-drop').default,
            labelItem: require('../../../components/label-item').default,
            uiLimitNumber,
            requestButton: require('../../../global-components/request-button').default
        }
    }
</script>
