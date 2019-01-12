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
                path: '/pdf-preview',
                component: () => import('@/components/pdf-preview'),
                title: 'PDF预览', type: 1
            },
            {
                path: '/amazon-account-management',
                component: () => import('@/view/report/account-monitor-amazon'),
                title: '亚马逊账号管理', type: 1
            },
            {
                path: '/warehouse/report/picking',
                component: () => import('@/view/entrepot/warehouse-reports/picking-report/index.vue'),
                title: '仓库管理',type: 1
            },
            {
                path: '/package-return',
                component: () => import('../view/entrepot/package-return/index.vue'),
                title: '包裹回退', type: 1
            },
            {
                path: '/servers',
                component: () => import('../view/base/server-management/index.vue'),
                title: '服务管理', type: 1
            }
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
                path: '/shipped',
                component: () => import('../view/warehouse/dataStatistics/unshipped.vue'),
                type: 1, title: '未发货记录测试'
            },
            {
                path: '/cardboard',
                component: () => import('../view/entrepot/package/cardboard/index.vue'),
                type: 1, title: '拆包异常列表'
            },
            {
                path: '/components/test',
                component: () => import('@/view/lxy/components'),
                type: 1, title: '组件测试'
            },
            {
                path: '/warehouse/shipped',
                component: () => import('../view/entrepot/warehouse-data/unshipped.vue'),
                type: 1, title: '未发货记录'
            },
            {
                path: '/pulish-by-shelf',
                component: () => import('../view/report/publish-statistics/published-on/index.vue'),
                type: 1, title: '刊登上架spu'
            },
            {
                path: '/publish-by-picking',
                component: () => import('../view/report/publish-statistics/published-off/index.vue'),
                type: 1, title: '刊登下架spu'
            },
            {
                path: '/report/export-files',
                component: () => import('../view/report/export-manage/index.vue'),
                type:　1, title: '导出管理列表'
            }
        ]
    }
];
