<template>
    <page class="p-remark-info">
        <el-form :model="checkForm" :rules="rules" label-width="180px">
            <!--操作日志-->
            <card label="备注信息" v-if="markId===1">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;" >操作日志</span>
                    </div>
                    <el-table :data="checkForm.log" style="width: 100%">
                        <el-table-column prop="operator" label="操作人" width="180" align="center"></el-table-column>
                        <el-table-column prop="create_time" label="操作时间" width="180" align="center"></el-table-column>
                        <el-table-column prop="process" label="进程" align="center"></el-table-column>
                        <el-table-column prop="remark" label="操作信息" align="center"></el-table-column>
                    </el-table>
                </el-card>
            </card>
            <!--备注信息-->
            <card label="备注信息" v-else>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;" >操作日志</span>
                    </div>
                    <el-table :data="checkForm.log" style="width: 100%">
                        <el-table-column prop="operator" label="操作人" width="180" align="center"></el-table-column>
                        <el-table-column prop="create_time" label="操作时间" width="180" align="center"></el-table-column>
                        <el-table-column prop="process" label="进程" align="center"></el-table-column>
                        <el-table-column prop="remark" label="操作信息" align="center"></el-table-column>
                    </el-table>
                </el-card>
                <!--&lt;!&ndash;<el-card class="box-card" style="margin-top:5px">-->
                    <!--<div slot="header" class="clearfix">-->
                        <!--<span style="line-height: 36px;" >添加备注信息</span>-->
                    <!--</div>-->
                    <!--<el-input type="textarea" v-model="checkForm.remark" placeholder="描述内容" :autosize="{minRows: 5, maxRows: 10}"></el-input>-->
                <!--</el-card>&ndash;&gt;-->
            </card>
        </el-form>
    </page>
</template>
<style lang="stylus">
    .p-remark-info{
        .card-label{
            margin-top:10px
        }
        .box-card{
            width: 90%;
            margin-left: 5%;
        }
    }

</style>
<script>
    import card from '../../../components/card.vue';
    import {api_add_note} from '../../../api/parcel-declare';
    export default{
        data(){
            return {
                rules:{}
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {

        },
        filters: {},
        watch: {},
        computed: {},
        props: {
            checkForm:{
                required:true,
                type:Object
            },
            markId:{},
            isAdd:{},
        },
        components: {
            card,
        }
    }
</script>