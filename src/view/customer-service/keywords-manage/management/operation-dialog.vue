<template>
    <page-dialog v-model="show" :title="title" :close-on-click-modal="false">
        <el-form :model="addData"
                 :rules="rules"
                 label-width="140px"
                 class="mt-sm"
                 ref="addData">
            <el-form-item label="添加人：" v-if="view">
                <span>{{addData.create_name}}</span>
            </el-form-item>
            <el-form-item label="添加时间：" v-if="view">
                <span>{{addData.create_time | timeFilter}}</span>
            </el-form-item>
            <el-form-item label="类型：" prop="type">
                <el-select v-model="addData.type"
                           filterable clearable
                           placeholder="请选择"
                           class="width-super"
                           v-if="!view">
                    <el-option v-for="item in typeList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <span v-if="view">{{addData.type_name}}</span>
            </el-form-item>
            <el-form-item label="关键词：" prop="keyword">
                <el-input class="width-super" v-model="addData.keyword" v-if="!view"></el-input>
                <span v-if="view">{{addData.keyword}}</span>
            </el-form-item>
            <el-form-item label="状态：">
                <el-switch v-model="addData.status"
                           on-text="启用"
                           off-text="停用"
                           :on-value="1"
                           :off-value="0"
                           :disabled="view">
                </el-switch>
            </el-form-item>
            <el-form-item label="适用平台：" prop="channel_ids">
                <el-checkbox-group v-model="addData.channel_ids">
                    <el-checkbox v-for="item in filterChannels"
                                 :label="item.id"
                                 :key="item.id"
                                 :disabled="view">{{item.label}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="submitForm" type="primary" v-if="add">确定</el-button>
            <el-button size="mini" @click="show=false" v-if="add">取消</el-button>
            <el-button size="mini" @click="show=false" v-if="view">关闭</el-button>

        </div>
    </page-dialog>
</template>

<script>
    export default {
        data() {
            return{
                show: false,
                rules:{
                    type:[
                        {required: true, message: '类型必填项', trigger: 'change', type: 'number'}
                    ],
                    keyword:[
                        {required: true, message: '关键词为必填项', trigger: 'change' }
                    ],
                    channel_ids:[
                        {required: true, message: '请至少选择一个平台', trigger:"change", type: 'array'}
                    ],
                },
            }
        },
        methods: {
            submitForm() {
                this.$refs.addData.validate((valid) => {
                    if(valid) {
                        this.$emit("update-add");
                    }else {
                        return false;
                    }
                })
            },
        },
        watch: {
            show(val){
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            }
        },
        filters: {
            timeFilter(val) {
                return val >0 ? datef('YYYY-MM-dd HH: mm: ss', val) : '- -';
            },
        },
        computed: {
        },
        props: {
            value: {},
            typeList: {required: true, type: Array},
            filterChannels: {required: true, type: Array},
            title: {required: true, type: String},
            view:{type:Boolean, required:true},
            add:{type:Boolean, required:true},
            addData: {required: true, type: Object},
        },
    }
</script>

<style scoped>

</style>
