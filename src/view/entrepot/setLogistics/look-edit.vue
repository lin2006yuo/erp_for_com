<template>
    <!--<page class="p-look-edit">-->
    <page-dialog v-model="editVisible" 
                 :title="titleName" @change="change_dialog"
                 size="full">
        <el-tabs ref="tabs" @tab-click="tab_click" :active-name="action" v-resize="{height: 150}">
            <el-tab-pane name="base-info" class="scroll"  label="基本信息" key="base-info">
                <base-info :baseData="baseData"
                            v-if="false"
                           :shipping-method="shippingMethod"
                           :editable="editable"
                           ref="base"></base-info>
            </el-tab-pane>
            <el-tab-pane name="express-info" class="scroll"  label="面单信息" key="express-info">
                <express-info
                    v-if="expressShow"
                    :express-data="expressData"
                    :shipping-method="shippingMethod"
                    :shortname-method="shortnameMethod"
                    :special-picking-list="specialPickingList"
                    :editable="editable"
                    :carrier_id="carrier_id"
                    ref="express"></express-info>
            </el-tab-pane>
            <el-tab-pane name="effective" class="scroll" label="实效及运费" key="effective">
                <effective v-if="effectiveShow || true" :effective-data="effData"
                           ref="effective"
                           @effective-change="change_eff_data"
                           :editable="editable" :shipping-id="shipping"
                           @files-success="files_success"></effective>
            </el-tab-pane>
            <el-tab-pane name="deliver-channel" class="scroll"  label="可发货平台"
                         key="deliver-channel">
                <deliver-channel v-if="channelShow" :channel-data="channelData"
                                 :editable="editable"
                                 ref="channel"></deliver-channel>
            </el-tab-pane>
            <!--运费折扣-->
            <el-tab-pane name="discount" class="scroll"  label="运费折扣" key="discount">
                <discount v-if="discountShow" :discount-data="discountData" @change_discount="discount_status"
                          :editable="editable"></discount>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <div v-if="editable">
                <el-button size="mini" type="primary" @click="keep">确定</el-button>
                <el-button size="mini" @click.native="editVisible=false">取消</el-button>
            </div>
            <div v-else>
                <el-button size="mini" @click.native="editVisible=false">关闭</el-button>
            </div>
        </div>
    </page-dialog>
    <!--</page>-->
</template>
<style lang="stylus">
    .p-look-edit {
        /*.el-tabs {
            width: 100%;
        }*/
    }

    .scroll {
        > div {
            overflow: auto;
        }
    }
</style>
<script>
    import {
        api_base_keep,
        api_effective_keep,
        api_express_keep,
        api_logistics_channel_keep,
        api_logistics_update_keep
    } from "@/api/setLogistics"

    export default {
        data() {
            return {
                editVisible: false,
                action: "effective",
                expressShow: false,
                effectiveShow: false,
                channelShow: false,
                discountShow: false,
                channelStatue: false,
                discountStatus:false,
            }
        },
        methods: {
            tab_click(val) {
                switch (val.index) {
                    case '1':
                        this.expressShow = true;
                    case '2':
                        this.effectiveShow = true;
                    case '3':
                        this.channelShow = true;
                    case '4':
                        this.discountShow = true;
                }
                this.action = val.name
            },
            files_success(id) {
                this.$emit('files-success', id);
            },
            keep() {
                switch (this.action) {
                    case "base-info":
                        let arr = this.$refs.base.submit();
                        setTimeout(() => {
                            let flag = true;
                            arr.forEach((row, index) => {
                                if (row === false) {
                                    flag = false;
                                    if(index === 0) {
                                        this.$message({
                                            type: "error",
                                            message: `请正确填写信息!`
                                        });
                                    } else {
                                        this.$message({
                                            type: "error",
                                            message: `请完善信息再保存!`
                                        });
                                    }
                                }
                            });
                            flag && this.keep_base();
                        }, 300);
                        break;
                    case "express-info":
                        this.keep_express();
                        break;
                    case "effective":
                        this.keep_eff();
                        break;
                    case "deliver-channel":
                        this.keep_channel();
                        break;
                    case "discount":
                        this.keep_discount();
                        break;
                }
            },
            keep_base() {
                Object.keys(this.baseData).forEach(key => {
                    if (typeof this.baseData[key] === 'string') {
                        this.baseData[key] = this.baseData[key].trim();
                    }
                });
                let data = this.clone(this.baseData);
                data.is_pickup_address = data.is_sender_address ? 1 : 0;
                data.is_return_address = data.is_sender_address ? 1 : 0;
                data.is_sender_address = data.is_sender_address ? 1 : 0;
                let warehouses = this.baseData.warehouses.filter(row => {
                    return row.enabled
                });
                data.warehouses = warehouses.map(row => {
                    return {
                        warehouse_id: row.warehouse_id,
                        shipping_method_id: row.shipping_method_id,
                    }
                });
                data.channels.forEach(row => {
                    row.info.forEach(item => {
                        if (item.type === "select") {
                            item.selects && delete item.selects;
                        }
                    })
                });
                this.$http(api_base_keep, this.baseData.id, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.$emit('update-name', this.baseData.id, this.baseData.shortname);
                    this.editVisible = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            keep_express() {
                Object.keys(this.expressData).forEach(key => {
                    if (typeof this.expressData[key] === 'string') {
                        this.expressData[key] = this.expressData[key].trim();
                    }
                });
                //水印坐标检验
                let isValidate = true;
                Object.keys(this.expressData.coordinate_data).some(key => {
                    this.expressData.coordinate_data[key].x = Number(this.expressData.coordinate_data[key].x);
                    this.expressData.coordinate_data[key].y = Number(this.expressData.coordinate_data[key].y);
                    if (isNaN(this.expressData.coordinate_data[key].x) ||
                        isNaN(this.expressData.coordinate_data[key].y) ||
                        this.expressData.coordinate_data[key].x > 100 ||
                        this.expressData.coordinate_data[key].y > 100) {
                        this.$message({type: 'error', message: `国家${key}的水印坐标为无效输入`});
                        isValidate = false;
                    }
                });
                if (!isValidate) return;
                let data = this.clone(this.expressData);
                this.$http(api_express_keep, this.baseData.id, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.editVisible = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            keep_eff() {
                Object.keys(this.effData).forEach(key => {
                    if (typeof this.effData[key] === 'string') {
                        this.effData[key] = this.effData[key].trim();
                    }
                });
                let data = this.clone(this.effData);
                delete data.details_0;
                delete data.details_1;
                delete data.details_2;
                delete data.details;
                //适用物流
                let allow = this.effData.allow_properties.filter(row => {
                    return row.enabled
                });
                // 可发货平台
                data.channels = this.effData.channels.map(row => {
                    return {
                        id: row.id,
                        enabled: row.enabled,
                    }
                });
                data.allow_properties = allow.map(row => {
                    return {
                        value: row.value,
                        field: row.field,
                    }
                });
                //禁运物流
                let deny = this.effData.deny_properties.filter(row => {
                    return row.enabled
                });
                data.deny_properties = deny.map(row => {
                    return {
                        value: row.value,
                        field: row.field,
                    }
                });
                switch (this.effData.arriveable_type) {
                    case 0:
                        let a = this.copy_(this.clone(this.effData.details_0));
                        data.details = a;
                        break;
                    case 1:
                        let b = this.copy_(this.clone(this.effData.details_1));
                        data.details = b;
                        console.log(b, 'b');
                        break;
                    case 2:
                        let c = this.copy_(this.clone(this.effData.details_2));
                        console.log(c, 'c');
                        data.details = c;
                        break;
                }
                data.details.forEach(group => {
                    group.locations.forEach((location,l_index) => {
                        //如果改国家没有选择偏远费，则删除国家偏远费
                        if(!location.is_remote && group.remote[l_index]) {
                            group.remote[l_index].detail = []
                        }
                    })
                })
                this.$http(api_effective_keep, data.id, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.editVisible = false;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                })
            },
            keep_channel() {
                this.channelStatue = false;
                let data = clone(this.channelData);
                this.affirm_channel(data)
                if (this.channelStatue) {
                    this.$http(api_logistics_channel_keep, data.id, {data: data.channels}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.editVisible = false;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }
                console.log("可发货平台data",data)
            },
            //修改运费和折扣
            keep_discount() {
                let data = clone(this.discountData);
                let discount = Number(data.shipping_fee_discount);

                //校验
                new Promise((resolve, reject) => {
                    if(discount > 2){
                        // this.$message({type:"warning",message:"折扣不能大于2"});
                        reject('折扣不能大于2')
                    }else if( discount <= 0){
                        // this.$message({type:"warning",message:"折扣输入有误"});
                        reject('折扣输入有误')
                    }else {
                        data.shipping_fee_discount = discount.toFixed(2);
                    }

                    if(data.tracking_rules && data.tracking_rules.length) {
                        data.tracking_rules.forEach(i => {
                            if(Number(i.tracking_number_total) <= 0) {
                                return reject('跟踪号总位数必须大于0')
                            }
                            if(i.tracking_number_total == '' || i.start_position == '' || i.end_position == '') {
                                // return this.$message({type: 'warning', message: '跟踪号规则不能为空'})
                                return reject('跟踪号规则不能为空')
                            }
                            if( Number(i.tracking_number_total) <　Number(i.end_position) || 
                                Number(i.start_position) > Number(i.end_position)
                            ) {
                                return reject('请正确填写跟踪号规则')
                            }
                        })
                    }

                    resolve()
                }).then(() => {
                    //校验成功
                    this.$http(api_logistics_update_keep, data.id, data).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.editVisible = false;
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    })
                }).catch(message => {
                    //校验失败
                    this.$message({type: 'warning', message: message})
                })

            },
            discount_status(val){
                this.discountStatus = val
                console.log("val",val)
            },
            copy_(data) {
                data.forEach(row => {
                    row.is_volumn_weight = row.is_volumn_weight ? 1 : 0;
                    row.is_oli_additional = row.is_oli_additional ? 1 : 0;
                    row.is_stage_fee = row.is_stage_fee ? 1 : 0;
                    row.is_registered_fee = row.is_registered_fee ? 1 : 0;
                    row.is_remote = row.is_remote ? 1 : 0
                });
                return data;
            },
            clone(obj) {
                let o;
                if (typeof obj === "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (let i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (let j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            change_dialog(val) {
                if (!val) {
                    this.action = "effective";
                    this.expressShow = false;
                    this.effectiveShow = false;
                    this.channelShow = false;
                    if(this.$refs.effective) this.$refs.effective.compare_code = '';
                    this.$emit('close_edit');
                }
            },
            change_eff_data(val) {
                this.effData = val;
            },
            //价格区间校验
            affirm_validate(content) {
                if(content.currency === '') {
                    this.$message({type: 'error', message: '请选择币种'});
                    return true;
                }
                if(content.min && content.max) {
                    if(isNaN(Number(content.min)) || isNaN(Number(content.max)) || Number(content.min) > Number(content.max)) {
                        this.$message({type: "error", message: "价格区间设置有误"});
                        return true;
                    }
                }
                return false;
            },
            //    可发货平台确认验证
            affirm_channel(data) {
                this.channelStatue = !data.channels.filter(item => {
                    return item.enabled;
                }).some(channel => {
                    if (channel.use_site === 0) {
                        return this.affirm_validate(channel.content[0]);
                    } else {
                        if (channel.content.length > 0) {
                            return channel.content.some(content => {
                                return this.affirm_validate(content);
                            })
                        } else {
                            this.$message({type: 'error', message: '请选择站点'})
                            return true
                        }
                    }
                    return false
                });
            },

        }
        ,
        watch: {
            value(val) {
                this.editVisible = val
            }
            ,
            editVisible(val) {
                this.$emit("input", val)
            }
        }
        ,

        computed: {
            titleName() {
                if (this.editable) {
                    return `编辑物流商：${this.title}邮件方式`
                } else {
                    return `查看物流商：${this.title}邮件方式`
                }
            }
            ,
            shipping() {
                let shipping = [];
                if (this.baseData) {
                    shipping = [this.baseData.carrier_id, this.baseData.id];
                }
                return shipping;
            }
            ,
        }
        ,
        props: {
            shippingMethod: {
                type: Array
            }
            ,
            shortnameMethod: {
                type: Array
            }
            ,
            specialPickingList: {}
            ,
            value: {}
            ,
            effData: {
                required: true,
                type:
                Object
            }
            ,
            baseData: {
                required: true,
                type:
                Object
            }
            ,
            expressData: {
                required: true,
                type:
                Object
            }
            ,
            editable: {
                required: true,
                type:
                Boolean
            }
            ,
            channelData: {
                required: true,
                type:
                Object
            }
            ,
            discountData: {
                required: true,
                type:
                Object
            }
            ,
            title: '',
            carrier_id:
                '',
        }
        ,
        components: {
            baseInfo: require('./base-info.vue').default,
//            effective: require('./effective.vue').default,
            effective:
            require('./effective-copy.vue').default,
            pageDialog:
            require('./page-dialog.vue').default,
            expressInfo:
            require('./express-info.vue').default,
            deliverChannel:
            require('./deliver-channel.vue').default,
            discount: require('./discount.vue').default,
        }
    }
</script>
