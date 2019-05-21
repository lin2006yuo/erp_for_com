<template>
    <page-dialog size="small" @open="open" v-model="show" :close-on-cilck-modal="false" title="添加地址">
        <el-form :model="addressData"
                 label-width="60px">
            <el-row class="mt-sm">
                <el-col :span="24">
                    <el-form-item label="邮编：" prop="postal_code">
                        <el-input v-model="addressData.postal_code"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="国家：" prop="country">
                        <el-select v-model="addressData.country_code" @change="select_country" default-first-option filterable clearable>
                            <el-option
                                    v-for="(res, index) in countryList"
                                    :label="res.country_cn_name"
                                    :value="res.country_code"
                                    :key="res.country_code+index"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="8">
                        <el-form-item prop="province_id" label="地址：">
                            <el-select class="inline"
                                       v-model="province_id"
                                       :disabled="addressData.country_code !== 'CN'"
                                       @change="select_province"
                                       ref="province"
                                       :clearable="true"
                                       v-mouse-side.mousewheel="()=>{$refs.province.visible = false}"
                                       placeholder="请选择省">
                                <el-option :key="item.value" v-for="item in provinceList" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="city_id" label-width="70px" label="省/市/州：">
                            <el-select class="inline"
                                       v-model="city_id"
                                       :disabled="addressData.country_code !== 'CN'"
                                       ref="city"
                                       :clearable="true"
                                       v-mouse-side.mousewheel="()=>{$refs.city.visible = false}"
                                       @change="select_city"
                                       placeholder="请选择市">
                                <el-option :key="item.value" v-for="item in cityOption" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="area_id" label-width="82px" label="地区/市/县：">
                            <el-select class="inline"
                                       v-model="area_id"
                                       :disabled="addressData.country_code !== 'CN'"
                                       ref="area"
                                       :clearable="true"
                                       v-mouse-side.mousewheel="()=>{$refs.area.visible = false}"
                                       @change="select_area"
                                       placeholder="请选择区">
                                <el-option v-for="item in areaOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="地址1：" prop="address_line_1">
                        <el-input v-model="addressData.address_line_1" type="text"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="地址2：" prop="address_line_2">
                        <el-input v-model="addressData.address_line_2" type="text"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer">
            <el-button size="mini" type="primary" @click.native="add_address">确定</el-button>
            <el-button size="mini" @click.native="show = false">关闭</el-button>
        </div>
    </page-dialog>
</template>

<script>
    import {api_virtual_country} from '@/api/api-user-management';
    import {api_supplier_area} from '@/api/assert-sup'
    export default {
        data(){
            return {
                show: this.value,
                countryList: [],
                district:{},
                provinceList: [],
                cityList: [],
                areaList: [],
                province_id: '',
                city_id: '',
                area_id: '',
                addressData: {
                    country_code: '',
                    postal_code: '',
                    province: '',
                    city: '',
                    area: '',
                    address_line_1: '',
                    address_line_2: ''
                },
            }
        },
        mounted(){
          this.get_country();
          this.get_province()
        },
        methods: {
            open(){
                this.addressData = {
                    country_code: '',
                    postal_code: '',
                    province: '',
                    city: '',
                    area: '',
                    address_line_1: '',
                    address_line_2: ''
                };
                this.province_id = '';
                this.city_id = '';
                this.area_id = ''
            },
            add_address(){
                let province = this.get_label(this.province_id,this.provinceList);
                let city = this.get_label(this.city_id,this.cityOption);
                let area = this.get_label(this.area_id,this.areaOption);
                this.addressData.province = province;
                this.addressData.city = city;
                this.addressData.area = area;
                this.$emit('add-address',this.addressData)
            },
            get_label(val,arr){
                 let ret = arr.filter(row => row.value === val);
                 return ret.length > 0 ? ret[0].label: ''
            },
            get_province(){
                this.$http(api_supplier_area).then(res=>{
                    this.district = res;
                    let city ="";
                    let area ="";
                    for(let i in this.district){
                        this.provinceList.push({label:this.district[i].name,value:this.district[i].id,pid:this.district[i].pid});
                        this.district[i]._child&&(city=this.district[i]._child);
                        for(let c in city){
                            this.cityList.push({label:city[c].name,value:city[c].id,pid:city[c].pid});
                            city[c]._child&&(area = city[c]._child);
                            for(let a in area){
                                this.areaList.push({label:area[a].name,value:area[a].id,pid:area[a].pid});
                            }
                        }
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            select_country(){
                if(this.addressData.country_code !== 'CN'){
                    this.province_id = "";
                    this.city_id = "";
                    this.area_id = "";
                }
            },
            select_province() {
                this.city_id = "";
                this.area_id = "";
            },
            select_city() {
                this.area_id = "";
            },
            select_area(){

            },
            get_country(){
                this.$http(api_virtual_country).then(res => {
                    this.countryList = res
                }).catch(code => {
                    console.log(code);
                })
            },
        },
        computed:{
            cityOption(){
                let city = [];
                this.cityList.length>0&&(
                    this.cityList.map(row=>{
                        if(row.pid===this.province_id){
                            city.push({label:row.label,value:row.value});
                        }
                    })
                );
                return city;
            },
            areaOption(){
                let area =[];
                this.areaList.length>0&&(
                    this.areaList.map(row=>{
                        if(row.pid===this.city_id){
                            area.push({label:row.label,value:row.value});
                        }
                    })
                );
                return area;
            },
        },
        watch: {
            show(val){
                this.$emit('input', val)
            },
            value(val){
                this.show = val
            }
        },
        props: {
            value:{
                required: true,
                type: Boolean
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default
        }
    }
</script>

<style scoped>

</style>