<template>
    <div>
        <search-card :params="searchData"
                     @search="$listeners['search']"
                     :clears="clears"
                     @init-params="init_status_btn">
            <div>
                <label-buttons
                    label="状态："
                    class="inline"
                    @select="$listeners['change-status']"
                    :buttons="statusList">
                </label-buttons>
            </div>
            <div class="mb-mini">
                <label-item label="上架单号：">
                    <el-input v-model="searchData.id"
                              class="width-lg"
                              v-sf.id
                              @keyup.enter.native="id_enter">
                    </el-input>
                </label-item>
                <label-item label="货位：" class="ml-sm">
                    <el-input v-model="searchData.warehouse_cargo_code"
                              v-sf.warehouse_cargo_code
                              @keyup.enter.native="id_enter">
                    </el-input>
                </label-item>
                <label-item label="SKU：" class="ml-sm mr-sm">
                    <el-input v-model="searchData.sku"
                              v-sf.sku
                              @keyup.enter.native="id_enter">
                    </el-input>
                </label-item>
            </div>
            <label-item label="上架区：">
                <el-select v-model="searchData.warehouse_area_type" class="s-width-default">
                    <el-option v-for="(item, index) in areaList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="创建人：" class="ml-sm">
                <super-select v-model="searchData.creator_id"
                              class="s-width-default"
                              :options="staffsList"
                              storageKey="warehouseStaffs"></super-select>
                <!--<param-account-->
                    <!--style="width: 153px;"-->
                    <!--v-model="searchData.creator_id"-->
                    <!--:param="{data:{content:''}}"-->
                    <!--:fixUrl="true"-->
                    <!--:fixResult="sale_fix_result"-->
                    <!--type="warehouseUser"-->
                    <!--placeholder="请选择/输入..."-->
                    <!--url="get|user/warehouse/staffs">-->
                <!--</param-account>-->
            </label-item>
            <label-item label="创建时间：" class="ml-sm mr-sm">
                <el-date-picker
                    v-model="searchData.create_time_from"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.create_time_from
                    :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                    v-model="searchData.create_time_to"
                    type="date"
                    placeholder="选择日期"
                    class="inline date"
                    v-sf.create_time_to
                    :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_staffs_list} from '@/api/warehouse-cargo';
    export default {
        data(){
            return {
                statusList:[
                    {label:'全部',value:''},
                    {label:'待上架',value:1},
                    {label:'上架中',value:3},
                    {label:'已上架',value:5},
                    {label:'已作废',value:0}
                ],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_e){
                            return time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },//结束时间
                urlcreater:'get|user',
                staffsList: []
            }
        },
        mounted(){
            this.get_staffs()
        },
        methods: {
            get_staffs(){
               this.$http(api_get_staffs_list).then(res => {
                   this.staffsList = res.map(row => {
                       return {
                           value: row.id,
                           label: row.realname
                       }
                   })
               })
            },
            init_status_btn(){
                let cur = this.statusList;
                this.statusList = [];
                this.$nextTick(()=>{
                    this.statusList = cur;
                })
            },
            id_enter(){
                this.$emit('search');
            },
            sale_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
        },
        props: {
            areaList: {},
            searchData: {},
            clears: {}
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            labelButtons:require('@/components/label-buttons.vue').default,
            paramAccount:require('@/api-components/param-account').default
        },
    }
</script>
