<template>
    <page-dialog v-model="show"
     size="large"
    :title="title"
    :close-on-click-modal="false">
        <el-table :data="logList"
                  >
            <el-table-column label="操作时间" >
                <template slot-scope="scope">{{scope.row.create_time|fdatetime}}</template>
            </el-table-column>
            <el-table-column label="操作人"  inline-template>
                <el-popover
                        v-if="row.operator_id>1"
                        placement="left"
                        width="200"
                        trigger="hover"
                        :open-delay="500"
                        @show="showChange(row.operator_id)">
                    <div v-loading="loading" v-for="department in get_departments">
                        <div>{{department.name}}</div>
                    </div>
                    <span slot="reference">{{row.operator}}</span>
                </el-popover>
                <div v-else>{{row.operator}}</div>
            </el-table-column>
            <el-table-column label="操作内容" prop="remark"></el-table-column>
        </el-table>
        <div slot="footer">
            <el-button size="mini" @click.native="close">关闭</el-button>
        </div>
    </page-dialog>
</template>

<script>
    import {api_get_user_id_get_department} from '@/api/server-management'
    export default {
        data() {
            return {
                show: this.value,
                departments:{},
                loading:false,
                operator_id:0
            }
        },
        watch:{
            show(val){
                this.$emit('input',val)
            },
            value(val){
                this.show = val
            }
        },
        methods: {
            close() {
                this.show = false
            },
            showChange(id){
                if(!this.departments.hasOwnProperty(id)) {
                    this.loading = true;
                    this.$http(api_get_user_id_get_department, id).then(res => {
                        this.departments[id] = res;
                        this.operator_id = id;
                        this.loading = false
                    }).catch(code => {
                        console.log(code);
                    });
                }else{
                    this.operator_id = id;
                }
            }
        },
        computed:{
            get_departments(){
                return this.departments[this.operator_id]||[]
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        props:{
            title:{},
            value:{},
            logList:{}
        }
    }
</script>

<style scoped>

</style>