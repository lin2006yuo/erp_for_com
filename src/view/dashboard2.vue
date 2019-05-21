<template>
    <page>
        <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="textarea">
        </el-input>
        <el-button  @click="creatsd">生成</el-button>
        <div>{{detail}}</div>

        <ui-select>
            <el-option label="sssss" value="sss"></el-option>
            <el-option label="sss22" value="sss22"></el-option>
        </ui-select>
        <ui-tips  content="asdfadsfasdfasdfasdfasdfasdfa" :width="100"></ui-tips>
        <ui-tips  content="asdfadsf"></ui-tips>
        <ui-tips  content="asdfadsfasdfasdfasdfasdfasdfa"></ui-tips>


        <el-button @click.native="format_click">format</el-button>
        <el-button @click.native="showhidden_click">show/hidden</el-button>
        <el-row>
            <el-col :span="12">
                <div id="gggg"></div>
            </el-col>
            <el-col :span="12">
                <div id="ffff"></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div id="aaaa"></div>
            </el-col>
            <el-col :span="12">
                <div id="cccc"></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div id="dddd"></div>
            </el-col>
            <el-col :span="12">
                <div id="bbbb"></div>
            </el-col>
        </el-row>
        <div style="height:500px;width:100%;position:relative">
            <button @click="change_drag">出现</button>
            <ui-drag v-model="isDrag" :position="{top:'0px',left:'0px',width:'100px',height:'100px',background:'green'}">content</ui-drag>
            <div class="drag" v-dragmove> drag</div>
        </div>
    </page>
</template>
<style lang="stylus">
    #ffff,#gggg{
        width:100%;
        height:200px;
    }
    #aaaa,#cccc,#dddd,#bbbb{
        height:300px;
    }
    .drag{
        background-color: red;
        width:100px;
        height: 100px;
        top:0;
    }
</style>
<script>
    import dropList from '../components/drop-list.vue';
    import dropItem from '../components/drop-item.vue';
    import userInfo from './user-info.vue';
    import formFilter from '../components/form-filter.vue';
    import selectQuery from '../components/select-query.vue';
    import pageDialog from '../components/page-dialog.vue';
    import chinaAddress from '../components/china-address.vue';
    import echarts from 'echarts';
    import '../lib/china';
    export default{
        page:{
            rename:true,
            multiple:true,
        },
        activated(){
            if(!this.active){
                let my = echarts.init(gggg);
                my.setOption({
                    title: { text: '柱状图' },
                    tooltip: {},
                    xAxis: {
                        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                });
                let my2 = echarts.init(document.getElementById('ffff'));

                var data = [];
                var now = +new Date(1997, 9, 3);
                var oneDay = 24 * 3600 * 1000;
                var value = Math.random() * 1000;
                for (var i = 0; i < 1000; i++) {
                    data.push(randomData());
                }
                function randomData() {
                    now = new Date(+now + oneDay);
                    value = value + Math.random() * 21 - 10;
                    return {
                        name: now.toString(),
                        value: [
                            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                            Math.round(value)
                        ]
                    }
                }

                var option2 = {
                    title: {
                        text: '折线图'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            params = params[0];
                            var date = new Date(params.name);
                            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
                        },
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: data
                    }]
                };
                my2.setOption(option2);

                var my3 = echarts.init(document.getElementById('aaaa'));
                let option3 = {
                    title : {
                        text: '饼图',
                        subtext: '纯属虚构',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                my3.setOption(option3);

                let my4 = echarts.init(document.getElementById('dddd'));
                var data4 = [
                    {name: '海门', value: 9},
                    {name: '鄂尔多斯', value: 12},
                    {name: '招远', value: 12},
                    {name: '舟山', value: 12},
                    {name: '齐齐哈尔', value: 14},
                    {name: '盐城', value: 15},
                    {name: '赤峰', value: 16},
                    {name: '青岛', value: 18},
                    {name: '乳山', value: 18},
                    {name: '金昌', value: 19},
                    {name: '泉州', value: 21},
                    {name: '莱西', value: 21},
                    {name: '日照', value: 21},
                    {name: '胶南', value: 22},
                    {name: '南通', value: 23},
                    {name: '拉萨', value: 24},
                    {name: '云浮', value: 24},
                    {name: '梅州', value: 25},
                    {name: '文登', value: 25},
                    {name: '上海', value: 25},
                    {name: '攀枝花', value: 25},
                    {name: '威海', value: 25},
                    {name: '承德', value: 25},
                    {name: '厦门', value: 26},
                    {name: '汕尾', value: 26},
                    {name: '潮州', value: 26},
                    {name: '丹东', value: 27},
                    {name: '太仓', value: 27},
                    {name: '曲靖', value: 27},
                    {name: '烟台', value: 28},
                    {name: '福州', value: 29},
                    {name: '瓦房店', value: 30},
                    {name: '即墨', value: 30},
                    {name: '抚顺', value: 31},
                    {name: '玉溪', value: 31},
                    {name: '张家口', value: 31},
                    {name: '阳泉', value: 31},
                    {name: '莱州', value: 32},
                    {name: '湖州', value: 32},
                    {name: '汕头', value: 32},
                    {name: '昆山', value: 33},
                    {name: '宁波', value: 33},
                    {name: '湛江', value: 33},
                    {name: '揭阳', value: 34},
                    {name: '荣成', value: 34},
                    {name: '连云港', value: 35},
                    {name: '葫芦岛', value: 35},
                    {name: '常熟', value: 36},
                    {name: '东莞', value: 36},
                    {name: '河源', value: 36},
                    {name: '淮安', value: 36},
                    {name: '泰州', value: 36},
                    {name: '南宁', value: 37},
                    {name: '营口', value: 37},
                    {name: '惠州', value: 37},
                    {name: '江阴', value: 37},
                    {name: '蓬莱', value: 37},
                    {name: '韶关', value: 38},
                    {name: '嘉峪关', value: 38},
                    {name: '广州', value: 38},
                    {name: '延安', value: 38},
                    {name: '太原', value: 39},
                    {name: '清远', value: 39},
                    {name: '中山', value: 39},
                    {name: '昆明', value: 39},
                    {name: '寿光', value: 40},
                    {name: '盘锦', value: 40},
                    {name: '长治', value: 41},
                    {name: '深圳', value: 41},
                    {name: '珠海', value: 42},
                    {name: '宿迁', value: 43},
                    {name: '咸阳', value: 43},
                    {name: '铜川', value: 44},
                    {name: '平度', value: 44},
                    {name: '佛山', value: 44},
                    {name: '海口', value: 44},
                    {name: '江门', value: 45},
                    {name: '章丘', value: 45},
                    {name: '肇庆', value: 46},
                    {name: '大连', value: 47},
                    {name: '临汾', value: 47},
                    {name: '吴江', value: 47},
                    {name: '石嘴山', value: 49},
                    {name: '沈阳', value: 50},
                    {name: '苏州', value: 50},
                    {name: '茂名', value: 50},
                    {name: '嘉兴', value: 51},
                    {name: '长春', value: 51},
                    {name: '胶州', value: 52},
                    {name: '银川', value: 52},
                    {name: '张家港', value: 52},
                    {name: '三门峡', value: 53},
                    {name: '锦州', value: 54},
                    {name: '南昌', value: 54},
                    {name: '柳州', value: 54},
                    {name: '三亚', value: 54},
                    {name: '自贡', value: 56},
                    {name: '吉林', value: 56},
                    {name: '阳江', value: 57},
                    {name: '泸州', value: 57},
                    {name: '西宁', value: 57},
                    {name: '宜宾', value: 58},
                    {name: '呼和浩特', value: 58},
                    {name: '成都', value: 58},
                    {name: '大同', value: 58},
                    {name: '镇江', value: 59},
                    {name: '桂林', value: 59},
                    {name: '张家界', value: 59},
                    {name: '宜兴', value: 59},
                    {name: '北海', value: 60},
                    {name: '西安', value: 61},
                    {name: '金坛', value: 62},
                    {name: '东营', value: 62},
                    {name: '牡丹江', value: 63},
                    {name: '遵义', value: 63},
                    {name: '绍兴', value: 63},
                    {name: '扬州', value: 64},
                    {name: '常州', value: 64},
                    {name: '潍坊', value: 65},
                    {name: '重庆', value: 66},
                    {name: '台州', value: 67},
                    {name: '南京', value: 67},
                    {name: '滨州', value: 70},
                    {name: '贵阳', value: 71},
                    {name: '无锡', value: 71},
                    {name: '本溪', value: 71},
                    {name: '克拉玛依', value: 72},
                    {name: '渭南', value: 72},
                    {name: '马鞍山', value: 72},
                    {name: '宝鸡', value: 72},
                    {name: '焦作', value: 75},
                    {name: '句容', value: 75},
                    {name: '北京', value: 79},
                    {name: '徐州', value: 79},
                    {name: '衡水', value: 80},
                    {name: '包头', value: 80},
                    {name: '绵阳', value: 80},
                    {name: '乌鲁木齐', value: 84},
                    {name: '枣庄', value: 84},
                    {name: '杭州', value: 84},
                    {name: '淄博', value: 85},
                    {name: '鞍山', value: 86},
                    {name: '溧阳', value: 86},
                    {name: '库尔勒', value: 86},
                    {name: '安阳', value: 90},
                    {name: '开封', value: 90},
                    {name: '济南', value: 92},
                    {name: '德阳', value: 93},
                    {name: '温州', value: 95},
                    {name: '九江', value: 96},
                    {name: '邯郸', value: 98},
                    {name: '临安', value: 99},
                    {name: '兰州', value: 99},
                    {name: '沧州', value: 100},
                    {name: '临沂', value: 103},
                    {name: '南充', value: 104},
                    {name: '天津', value: 105},
                    {name: '富阳', value: 106},
                    {name: '泰安', value: 112},
                    {name: '诸暨', value: 112},
                    {name: '郑州', value: 113},
                    {name: '哈尔滨', value: 114},
                    {name: '聊城', value: 116},
                    {name: '芜湖', value: 117},
                    {name: '唐山', value: 119},
                    {name: '平顶山', value: 119},
                    {name: '邢台', value: 119},
                    {name: '德州', value: 120},
                    {name: '济宁', value: 120},
                    {name: '荆州', value: 127},
                    {name: '宜昌', value: 130},
                    {name: '义乌', value: 132},
                    {name: '丽水', value: 133},
                    {name: '洛阳', value: 134},
                    {name: '秦皇岛', value: 136},
                    {name: '株洲', value: 143},
                    {name: '石家庄', value: 147},
                    {name: '莱芜', value: 148},
                    {name: '常德', value: 152},
                    {name: '保定', value: 153},
                    {name: '湘潭', value: 154},
                    {name: '金华', value: 157},
                    {name: '岳阳', value: 169},
                    {name: '长沙', value: 175},
                    {name: '衢州', value: 177},
                    {name: '廊坊', value: 193},
                    {name: '菏泽', value: 194},
                    {name: '合肥', value: 229},
                    {name: '武汉', value: 273},
                    {name: '大庆', value: 279}
                ];
                var geoCoordMap = {
                    '海门':[121.15,31.89],
                    '鄂尔多斯':[109.781327,39.608266],
                    '招远':[120.38,37.35],
                    '舟山':[122.207216,29.985295],
                    '齐齐哈尔':[123.97,47.33],
                    '盐城':[120.13,33.38],
                    '赤峰':[118.87,42.28],
                    '青岛':[120.33,36.07],
                    '乳山':[121.52,36.89],
                    '金昌':[102.188043,38.520089],
                    '泉州':[118.58,24.93],
                    '莱西':[120.53,36.86],
                    '日照':[119.46,35.42],
                    '胶南':[119.97,35.88],
                    '南通':[121.05,32.08],
                    '拉萨':[91.11,29.97],
                    '云浮':[112.02,22.93],
                    '梅州':[116.1,24.55],
                    '文登':[122.05,37.2],
                    '上海':[121.48,31.22],
                    '攀枝花':[101.718637,26.582347],
                    '威海':[122.1,37.5],
                    '承德':[117.93,40.97],
                    '厦门':[118.1,24.46],
                    '汕尾':[115.375279,22.786211],
                    '潮州':[116.63,23.68],
                    '丹东':[124.37,40.13],
                    '太仓':[121.1,31.45],
                    '曲靖':[103.79,25.51],
                    '烟台':[121.39,37.52],
                    '福州':[119.3,26.08],
                    '瓦房店':[121.979603,39.627114],
                    '即墨':[120.45,36.38],
                    '抚顺':[123.97,41.97],
                    '玉溪':[102.52,24.35],
                    '张家口':[114.87,40.82],
                    '阳泉':[113.57,37.85],
                    '莱州':[119.942327,37.177017],
                    '湖州':[120.1,30.86],
                    '汕头':[116.69,23.39],
                    '昆山':[120.95,31.39],
                    '宁波':[121.56,29.86],
                    '湛江':[110.359377,21.270708],
                    '揭阳':[116.35,23.55],
                    '荣成':[122.41,37.16],
                    '连云港':[119.16,34.59],
                    '葫芦岛':[120.836932,40.711052],
                    '常熟':[120.74,31.64],
                    '东莞':[113.75,23.04],
                    '河源':[114.68,23.73],
                    '淮安':[119.15,33.5],
                    '泰州':[119.9,32.49],
                    '南宁':[108.33,22.84],
                    '营口':[122.18,40.65],
                    '惠州':[114.4,23.09],
                    '江阴':[120.26,31.91],
                    '蓬莱':[120.75,37.8],
                    '韶关':[113.62,24.84],
                    '嘉峪关':[98.289152,39.77313],
                    '广州':[113.23,23.16],
                    '延安':[109.47,36.6],
                    '太原':[112.53,37.87],
                    '清远':[113.01,23.7],
                    '中山':[113.38,22.52],
                    '昆明':[102.73,25.04],
                    '寿光':[118.73,36.86],
                    '盘锦':[122.070714,41.119997],
                    '长治':[113.08,36.18],
                    '深圳':[114.07,22.62],
                    '珠海':[113.52,22.3],
                    '宿迁':[118.3,33.96],
                    '咸阳':[108.72,34.36],
                    '铜川':[109.11,35.09],
                    '平度':[119.97,36.77],
                    '佛山':[113.11,23.05],
                    '海口':[110.35,20.02],
                    '江门':[113.06,22.61],
                    '章丘':[117.53,36.72],
                    '肇庆':[112.44,23.05],
                    '大连':[121.62,38.92],
                    '临汾':[111.5,36.08],
                    '吴江':[120.63,31.16],
                    '石嘴山':[106.39,39.04],
                    '沈阳':[123.38,41.8],
                    '苏州':[120.62,31.32],
                    '茂名':[110.88,21.68],
                    '嘉兴':[120.76,30.77],
                    '长春':[125.35,43.88],
                    '胶州':[120.03336,36.264622],
                    '银川':[106.27,38.47],
                    '张家港':[120.555821,31.875428],
                    '三门峡':[111.19,34.76],
                    '锦州':[121.15,41.13],
                    '南昌':[115.89,28.68],
                    '柳州':[109.4,24.33],
                    '三亚':[109.511909,18.252847],
                    '自贡':[104.778442,29.33903],
                    '吉林':[126.57,43.87],
                    '阳江':[111.95,21.85],
                    '泸州':[105.39,28.91],
                    '西宁':[101.74,36.56],
                    '宜宾':[104.56,29.77],
                    '呼和浩特':[111.65,40.82],
                    '成都':[104.06,30.67],
                    '大同':[113.3,40.12],
                    '镇江':[119.44,32.2],
                    '桂林':[110.28,25.29],
                    '张家界':[110.479191,29.117096],
                    '宜兴':[119.82,31.36],
                    '北海':[109.12,21.49],
                    '西安':[108.95,34.27],
                    '金坛':[119.56,31.74],
                    '东营':[118.49,37.46],
                    '牡丹江':[129.58,44.6],
                    '遵义':[106.9,27.7],
                    '绍兴':[120.58,30.01],
                    '扬州':[119.42,32.39],
                    '常州':[119.95,31.79],
                    '潍坊':[119.1,36.62],
                    '重庆':[106.54,29.59],
                    '台州':[121.420757,28.656386],
                    '南京':[118.78,32.04],
                    '滨州':[118.03,37.36],
                    '贵阳':[106.71,26.57],
                    '无锡':[120.29,31.59],
                    '本溪':[123.73,41.3],
                    '克拉玛依':[84.77,45.59],
                    '渭南':[109.5,34.52],
                    '马鞍山':[118.48,31.56],
                    '宝鸡':[107.15,34.38],
                    '焦作':[113.21,35.24],
                    '句容':[119.16,31.95],
                    '北京':[116.46,39.92],
                    '徐州':[117.2,34.26],
                    '衡水':[115.72,37.72],
                    '包头':[110,40.58],
                    '绵阳':[104.73,31.48],
                    '乌鲁木齐':[87.68,43.77],
                    '枣庄':[117.57,34.86],
                    '杭州':[120.19,30.26],
                    '淄博':[118.05,36.78],
                    '鞍山':[122.85,41.12],
                    '溧阳':[119.48,31.43],
                    '库尔勒':[86.06,41.68],
                    '安阳':[114.35,36.1],
                    '开封':[114.35,34.79],
                    '济南':[117,36.65],
                    '德阳':[104.37,31.13],
                    '温州':[120.65,28.01],
                    '九江':[115.97,29.71],
                    '邯郸':[114.47,36.6],
                    '临安':[119.72,30.23],
                    '兰州':[103.73,36.03],
                    '沧州':[116.83,38.33],
                    '临沂':[118.35,35.05],
                    '南充':[106.110698,30.837793],
                    '天津':[117.2,39.13],
                    '富阳':[119.95,30.07],
                    '泰安':[117.13,36.18],
                    '诸暨':[120.23,29.71],
                    '郑州':[113.65,34.76],
                    '哈尔滨':[126.63,45.75],
                    '聊城':[115.97,36.45],
                    '芜湖':[118.38,31.33],
                    '唐山':[118.02,39.63],
                    '平顶山':[113.29,33.75],
                    '邢台':[114.48,37.05],
                    '德州':[116.29,37.45],
                    '济宁':[116.59,35.38],
                    '荆州':[112.239741,30.335165],
                    '宜昌':[111.3,30.7],
                    '义乌':[120.06,29.32],
                    '丽水':[119.92,28.45],
                    '洛阳':[112.44,34.7],
                    '秦皇岛':[119.57,39.95],
                    '株洲':[113.16,27.83],
                    '石家庄':[114.48,38.03],
                    '莱芜':[117.67,36.19],
                    '常德':[111.69,29.05],
                    '保定':[115.48,38.85],
                    '湘潭':[112.91,27.87],
                    '金华':[119.64,29.12],
                    '岳阳':[113.09,29.37],
                    '长沙':[113,28.21],
                    '衢州':[118.88,28.97],
                    '廊坊':[116.7,39.53],
                    '菏泽':[115.480656,35.23375],
                    '合肥':[117.27,31.86],
                    '武汉':[114.31,30.52],
                    '大庆':[125.03,46.58]
                };

                var convertData = function (data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var geoCoord = geoCoordMap[data[i].name];
                        if (geoCoord) {
                            res.push({
                                name: data[i].name,
                                value: geoCoord.concat(data[i].value)
                            });
                        }
                    }
                    return res;
                };

                let option4 = {
                    backgroundColor: '#404a59',
                    title: {
                        text: '全国主要城市空气质量',
                        subtext: 'data from PM25.in',
                        sublink: 'http://www.pm25.in',
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        y: 'bottom',
                        x:'right',
                        data:['pm2.5'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    geo: {
                        map: 'china',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#323c48',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    },
                    series : [
                        {
                            name: 'pm2.5',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertData(data4),
                            symbolSize: function (val) {
                                return val[2] / 10;
                            },
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ddb926'
                                }
                            }
                        },
                        {
                            name: 'Top 5',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: convertData(data4.sort(function (a, b) {
                                return b.value - a.value;
                            }).slice(0, 6)),
                            symbolSize: function (val) {
                                return val[2] / 10;
                            },
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#f4e925',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                }
                            },
                            zlevel: 1
                        }
                    ]
                };
                my4.setOption(option4);


                let my5 = echarts.init(document.getElementById('bbbb'));
                function randomData2() {
                    return Math.round(Math.random()*1000);
                }

                let option5 = {
                    title: {
                        text: 'iphone销量',
                        subtext: '纯属虚构',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data:['iphone3','iphone4','iphone5']
                    },
                    visualMap: {
                        min: 0,
                        max: 2500,
                        left: 'left',
                        top: 'bottom',
                        text: ['高','低'],           // 文本，默认为数值文本
                        calculable: true
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            dataView: {readOnly: false},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    series: [
                        {
                            name: 'iphone3',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:[
                                {name: '北京',value: randomData2() },
                                {name: '天津',value: randomData2() },
                                {name: '上海',value: randomData2() },
                                {name: '重庆',value: randomData2() },
                                {name: '河北',value: randomData2() },
                                {name: '河南',value: randomData2() },
                                {name: '云南',value: randomData2() },
                                {name: '辽宁',value: randomData2() },
                                {name: '黑龙江',value: randomData2() },
                                {name: '湖南',value: randomData2() },
                                {name: '安徽',value: randomData2() },
                                {name: '山东',value: randomData2() },
                                {name: '新疆',value: randomData2() },
                                {name: '江苏',value: randomData2() },
                                {name: '浙江',value: randomData2() },
                                {name: '江西',value: randomData2() },
                                {name: '湖北',value: randomData2() },
                                {name: '广西',value: randomData2() },
                                {name: '甘肃',value: randomData2() },
                                {name: '山西',value: randomData2() },
                                {name: '内蒙古',value: randomData2() },
                                {name: '陕西',value: randomData2() },
                                {name: '吉林',value: randomData2() },
                                {name: '福建',value: randomData2() },
                                {name: '贵州',value: randomData2() },
                                {name: '广东',value: randomData2() },
                                {name: '青海',value: randomData2() },
                                {name: '西藏',value: randomData2() },
                                {name: '四川',value: randomData2() },
                                {name: '宁夏',value: randomData2() },
                                {name: '海南',value: randomData2() },
                                {name: '台湾',value: randomData2() },
                                {name: '香港',value: randomData2() },
                                {name: '澳门',value: randomData2() }
                            ]
                        },
                        {
                            name: 'iphone4',
                            type: 'map',
                            mapType: 'china',
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:[
                                {name: '北京',value: randomData2() },
                                {name: '天津',value: randomData2() },
                                {name: '上海',value: randomData2() },
                                {name: '重庆',value: randomData2() },
                                {name: '河北',value: randomData2() },
                                {name: '安徽',value: randomData2() },
                                {name: '新疆',value: randomData2() },
                                {name: '浙江',value: randomData2() },
                                {name: '江西',value: randomData2() },
                                {name: '山西',value: randomData2() },
                                {name: '内蒙古',value: randomData2() },
                                {name: '吉林',value: randomData2() },
                                {name: '福建',value: randomData2() },
                                {name: '广东',value: randomData2() },
                                {name: '西藏',value: randomData2() },
                                {name: '四川',value: randomData2() },
                                {name: '宁夏',value: randomData2() },
                                {name: '香港',value: randomData2() },
                                {name: '澳门',value: randomData2() }
                            ]
                        },
                        {
                            name: 'iphone5',
                            type: 'map',
                            mapType: 'china',
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:[
                                {name: '北京',value: randomData2() },
                                {name: '天津',value: randomData2() },
                                {name: '上海',value: randomData2() },
                                {name: '广东',value: randomData2() },
                                {name: '台湾',value: randomData2() },
                                {name: '香港',value: randomData2() },
                                {name: '澳门',value: randomData2() }
                            ]
                        }
                    ]
                };
                my5.setOption(option5);

                var my6 = echarts.init(document.getElementById('cccc'));

                let option6 = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
                    },
                    series: [
                        {
                            name:'访问来源',
                            type:'pie',
                            selectedMode: 'single',
                            radius: [0, '30%'],

                            label: {
                                normal: {
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:335, name:'直达', selected:true},
                                {value:679, name:'营销广告'},
                                {value:1548, name:'搜索引擎'}
                            ]
                        },
                        {
                            name:'访问来源',
                            type:'pie',
                            radius: ['40%', '55%'],

                            data:[
                                {value:335, name:'直达'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1048, name:'百度'},
                                {value:251, name:'谷歌'},
                                {value:147, name:'必应'},
                                {value:102, name:'其他'}
                            ]
                        }
                    ]
                };
                my6.setOption(option6);
                this.active = true;
            }
        },
        mounted(){


        },
        data(){
            return {
                detail:"",
                textarea:"",
                active:false,
                show:true,
                format:[],
                url:'/sku-map/query',
                option:"",
                isDrag:false,
                options:[
                    {label:11,value:11},
                    {label:22,value:22},
                    {label:33,value:33},
                ]

            };
        },
        refresh(){
            console.log('refresh');
        },
        methods:{
            format_click(){
                this.format.push(100);
                console.log('format');
            },
            showhidden_click(){
                this.show = !this.show;
            },
            change_drag(){
             this.isDrag=true
            },
            creatsd(){
                this.textarea=this.textarea.replace(/(\n)/g, ',')
                this.detail=this.textarea.split(",")
            }
        },
        props:{
            query:{}
        },
        components: {
            pageDialog,
            dropList,
            dropItem,
            userInfo,
            formFilter,
            selectQuery,
            chinaAddress,
            testSlot:require('./test-slot.vue').default,
            tabs:require('../components/tabs.vue').default,
            tabHead:require('../components/tab-head'),
            htmlEditor:require('../components/html-editor.vue').default,
            tabItem:require('../components/tab-item'),
            tree:require('../components/tree'),
            uiInput:require('../components/ui-input.vue').default,
            uiSvg:require('../components/ui-svg.vue').default,
            imageUpload:require('../components/image-upload.vue').default,
            inputFormat:require('../components/input-format.vue').default,
            skuSelect:require('../components/sku-select.vue').default,
            uiTable:require('../components/ui-table.vue').default,
            uimuiSelect:require('../components/uimui-select.vue').default,
            uiTips:require('../components/ui-tips.vue').default,
            uiDrag:require('../components/ui-drag.vue').default,
            uiSelect:require('../components/ui-select.vue').default,
        }
    }
</script>
