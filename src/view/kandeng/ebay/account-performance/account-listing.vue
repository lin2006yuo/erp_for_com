<template>
    <page>
        <el-tabs v-model="activeName" @tab-click="handClick">
            <el-tab-pane label="综合表现" name="1">
                <comprehensive ref="comprehensive"
                               :param="param"
                            v-if="activeName==='1'"></comprehensive>
            </el-tab-pane>
            <el-tab-pane label="非货运表现" name="2">
                <not-cargo ref="notCargo"
                           :param="param"
                          v-if="activeName==='2'"></not-cargo>
            </el-tab-pane>
            <el-tab-pane label="非货运问题刊登列表" name="3">
                <not-cargo-list ref="notCargoList"
                                :param="param"
                        v-if="activeName==='3'"></not-cargo-list>
            </el-tab-pane>
            <el-tab-pane label="货运表现" name="4">
                <is-cargo ref="isCargo"
                          :param="param"
                         v-if="activeName==='4'"></is-cargo>
            </el-tab-pane>
            <el-tab-pane label="货运问题刊登列表（1-8周）" name="5">
                <cargo-trouble-one ref="cargoTroubleOne"
                                   :param="param"
                         v-if="activeName==='5'"></cargo-trouble-one>
            </el-tab-pane>
            <el-tab-pane label="货运问题刊登列表（5-12周）" name="6">
                <cargo-trouble-five ref="cargoTroubleFive"
                                    :param="param"
                         v-if="activeName==='6'"></cargo-trouble-five>
            </el-tab-pane>
            <el-tab-pane label="物流标准" name="7">
                <transform-standard ref="transformStandard"
                                    :param="param"
                         v-if="activeName==='7'"></transform-standard>
            </el-tab-pane>
            <el-tab-pane label="SpeedPAK物流" name="8">
                <speed-standard ref="speedStandard"
                                :param="param"
                         v-if="activeName==='8'"></speed-standard>
            </el-tab-pane>
            <el-tab-pane label="海外仓标准" name="9">
                <overseas-standard ref="overseasStandard"
                                   :param="param"
                         v-if="activeName==='9'"></overseas-standard>
            </el-tab-pane>
            <el-tab-pane label="商业计划追踪评估" name="10">
                <business-plan ref="businessPlan"
                               :param="param"
                         v-if="activeName==='10'"></business-plan>
            </el-tab-pane>
            <el-tab-pane label="待处理刊登列表" name="11">
                <wait-deal-list ref="waitDealList"
                                :param="param"
                         v-if="activeName==='11'"></wait-deal-list>
            </el-tab-pane>
            <el-tab-pane label="买家未收到物品提醒列表" name="12">
                <tip-list ref="tipList"
                          :param="param"
                         v-if="activeName==='12'"></tip-list>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>

<script>
    export default {
        name: "account-listing",
        data(){
            return{
                activeName:'1',
            }
        },
        computed:{
            param(){
                console.log(this.$page.param,'this.$page.param')
                return this.$page.param || {}
            }
        },
        methods:{
            handClick(val){
                switch (val.name){
                    case '1':
                        if(!!this.$refs.comprehensive)this.$refs.comprehensive.init();
                        break;
                    case '2':
                        if(!!this.$refs.notCargo)this.$refs.notCargo.init();
                        break;
                    case '3':
                        if(!!this.$refs.notCargoList)this.$refs.notCargoList.init();
                        break;
                    case '4':
                        if(!!this.$refs.isCargo)this.$refs.isCargo.init();
                        break;
                    case '5':
                        if(!!this.$refs.cargoTroubleOne)this.$refs.cargoTroubleOne.init();
                        break;
                    case '6':
                        if(!!this.$refs.cargoTroubleFive)this.$refs.cargoTroubleFive.init();
                        break;
                    case '7':
                        if(!!this.$refs.transformStandard)this.$refs.transformStandard.init();
                        break;
                    case '8':
                        if(!!this.$refs.speedStandard)this.$refs.speedStandard.init();
                        break;
                    case '9':
                        if(!!this.$refs.overseasStandard)this.$refs.overseasStandard.init();
                        break;
                    case '10':
                        if(!!this.$refs.businessPlan)this.$refs.businessPlan.init();
                        break;
                    case '11':
                        if(!!this.$refs.waitDealList)this.$refs.waitDealList.init();
                        break;
                    case '12':
                        if(!!this.$refs.tipList)this.$refs.tipList.init();
                        break;

                    }
            },
        },
        components:{
            tipList:require('./tip-list.vue').default,//买家未收到物品提醒表
            waitDealList:require('./wait-deal-list').default,//待处理刊登表
            businessPlan:require('./business-plan').default,//商业计划追踪评估
            overseasStandard:require('./overseas-standard').default,//海外仓标准
            speedStandard:require('./speed-standard').default,//SpeedPAK物流
            transformStandard:require('./transform-standard').default,//物流标准
            cargoTroubleFive:require('./cargo-trouble-five').default,//货运问题刊登列表（5-12周）
            cargoTroubleOne:require('./cargo-trouble-one').default,//货运问题刊登列表（1-8周）
            isCargo:require('./is-cargo').default,//货运表现
            notCargoList:require('./not-cargo-list').default,//非货运问题刊登列表
            notCargo:require('./not-cargo').default,//非货运表现
            comprehensive:require('./comprehensive').default,//综合表现
        }
    }
</script>

<style scoped>

</style>
