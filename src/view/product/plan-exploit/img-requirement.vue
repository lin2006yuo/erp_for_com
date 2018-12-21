<template>
    <div>
        <table class="template img-ment-table" style="border-color: #ddd;" cellspacing="0">
            <tr v-for="(item, index) in imgRequirement">
                <td style="width: 80px;">{{item.name}}</td>
                <td class="t-left">
                    <el-checkbox-group v-model="item.requireList">
                        <el-checkbox v-for="(item, index) in item.options"
                                     :key="index"
                                     :label="item.value" :disabled="!isDisposeEdit"
                                     :checked="item.checked">{{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </td>
            </tr>
            <tr>
                <td style="width: 100px;">备注</td>
                <td>
                    <el-input type="textarea" :rows="4" :disabled="!isDisposeEdit"></el-input>
                </td>
            </tr>
        </table>
        <div class="ml-sm mt-sm" v-if="showBth">
            <div v-if="isDisposeEdit">
                <el-button type="primary" size="mini" class="inline" @click="save">确定</el-button>
                <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
            </div>
            <el-button v-else type="primary" size="mini" class="inline" @click.native="edit">编辑</el-button>
        </div>
    </div>
</template>

<style lang="stylus">
    .img-ment-table{
        td{
            padding:10px;
            border-left: 1px solid #C0CCDA;
            border-top: 1px solid #C0CCDA;
        }
        tr:last-child{
            td{
                border-bottom: 1px solid #C0CCDA;
            }
        }

        tr{
            td:last-child{
                border-right: 1px solid #C0CCDA;
            }
        }
    }
</style>
<script>
    export default{
        methods:{
            save(){
                this.$emit('save',this.imgRequirement);
            },
            cancel(){
                this.$emit('cancel');
            },
            edit(){
                this.$emit('edit');
            },
        },
        props: {
            imgRequirement:{},
            isDisposeEdit:{},
            showBth:{
                type:Boolean,
                //required:true,
                default(){
                    return false
                }
            },

        },
        components: {}
    }
</script>

