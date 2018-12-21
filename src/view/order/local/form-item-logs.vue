<template>
    <el-table
            class="scroll-bar"
            highlight-current-row
            :data="form"
            border
            style="width: 100%">
        <el-table-column
                prop="remark"
                label="信息">
        </el-table-column>
        <el-table-column
                width="100px"
                prop="process"
                label="订单状态">
        </el-table-column>
        <el-table-column
                width="100px"
                inline-template
                label="操作员">
            <div>
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
            </div>
        </el-table-column>
        <el-table-column
                width="160px"
                label="日期"
                inline-template>
            <span v-if="row.create_time">{{row.create_time|ftime}}</span>
            <span v-else>-- --</span>
        </el-table-column>
    </el-table>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_get_user_id_get_department} from '@/api/order-local'
    export default{
        data(){
            return{
                loading:false,
                operator_id:0,
                departments:{}
            }
        },
        methods:{
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
            ftime(time){
                return datef('YYYY-MM-dd HH:mm:ss',time);
            }
        },
        props:{
            form:{
                required:true,
                type:Array
            }
        },
        components:{

        }
    }
</script>
