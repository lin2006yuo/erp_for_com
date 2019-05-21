<template>
    <el-row style="position: relative;">
        <el-col :span="14">
            <item-page label="仓库">
                <el-table :data="lists" height="780">
                    <el-table-column prop="code" label="代码"></el-table-column>
                    <el-table-column prop="name" label="仓库名称"></el-table-column>
                    <el-table-column prop="country" label="所在国家"></el-table-column>
                    <el-table-column prop="operation"  inline-template label="操作" width="100">
                        <el-switch>
                        </el-switch>
                    </el-table-column>
                    <el-table-column prop="create_time" label="添加/修改时间"></el-table-column>
                    <el-table-column prop="operation"  inline-template label="操作" width="100">
                        <el-button @click.native="deleteme">删除</el-button>
                    </el-table-column>
                </el-table>
            </item-page>
        </el-col>
        <el-col :span="10">
            <item-page label="仓库地址" :can-shrink="true">
                <el-form v-if="formAddress != {}" label-width="80px">
                    <el-form-item label="代码">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="仓库名称">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item lable="仓库类型">
                        <el-select>
                            <el-option v-for="type in formAddress.types" :key="type.value"
                            :label="type.label" :value="type.value">

                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="中国">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="是否启动">
                        <el-switch></el-switch>
                    </el-form-item>
                    <el-form-item label="所在地区">

                    </el-form-item>
                    <el-form-item label="详细地址">
                        <el-input type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 4}"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="邮编">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="联系人姓名">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="电话/手机">
                        <el-input></el-input>
                    </el-form-item>
                </el-form>
                <template v-if="editState">
                    <el-button type="primary" @click.native="submitMdf">修改</el-button>
                    <el-button @click.native="editState = false;">取消</el-button>
                </template>
                <template v-else>
                    <el-button type="primary" @click.native="editButton">编辑</el-button>
                </template>
            </item-page>
            <item-page label="邮件方式">

            </item-page>
        </el-col>
    </el-row>
</template>
<style lang="stylus">
    .left{
        width:60%;
        display: inline-block;
    }
</style>
<script>

    import itemPage from '../../components/item-page.vue';
    export default{
    	page:{},
      refresh(){
        this.lists = [
          {code:'x',name:'x',country:'xx'}
        ];
    		this.init();
      },
        data(){
            return {
                lists:[
                    {code:'x',name:'x',country:'xx'}
                ],
                editState:false,
                formAddress:{}
            }
        },
        methods:{
            deleteme(){

            },
            submitMdf(){

            },
            editButton(){
                this.editState = true;
            }
        },
        computed:{
        },
        components: {
            itemPage
        }
    }
</script>
