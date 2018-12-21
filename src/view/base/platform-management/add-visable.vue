<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-tabs type="card" v-model="select">
            <el-tab-pane label="平台信息" name="平台信息">
                <el-form :model="addEditData"
                         :rules="rules"
                         label-width="190px"
                         ref="addEditData">
                    <el-form-item v-if="!judge || iscCludes" label="平台ID：">
                        <el-col :span="14">
                            <span>{{addEditData.id}}</span>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="添加时间：" v-if="!title.includes('添加账号')&&judge">
                        <el-col :span="14">
                            <span v-if="!!addEditData.create_time" >{{addEditData.create_time}}</span>
                            <span v-else>- -</span>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="更新时间：" v-if="!judge">
                        <el-col :span="14">
                            <span v-if="!!addEditData.update_time">{{addEditData.update_time}}</span>
                            <span v-else>- -</span>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="平台名称：" prop="title">
                        <el-col :span="14">
                            <el-input v-if="judge" v-model="addEditData.title"></el-input>
                            <!--<span v-if="!judge">{{addEditData.title}}</span>-->
                            <el-input v-else v-model="addEditData.title" disabled></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="平台英文名称：" prop="name">
                        <el-col :span="14">
                            <el-input v-if="judge" v-model="addEditData.name"></el-input>
                            <!--<span v-if="!judge">{{addEditData.name}}</span>-->
                            <el-input v-else v-model="addEditData.name" disabled></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="是否有站点：" prop="is_site">
                        <el-col :span="14">
                            <el-select v-if="judge" v-model="addEditData.is_site">
                                <el-option v-for="item in siteList"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<span v-if="!judge">{{addEditData.is_site | filterSite}}</span>-->
                            <el-select v-else v-model="addEditData.is_site" disabled>
                                <el-option v-for="item in siteList"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <!--<el-form-item label="平台订单过期时间：" prop="delivery_deadline">-->
                        <!--<el-col :span="14">-->
                            <!--<el-input-number v-if="judge" class="inline" :debounce="0" v-model="addEditData.delivery_deadline" :min="1"></el-input-number>-->
                            <!--<span v-else>{{addEditData.delivery_deadline}}</span>-->
                            <!--<span>天</span>-->
                        <!--</el-col>-->
                    <!--</el-form-item>-->
                    <el-form-item label="状态：" prop="status">
                        <el-col :span="14">
                            <el-select v-if="judge" v-model="addEditData.status">
                                <el-option v-for="item in statusList"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                            <!--<span v-if="!judge">{{addEditData.status | filterStatus}}</span>-->
                            <el-select v-else v-model="addEditData.change_status " disabled>
                                <el-option v-for="item in statusList"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="平台参数" name="平台参数">
                    <div class="parm mt-lg mb-lg">
                        <span class="red">*</span><span>平台订单过期时间：</span>
                        <el-input v-if="judge" class="inline"  v-model="addEditData.delivery_deadline" style="width: 226px"></el-input>
                        <!--<span v-else>{{addEditData.delivery_deadline}}</span>-->
                        <el-input v-else v-model="addEditData.delivery_deadline" disabled style="width: 226px"></el-input>
                        <span>天</span>
                    </div>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addKeep" v-if="judge" @click.native="keep">确定</request-button>
            <el-button size="mini" @click.native="show=false">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
.parm{
    display: flex;
    align-items: center;
    margin-left: 40px;
}
</style>
<script>

    export default {
        data() {
            return {
                show: this.value,
                select:this.celect,
                siteList: [
                    {label: '无', value: 0},
                    {label: '有', value: 1},
                ],
                statusList: [
                    {label: '启用', value: 0},
                    {label: '停用', value: 1},
                ],
                rules: {
                    title: [
                        {required: true, message: '请输入平台名称', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入平台英文名称', trigger: 'change'}
                    ],
                    is_site: [
                        {required: true, message: '站点为必填项', trigger: 'blur', type: "number"}
                    ],
                    delivery_deadline: [
                        {required: true, message: '请输入平台订单过期时间', trigger: 'change' ,type:"number"}
                    ],
                },
            }
        },
        methods: {
            open() {
                if(this.title.includes('添加')){
                    this.addEditData.title = '';
                    this.addEditData.name = '';
                    this.addEditData.is_site = '';
                    this.addEditData.delivery_deadline = '';
                    this.addEditData.status = 0
                }
            },
            cloce() {

            },
            keep() {
                this.$refs.addEditData.validate((bool) => {
                    if (bool) {
                        this.$emit('add-keep');//-------事件抛出
                    } else {
                        setTimeout(() => {
                            this.$reqKey('addKeep', false);
                        }, 300)
                    }
                });
            },
        },
        filters: {
            filterSite(value) {
                return parseInt(value) ? '有' : '无';
            },
        },
        computed: {
            iscCludes() {
                return this.title.includes('编辑');
            },
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            },
            select(val){
                this.$emit('update:celect',val)
            },
            celect(val){
                this.select = val
            },
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            title: {
                required: true,
                type: String
            },
            addEditData: {
                required: true,
                type: Object
            },
            judge: {
                required: true,
                type: Boolean
            },
            celect:{}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>
