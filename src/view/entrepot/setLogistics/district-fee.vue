<template>
    <!-- 
        cf_index: country_index
        df_index: district_index
     -->
    <div class="c-district-fee">
        <div v-if="remote.length">
                <el-checkbox 
                    @change="handle_checkbox_change(index, item)" 
                    v-model="item.is_remote" 
                    :disabled="!editable"
                    v-for="(item, index) in locations" :key="index"
                    :true-label="1"
                    :false-label="0"
                >{{item.country_name}}</el-checkbox>
        </div>
        <!-- 国家 -->
        <div v-show="locations[cf_index].is_remote" class="fee-box" v-for="(countryFee, cf_index) in remote" :key="`country_${cf_index}`">
            <div class="country-warpper">
                <!-- 城市/偏远费 -->
                <el-button type="primary" icon="plus" size="mini" v-if="editable" @click="add_district_fee(cf_index, countryFee)"></el-button>
                <span class="ml-xs" :class="{'country-name': !editable}">{{countryFee.country_name}}：</span>
            </div>
            <div class="inline fee-info">
                <div class="fee-item" v-for="(districetFee, df_index) in countryFee.detail" :key="`district_${df_index}`">
                    <el-button-group v-if="editable">
                            <!-- 添加城市 -->
                            <el-button type="primary" size="mini" @click="show_add_city({cf_index, df_index}, countryFee)">添加</el-button>
                            <!-- 删除偏远费 -->
                            <el-button type="danger" size="mini" @click="delete_district_fee(cf_index, df_index)">删除</el-button>
                    </el-button-group>
                    <!-- 城市 -->
                    <div class="inline city-list" :title="city_tip(districetFee.city)">
                        <template 
                            v-for="(item, index) in districetFee.city"
                            class="city-item"
                        >{{item.name}} , </template>
                    </div>

                    <span>首重：每 </span><el-input :disabled="!editable" v-model="districetFee.first_weight" class="inline input-width-xs"></el-input><span> g 收取 </span><el-input :disabled="!editable" class="inline input-width-xs" v-model="districetFee.first_fee"></el-input><span class="mr-lg"> 元</span>
                    <span>续重：每 </span><el-input :disabled="!editable" class="inline input-width-xs" v-model="districetFee.additional_weight"></el-input><span> g 收取 </span><el-input :disabled="!editable" class="inline input-width-xs" v-model="districetFee.additional_fee"></el-input><span class="mr-lg"> 元</span>
                    <div class="inline email-box">
                        <span class="email-name">邮编：</span>
                        <input-group
                            :editable="editable"
                            class="email-input-group"
                            :data="districetFee.zip_range"
                            @group-value-blur="handel_groupvalue_blur(arguments, {cf_index, df_index})"
                            :input-width="100"
                        />
                    </div>
                </div>
            </div>
        </div>
        <district-fee-addcity 
            v-model="cityModelVisibel" 
            @add-city='add_city'
            :select="curCitys"
            :code="curCountryCode"
        />
    </div>
</template>
<script>
import number from './mixin/number'

export default {
    mixins: [number],
    data() {
        return {
            cityModelVisibel: false,
            // remote: [],
            curIndexs: {
                cf_index: 0,
                df_index: 0
            },
            curCountryCode: '',
        }
    },
    methods: {
        add_district_fee(cf_index, country) {
            const {country_code} = country
            this.remote[cf_index].detail.push({id: 0, country_code,first_weight: '', additional_weight: '', additional_fee: '',first_fee: '', zip_range: [], city: []})
        },
        delete_district_fee(cf_index, df_index) {
            // this.$confirm('确认是否删除该条偏远费设置','提示',{
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(() => {
            //     this.remote[cf_index].detail.splice(df_index, 1)
            //     //如果没有数据
            //     if(this.remote[cf_index].detail === 0) {
            //         this.remote[cf_index].detail.push({kg: '', re_kg: '', mail: [], city: []})
            //         this.remote[cf_index].is_remote = false
            //     }
            // })
            this.remote[cf_index].detail.splice(df_index, 1)
            //如果没有数据
            if(this.remote[cf_index].detail.length === 0) {
                this.locations[cf_index].is_remote = 0
            }
        },
        //显示城市弹窗，调用城市api
        show_add_city(indexs, country) {
            const { cf_index, df_index } = indexs
            this.curIndexs = indexs
            this.cityModelVisibel = true
            //修改当前国家简码
            this.curCountryCode = country.detail[0].country_code
        },
        add_city(citys) {
            const { cf_index, df_index } = this.curIndexs
            this.remote[cf_index].detail[df_index].city = citys
            this.cityModelVisibel = false
        },
        handle_checkbox_change(cf_index,check_country,$event) {
            const {checked} = event.target
            // checkbox为true
            if(checked) {
                const {country_code, country_name} = check_country
                const country = this.remote[cf_index]
                //如果国家已经存在
                if(country) {
                    const detail = this.remote[cf_index].detail
                    if(!detail.length) {
                        this.remote[cf_index].detail.push({id: 0, country_code, first_weight: '', additional_weight: '', additional_fee: '',first_fee: '',zip_range: [], city: []})
                    }
                } else {
                    //如果国家是后面新增的,没有detail
                    this.remote.push({
                        country_code,
                        country_name,
                        detail: [{id: 0, country_code, first_weight: '', additional_weight: '', additional_fee: '',first_fee: '',zip_range: [], city: []}]
                    })
                }
            }
        },
        handel_groupvalue_blur(arg, item) {
            const { cf_index, df_index } = item
            const groupValue = arg[0].reduce((total, cur) => {
                const values = cur.toString().split('-')
                //如果没有-分隔符，直接返回
                if(values.length === 1) return [...total, ...values]
                //如果多于两个-分隔符，不合法
                if(values.length > 2) {
                    this.$message({ type: 'warning', message: '输入不合法' })
                    return [...total, cur]
                } else {
                //包含分隔符-
                    return [...total, cur]
                }
            }, [])
            this.remote[cf_index].detail[df_index].zip_range = groupValue
            console.log(groupValue, item)
        },
        range(start, end) {
            const span = []
            let startNum = Number(start), endNum = Number(end)
            while(startNum <= endNum) {
                span.push(startNum ++)
            }
            return span
        },
        city_tip(citylist) {
            const tip = citylist.reduce((pre, cur) => {
                return pre + cur.name + ', '
            }, '')
            return tip
        },
        // select_nav() {
        //     this.remote = this.data
        // }
    },
    props: {
        country: {
            default: () => []
        },
        remote: {},
        locations: {},
        editable: {
            default: false
        },
        navIndex: {}
    },
    watch: {
        // locations: {
        //     handler() {
        //         this.locations.forEach((item) => {
        //             this.remote.push(
        //                 //一条偏远费
        //                 {
        //                     country_code: item.country_code,
        //                     country_name: item.country_cn_name,
        //                     detail: [
        //                         {
        //                             id: 0,
        //                             country_code: item.country_code,
        //                             first_weight: '',
        //                             first_fee: '',
        //                             additional_weight: '',
        //                             additional_fee: '',
        //                             zip_range: [],
        //                             city: []
        //                         },
        //                     ],
        //                     is_remote: 0
        //                 }
        //             )
        //         })
        //     },
        //     immediate: true,
        //     deep: true
        // },
        // navIndex() {
        //     this.select_nav()
        //     console.log(this.remote)
        // }
    },
    computed: {
        curCitys() {
            if(!this.remote.length) return []
            const detail = this.remote[this.curIndexs.cf_index].detail
            if(!detail.length) {
                return []
            } else {
                if(!detail[this.curIndexs.df_index]) {
                    return []
                } else {
                    return detail[this.curIndexs.df_index].city
                }
            }
        }
    },
    components: {
        districtFeeAddcity: require('./district-fee-addcity').default,
        inputGroup: require('./input-group.vue').default
    }
}
</script>
<style lang="stylus">
.c-district-fee {
    margin: 20px 0
    .fee-box {
        margin-top: 5px
        display: flex;
        .country-warpper {
            // width: 80px;
            .country-name {
                position: relative;
                top: 5px
            }
        }
        .fee-info {
            flex 1
            .fee-item {
                margin-bottom: 5px
            }
        }
    }
    .city-list {
        margin: 0 10px;
        vertical-align: middle;
        line-height: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 200px;
        position: relative;
        height: 20px;
        line-height: 17px;
        .city-item {
            float: left;
            margin-left: 5px
        }
    }
    .input-width-xs {
        width: 70px
        vertical-align: inherit
    }
    .email-box {
        vertical-align: top;
        .email-name {
            vertical-align: top;
            position: relative;
            top: 3px;
        }
        .email-input-group {
            display: inline-block
        }
    }
}
</style>