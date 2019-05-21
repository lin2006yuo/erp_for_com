<template>
    <el-col :span="isHidden?24:21">
        <ui-table v-model="checkAll" class="manager" :body-height="65" @check="check"  :has-data="tabledata.length>0"  v-loading="isLoading" element-loading-text="玩命加载中..."
                    :heads="[
                {isCheck:true,width:2},
                {label:'产品图片',width:6},
                {label:'SPU',width:9},
                {label:'产品中文名称',width:16},
                {label:'分类',width:10},
                {label:'物流属性',width:6},
                {label:'海关编码',width:8},
                {label:'开发员',width:6},
                {label:'产品状态',width:6},
                {label:'出售时间',width:10},
                {label:'停售时间',width:11},
                {label:'操作',width:10}]">
            <tbody >
            <template v-for="(data, index) in tabledata">
                <tr class="line" :class="[data.show ? 'active' : '',data.heighLight?'active-color':'']"
                    @click="addClass(data)">
                    <!--isCheck-->
                    <td>
                        <el-checkbox v-model="data.isCheck" @change="changeOne"></el-checkbox>
                    </td>
                    <!--产品图片-->
                    <td>
                        <img v-lazy="get_path(data.thumb,'_60x60.')"
                                @dblclick="show_big(data)"
                                height="60px" width="60px"
                                style="border:none">
                    </td>
                    <!--SPU-->
                    <td class="t-left">
                        <plus-minus @show-detail="show_detail(data,index)" :show="data.show" :title="tipTitle" ></plus-minus>
                        <span>{{data.spu}}</span>
                    </td>
                    <!--产品中文名称-->
                    <td>
                        <ui-tip :content="data.name" :width="98"></ui-tip>
                    </td>
                    <!--分类-->
                    <td>
                        <ui-tip :content="data.category" :width="98"></ui-tip>
                    </td>
                    <!--物流属性-->
                    <td>{{data.transport_property}} </td>
                    <!--海关编码-->
                    <td>{{data.hs_code}}</td>
                    <!--开发员-->
                    <td>{{data.developer_id}}</td>
                    <!--产品状态-->
                    <td>
                        {{data.status|statusFilter}}
                    </td>
                    <!--出售时间-->
                    <td>
                        <ui-tip :content="data.publish_time" :width="98"></ui-tip>
                    </td>
                    <!--停售时间-->
                    <td>
                        <ui-tip :content="data.stop_selling_time" :width="98"></ui-tip>
                    </td>
                    <td>
                        <trends-select :selects="get_operation(data.status)"  @trigger="change_operation(data,$event)" type="primary"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold">
                        <td :rowspan="`${data.skulist.length+1}`">&nbsp;</td>
                        <td>图片</td>
                        <td>SKU</td>
                        <td>SKU别名</td>
                        <td>产品属性</td>
                        <td>状态</td>
                        <td>成本价(￥)</td>
                        <td>零售价(＄)</td>
                        <td>重量(g)</td>
                        <td>长/宽/高(cm)</td>
                        <td>操作</td>
                        <td :rowspan="`${data.skulist.length+1}`"></td>
                    </tr>
                    <tr v-for="item in data.skulist">
                        <!--图片-->
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="sku_image(item.thumb)" width="200px" height="200px">
                                <span slot="reference">
                                    <img v-lazy="item.thumb" height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <!--SKU-->
                        <td>
                            <ui-tip :content="item.sku"></ui-tip>
                        </td>
                        <!--SKU别名-->
                        <td>
                            <template v-for="it in item.alias">
                                <div>{{it}}</div>
                            </template>
                        </td>
                        <!--产品属性-->
                        <td>{{item.attributes}}</td>
                        <!--状态-->
                        <td>
                            {{item.status === "上架" ? "出售":item.status === "下架" ? "停售":item.status}}
                        </td>
                        <!--成本价(￥)-->
                        <td>{{item.cost_price | filterPrice}}</td>
                        <!--零售价(＄)-->
                        <td>{{item.retail_price | filterPrice}}</td>
                        <!--重量(g)-->
                        <td>{{item.weight}}</td>
                        <!--长/宽/高(cm)-->
                        <td>{{item.length}}/{{item.width}}/{{item.height}}</td>
                        <!--操作-->
                        <td>
                            <permission tag="span" :route="apis.url_change_sku_status">
                                <span  v-for="(operate, index) in operationList(item)" :key="index">
                                    <span :class="[operate.status? 'status' : '','operates']"
                                        @click="change_sku_status(item,index,operate)">
                                        {{operate.name}}
                                    </span>
                                    <span v-if="index < `${operationList3.length-1}`">|</span>
                                </span>
                            </permission>
                            <!--<span>|</span>-->
                            <span style='display:block' class="operate" @click="print(item)">打印标签</span>
                        </td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
    </el-col>
</template>
