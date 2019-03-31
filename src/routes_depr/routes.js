/**
 * Created by wcg on 16-10-9.
 */
/**
 * copyright by lxy on 18-12-30
 * @param type 1没有子菜单，0有子菜单
 */
export default [
    {
        path: '/', component: () => import('./../Router.vue'), title: '测试', type: 0,
        children: [
            {
                path: '/account-basics',
                component: () => import('../view/base/account-information/index.vue'),
                type: 1, title: '用户信息'
            },
            { path: '/login', component: () => import('@/view/login'), title: '登录', type: 1, index: '123' },
            { path: '/test', component: () => import('@/view/test'), title: '测试', type: 1 },
            // { path: '/login', component: () => import('@/view/login'),title: '登录',type: 1,index:'123'},
            { path: '/test', component: () => import('@/view/test'),title: '测试',type: 1},
            { path: '/delivery-check/single-box/single-sku',

                component: () => import('./../view/entrepot/delivery-check/single-box/single-sku/single-sku.vue'),
                title: '单品SKU', type: 1
            },
            {
                path: '/delivery-check/twice-sorting',
                component: () => import('@/view/entrepot/delivery-check/twice-sorting/index.vue'),
                title: '双倍排序', type: 1
            },
            {
                path: '/test/array',
                component: () => import('@/test/array.vue'),
                title: 'Vue数组响应', type: 1
            },
            // {
            //     path: '/pdf-preview',
            //     component: () => import('@/components/pdf-preview'),
            //     title: 'PDF预览', type: 1
            // },
            // {
            //     path: '/amazon-account-management',
            //     component: () => import('@/view/report/account-monitor-amazon'),
            //     title: '亚马逊账号管理', type: 1
            // },
            // {
            //     path: '/warehouse/report/picking',
            //     component: () => import('@/view/entrepot/warehouse-reports/picking-report/index.vue'),
            //     title: '仓库管理',type: 1
            // },
            // {
            //     path: '/package-return',
            //     component: () => import('../view/entrepot/package-return/index.vue'),
            //     title: '包裹回退', type: 1
            // },
            // {
            //     path: '/servers',
            //     component: () => import('../view/base/server-management/index.vue'),
            //     title: '服务管理', type: 1
            // }
        ]
    },
    {path: '/warehouse',component: () => import('./../Router.vue'),title: '仓库',type: 0,
        children: [
            {
                path: '/lab',
                component: () => import('@/view/lxy/lab'),
                type: 1, title: '实验室'
            },
            {
                path: '/carrier',
                component: () => import('../view/entrepot/setLogistics/index.vue'),
                type: 1, title: '物流设置'
            },
            {
                path: '/carrier2',
                component: () => import('../view/entrepot/setLogistics/index2.vue'),
                type: 1, title: '物流设置2'
            },
            {
                path: '/report/maintain-information',
                component: () => import('../view/entrepot/maintain-information/index.vue'),
                type:　1, title: '物流商包裹信息维护'
            },
            {
                path: '/report/price-comparsion',
                component: () => import('../view/entrepot/price-comparsion/index.vue'),
                type:　1, title: '报价对比表格'
            },
            {
                path: '/report/exceed',
                component: () => import('../view/entrepot/warehouse-data/exceed.vue'),
                type:　1, title: '超库零报表'
            },
            {
                // /report/sale-stock
                path: '/report/sale-stock',
                component: () => import('../view/report/stock-control/index.vue'),
                type:　1, title: '销售及库存管理'
            },
        ]
    },
    {path: '/report',component: () => import('./../Router.vue'),title: '报表',type: 0,
        children: [
            {
                path: '/inventory',
                component: () => import('@/view/report/inventory'),
                type: 1, title: ' 商品进销存'
            },
            {
                path: '/export',
                component: () => import('@/view/report/export-manage'),
                type: 1, title: '报表导出管理'
            },
            {
                path: '/report/goods-analysis',
                component: () => import('@/view/report/commodity-sales'),
                type: 1, title: '商品销量分析表'
            },
            {
                path: '/report/area-analysis',
                component: () => import('@/view/report/area-analysis'),
                type: 1, title: '区域销量分析'
            },
        ]
    }
];
