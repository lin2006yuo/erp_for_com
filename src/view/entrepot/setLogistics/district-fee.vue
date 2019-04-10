<template>
    <div class="c-district-fee">
        <div v-if="country">
                <el-checkbox @change="handle_checkbox_change(index)" v-model="item.active" v-for="(item, index) in feeList" :key="index">{{item.country}}</el-checkbox>
        </div>
        <!-- 行 -->
        <div v-show="countryFee.active" class="fee-box" v-for="(countryFee, cf_index) in feeList" :key="`country_${cf_index}`">
            <div class="country-name">
                <!-- 添加偏远费 -->
                <el-button type="primary" icon="plus" size="mini" @click="add_district_fee(cf_index)"></el-button>
                <span class="ml-xs">{{countryFee.country}}：</span>
            </div>
            <div class="inline fee-info">
                <div class="fee-item" v-for="(districetFee, df_index) in countryFee.district_fee_list" :key="`district_${df_index}`">
                    <el-button-group>
                            <!-- 添加城市 -->
                            <el-button type="primary" size="mini" @click="show_add_city({cf_index, df_index})">添加</el-button>
                            <!-- 删除偏远费 -->
                            <el-button type="danger" size="mini" @click="delete_district_fee(cf_index, df_index)">删除</el-button>
                    </el-button-group>
                    <ul class="inline city-list">
                        <li 
                            v-for="(item, index) in districetFee.city" :key="`city_${index}`"
                            class="city-item"
                        >{{item.cn}}</li>
                    </ul>
                    <span>首重：每 </span><el-input v-model="districetFee.kg" class="inline input-width-xs"></el-input><span> g 收取 </span><el-input class="inline input-width-xs"></el-input><span class="mr-lg"> 元</span>
                    <span>续重：每 </span><el-input class="inline input-width-xs"></el-input><span> g 收取 </span><el-input class="inline input-width-xs"></el-input><span class="mr-lg"> 元</span>
                    <div class="inline email-box">
                        <span class="email-name">邮编：</span>
                        <input-group 
                            class="email-input-group"
                            :data="districetFee.mail"
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
        />
    </div>
</template>
<script>
import number from './mixin/number'

const feelTemplate = {kg: '', re_kg: '', mail: [], city: []}
export default {
    mixins: [number],
    data() {
        return {
            cityModelVisibel: false,
            feeList: [
                {
                    country: '美国',
                    district_fee_list: [
                        {
                            kg: '',
                            re_kg: '',
                            mail: ['525656', '7777', '8888'],
                            city: [
                                {id: 1, cn: '新疆'},
                                {id: 2, cn: '广东'},
                            ]
                        },
                    ],
                    active: true
                },
                {
                    country: '英国',
                    district_fee_list: [],
                    active: false
                }
            ],
            curIndexs: {
                cf_index: 0,
                df_index: 0
            },
        }
    },
    methods: {
        add_district_fee(cf_index) {
            this.feeList[cf_index].district_fee_list.push({kg: '', re_kg: '', mail: [], city: []})
        },
        delete_district_fee(cf_index, df_index) {
            // this.$confirm('确认是否删除该条偏远费设置','提示',{
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(() => {
            //     this.feeList[cf_index].district_fee_list.splice(df_index, 1)
            //     //如果没有数据
            //     if(this.feeList[cf_index].district_fee_list === 0) {
            //         this.feeList[cf_index].district_fee_list.push({kg: '', re_kg: '', mail: [], city: []})
            //         this.feeList[cf_index].active = false
            //     }
            // })
            this.feeList[cf_index].district_fee_list.splice(df_index, 1)
            //如果没有数据
            if(this.feeList[cf_index].district_fee_list.length === 0) {
                this.feeList[cf_index].active = false
            }
        },
        show_add_city(indexs) {
            const { cf_index, df_index } = indexs
            this.curIndexs = indexs
            this.cityModelVisibel = true
        },
        add_city(citys) {
            const { cf_index, df_index } = this.curIndexs
            this.feeList[cf_index].district_fee_list[df_index].city = citys
        },
        handle_checkbox_change(cf_index,$event) {
            const {checked} = event.target
            const districtFeeList = this.feeList[cf_index].district_fee_list
            if(checked && !districtFeeList.length) {
                this.feeList[cf_index].district_fee_list.push({kg: '', re_kg: '', mail: [], city: []})
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
                    return [...total]
                } else {
                //包含分隔符-
                    let start = values[0], end = values[1]
                    const span = this.range(start,end)
                    return [
                        ...total,
                        ...span,
                    ]
                }
            }, [])
            this.feeList[cf_index].district_fee_list[df_index].mail = groupValue
            console.log(groupValue, item)
        },
        range(start, end) {
            const span = []
            let startNum = Number(start), endNum = Number(end)
            while(startNum <= endNum) {
                span.push(startNum ++)
            }
            return span
        }
    },
    props: {
        country: {
            default: () => []
        },
    },
    computed: {
        curCitys() {
            const district_fee_list = this.feeList[this.curIndexs.cf_index].district_fee_list
            if(!district_fee_list.length) {
                return []
            } else {
                if(!district_fee_list[this.curIndexs.df_index]) {
                    return []
                } else {
                    return district_fee_list[this.curIndexs.df_index].city
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
        .country-name {
            width: 80px;
        }
        .fee-info {
            flex 1
            .fee-item {
                margin-bottom: 5px
            }
        }
    }
    .city-list {
        margin: 0 20px;
        vertical-align: initial;
        line-height: 10px
        .city-item {
            float: left;
        }
    }
    .input-width-xs {
        width: 50px
        vertical-align: inherit
    }
    .email-box {
        vertical-align: top;
        .email-name {
            vertical-align: initial
        }
        .email-input-group {
            display: inline-block
        }
    }
}
</style>