<template>
    <page class="p-eub-label">
        <el-col :span="14">
            <search-module ref="search" @search="search" :success="success"
                           :warning-message="warningMessage"></search-module>
            <table-module :package-info="packageInfo" :loading="loading"></table-module>
        </el-col>
        <el-col :span="10">
            <log-module :log-data="logData"></log-module>
        </el-col>
    </page>
</template>

<style lang="stylus">
    .p-eub-label {
        .el-card__header {
            padding: 5px 10px;
            background-color: #6295e9;
            color: #fff;
            height: 36px;
        }
        .el-card__body {
            padding: 0;
        }
    }
</style>

<script>
    import {api_print_change_label} from '@/api/delivery-check'
    import {api_call_package} from '@/api/package-handling';

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '詹熏欣',
                createTime: '2018-8-1',
                updateTime: '2018-8-2',
            },
        },
        data() {
            return {
                loading: false,
                number: '',
                packageInfo: [],
                logData: [],
                warningMessage: '',
                success: false,
                token: '',
            }
        },
        methods: {
            clear() {
                this.number = '';
                this.warningMessage = '';
                this.success = false;
            },
            search(number, printer) {
                this.clear();
                this.number = number;
                this.printer = printer;
                this.warningMessage = '';
                this.$http(api_print_change_label, {number: this.number}).then(res => {
                    this.success = true;
                    let infoObj = {
                        packing_time: res.packing_time,
                        package_create_time: res.package_create_time,
                        process_code: res.process_code,
                        shipping_number: res.shipping_number,
                        shipping_name: res.shipping_name,
                        package_number: res.package_number
                    };
                    this.packageInfo = [infoObj];
                    this.print(res);
                }).catch(code => {
                    this.logData.unshift({
                        message: `扫描：${this.number}，${code.message}`,
                        created_at: code.created_at,
                    });
                    this.warningMessage = code.message;
                    this.$message({type: "error", message: code.message || code});
                }).finally(() => {
                        this.$refs.search.select();
                    }
                )
            },
            print(res) {
                let type = [];
                let content = '';
                let numberList = [];
                let coordinate = '';
                let direction = 1;
                let watermark = '';
                let message, created_at;
                res.print_data.file_list.forEach(row => {
                    content = row.file;
                    type = row.type;
                    coordinate = row.coordinate;
                    watermark = row.label_num;
                });
                direction = res.print_data.direction || direction;
                numberList = res.print_data.identification;
                let params = {
                    Type: type,
                    Token: this.token,
                    Width: 100,
                    Height: 100,
                    PrintName: this.printer,
                    NumberList: numberList,
                    Coordinate: coordinate,
                    Watermark: watermark,
                    content: content,
                    Direction: direction === 1 ? 'vertical' : 'transverse',
                };
                params.Width = res.print_data.width;
                params.Height = res.print_data.height;
                created_at = res.created_at;
                let flag = this.$printer(this.printer, params);
                if (!!flag) {
                    message = `扫描：${this.number}，包裹面单打印成功！`;
                } else {
                    message = `扫描：${this.number}，包裹面单打印失败！`;
                }
                this.logData.unshift({
                    message: message,
                    created_at: created_at,
                });
                this.clear();
            },
        },
        components: {
            searchModule: require('./search-module.vue').default,
            tableModule: require('./table-module.vue').default,
            logModule: require('./log-module.vue').default,
        }
    }
</script>
