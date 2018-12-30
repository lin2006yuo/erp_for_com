/**
 * Created by wcg on 16-10-9.
 */
/**
 * copyright by lxy on 18-12-30
 * @param type 1没有子菜单，0有子菜单
 */
export default [
    {path:'/',component: () => import('./../Router.vue'),title: '测试',type: 0,
        children: [
            {
                path: '/account-basics',
                component: () => import('../view/base/account-information/index.vue'),
                type: 1, title: '用户信息'
            },
            {
                path: '/lxy',
                component: () => import('@/view/lxy'),
                type: 1, title: '林学裕'
            },
            { path: '/login', component: () => import('@/view/login'),title: '登录',type: 1,index:'123'},
            { path: '/test', component: () => import('@/view/test'),title: '测试',type: 1},
            { path: '/delivery-check/single-box/single-sku',
                component: () => import('./../view/entrepot/delivery-check/single-box/single-sku/single-sku.vue'),
                title: '单品SKU',type: 1},
            { path: '/delivery-check/twice-sorting',
                component: () => import('@/view/entrepot/delivery-check/twice-sorting/index.vue'),
                title: '双倍排序',type: 1
            },
            { path: '/pdf-preview',
                component: () => import('@/components/pdf-preview'),
                title: 'PDF预览',type: 1
            },
        ]
    }
];
