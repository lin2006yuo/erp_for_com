/**
 * Created by wuchuguang on 16-11-14.
 */
import Vue from 'vue';

export default {
    '/test': {
        realPath: '/test',
        component: Vue.component('test', function (resolve) {
            require(['../view/test.vue'], resolve);
        })
    },
    '/login': {
        component: Vue.component('login', function (resolve) {
            require(['../view/login.vue'], resolve);
        })
    },
    '/setting-printer': {
        component: Vue.component('setting-printer', function (resolve) {
            require(['../view/setting-printer.vue'], resolve);
        })
    },
    '/help': {
        component: Vue.component('help', function (resolve) {
            require(['../view/help.vue'], resolve);
        })
    },
    '/quit': {
        component: Vue.component('quit', function (resolve) {
            require(['../view/quit.vue'], resolve);
        })
    },
    '/modifypwd': {
        component: Vue.component('modifypwd', function (resolve) {
            require(['../view/modifypwd.vue'], resolve);
        })
    },

    '/dashboard-setting': {
        component: Vue.component('dashboard-setting', function (resolve) {
            require(['../view/dashboard-setting.vue'], resolve);
        })
    },
    '/dashboard': {
        component: Vue.component('dashboard', function (resolve) {
            require(['../view/dashboard.vue'], resolve);
        })
    },
    '/goodsdev': {  //product/develop
        component: Vue.component('product-develop', function (resolve) {
            require(['../view/mall/product/index.vue'], resolve);
        })
    },
    '/goods': {  //product/manager
        component: Vue.component('product-manager', function (resolve) {
            require(['../view/product/manager/index.vue'], resolve);
        })
    },
    '/goods-declare': {
        component: Vue.component('goods-declare', function (resolve) {
            require(['../view/product/goods-declare/index.vue'], resolve);
        })
    },

    '/goods-pre-dev': {
        component: Vue.component('goods-pre-dev', function (resolve) {
            require(['../view/product/plan-exploit/index.vue'], resolve)
        })
    },

    '/goods/import': {
        component: Vue.component('excel-update', function (resolve) {
            require(['../view/product/excel-update/index.vue'], resolve)
        })
    },

    '/categories': {  //product/classify
        component: Vue.component('classify', function (resolve) {
            require(['../view/product/classify/index.vue'], resolve);
        })
    },
    '/categories/purchaser': {
        component: Vue.component('sort-bind-purchasers', function (resolve) {
            require(['../view/product/sort-bind-purchasers/index.vue'], resolve)
        })
    },
    '/product/intro': {
        component: Vue.component('dashboard', function (resolve) {
            require(['../view/mall/new-intro-new/index.vue'], resolve);
        })
    },
    '/attributes': {  //product/attribute
        component: Vue.component('attribute', function (resolve) {
            require(['../view/product/attribute/index.vue'], resolve);
        })
    },
    '/brand': {//product/brand
        component: Vue.component('brand', function (resolve) {
            require(['../view/product/brand/index.vue'], resolve);
        })
    },
    '/unit': { //product/unit
        component: Vue.component('unit', function (resolve) {
            require(['../view/product/unit/index.vue'], resolve);
        })
    },
    '/packing': { ///product/pack
        component: Vue.component('pack', function (resolve) {
            require(['../view/product/pack/index.vue'], resolve);
        })
    },
    '/base/access': { //页面未写
        component: Vue.component('base-access', function (resolve) {
            require(['../view/base/access/index.vue'], resolve);
        })
    },
    '/sub-map': {
        component: Vue.component('sub-map', function (resolve) {
            require(['../view/base/classify-bind-buyer/index.vue'], resolve);
        })
    },
    '/user': { ///base/user
        component: Vue.component('base-user', function (resolve) {
            require(['../view/base/user/index.vue'], resolve);
        })
    },
    '/role': { ///base/role
        component: Vue.component('base-role', function (resolve) {
            require(['../view/base/role/index.vue'], resolve);
        })
    },
    '/base/taskManage': {  //未映射
        component: Vue.component('base-taskManage', function (resolve) {
            require(['../view/base/taskManage/index.vue'], resolve);
        })
    },
    '/task': { ///base/task
        component: Vue.component('base-task', function (resolve) {
            require(['../view/base/task/index.vue'], resolve);
        })
    },
    '/channel': { //平台管理
        component: Vue.component('base-channel', function (resolve) {
            require(['../view/base/platform-management/index.vue'], resolve);
        })
    },

    '/wish-shipping-rate': { // 定价规则 wish占比
        component: Vue.component('wish-ratio', function (resolve) {
            require(['../view/base/pricing-rules/wish-ratio/wish-ratio.vue'], resolve);
        })
    },
    '/wish-shipping-rate/weight-list': { // 定价规则 wish重量
        component: Vue.component('wish-weight', function (resolve) {
            require(['../view/base/pricing-rules/wish-weight/wish-weight.vue'], resolve);
        })
    },
    '/queue': { ///base/task
        component: Vue.component('base-queue', function (resolve) {
            require(['../view/base/queue/index.vue'], resolve);
        })
    },
    '/department': { ///base/department
        component: Vue.component('base-department', function (resolve) {
            require(['../view/base/department/index.vue'], resolve);
        })
    },
    '/config/site': { ///base/system/site
        component: Vue.component('base-system-site', function (resolve) {
            require(['../view/base/system/newSite/index.vue'], resolve);
        })
    },
    '/system-config': { ///base/config-params
        component: Vue.component('base-config-params', function (resolve) {
            require(['../view/base/config-params/index.vue'], resolve);
        })
    },
    '/config': {  ///base/system/custom-args
        component: Vue.component('base-system-custom-args', function (resolve) {
            require(['../view/base/system/custom-args/index.vue'], resolve);
        })
    },
    '/declare-rules': { ///base/parcel-declare-new
        component: Vue.component('base-parcel-declare-new', function (resolve) {
            require(['../view/base/parcel-declare-new/index.vue'], resolve);
        })
    },
    '/base/config/product': { // 未写页面
        component: Vue.component('base-config-product', function (resolve) {
            require(['../view/base/config/product/index.vue'], resolve);
        })
    },
    '/amazon-account': {  ///base/account/ymx
        component: Vue.component('base-account-ymx', function (resolve) {
            require(['../view/base/account/ymx/index.vue'], resolve);
        })
    },
    '/ali1688-account': {  //1688账号
        component: Vue.component('base-account-1688-accounts', function (resolve) {
            require(['../view/base/account/1688-accounts/index.vue'], resolve);
        })
    },
    '/wish-account': {  ///base/account/wish
        component: Vue.component('base-account-wish', function (resolve) {
            require(['../view/base/account/wish/index.vue'], resolve);
        })
    },
    '/ebay-account': {  ///base/account/ebay
        component: Vue.component('base-account-ebay', function (resolve) {
            require(['../view/base/account/ebay/index.vue'], resolve);
        })
    },
    '/lazada-account': {  ///base/account/lazada
        component: Vue.component('base-account-lazada', function (resolve) {
            require(['../view/base/account/lazada/index.vue'], resolve);
        })
    },
    '/paytm-account': {  ///base/account/paytm
        component: Vue.component('base-account-paytm', function (resolve) {
            require(['../view/base/account/paytm/index.vue'], resolve);
        })
    },
    '/cd-account': {
        component: Vue.component('cd-account', function (resolve) {
            require(['../view/base/account/cd-account/index.vue'], resolve);
        })
    },

    '/walmart-account': {  ///base/account/walmart
        component: Vue.component('base-account-walmart', function (resolve) {
            require(['../view/base/account/walmart/index.vue'], resolve);
        })
    },
    '/zoodmall-account': {  ///base/account/zoodmall
        component: Vue.component('base-account-zoodmall', function (resolve) {
            require(['../view/base/account/zoodmall/index.vue'], resolve);
        })
    },
    '/vova-account': {  ///base/account/vova
        component: Vue.component('base-account-vova', function (resolve) {
            require(['../view/base/account/vova/index.vue'], resolve);
        })
    },
    '/pandao-account': {//MyMall账号
        component: Vue.component('base-account-my-mall', function (resolve) {
            require(['../view/base/account/my-mall/index.vue'], resolve);
        })
    },
    '/paypal-account': {  ///base/account/paypal
        component: Vue.component('base-account-paypal', function (resolve) {
            require(['../view/base/account/paypal/index.vue'], resolve);
        })
    },

    '/aliexpress-account': {  ///base/account/smt
        component: Vue.component('base-account-smt', function (resolve) {
            require(['../view/base/account/smt/index.vue'], resolve);
        })
    },
    '/joom-account': {  ///joom账号
        component: Vue.component('joom-account', function (resolve) {
            require(['../view/base/account/joom/index.vue'], resolve);
        })
    },
    '/jumia-account': {  ///joom账号
        component: Vue.component('jumia-account', function (resolve) {
            require(['../view/base/account/jumia-account/index.vue'], resolve);
        })
    },
    '/joom-shop': {  ///base/account/joom joom店铺
        component: Vue.component('joom-shop', function (resolve) {
            require(['../view/base/account/joom-shop/index.vue'], resolve);
        })
    },
    '/account-basics': {  ///base/account-information
        component: Vue.component('base-account-information', function (resolve) {
            require(['../view/base/account-information/index.vue'], resolve);
        })
    },
    '/account-apply': {  ///base/account-information
        component: Vue.component('base-account-information', function (resolve) {
            require(['../view/base/account-apply/index.vue'], resolve);
        })
    },
    '/company-info': {  ///base/公司资料
        component: Vue.component('company-information', function (resolve) {
            require(['../view/base/company-information/index.vue'], resolve);
        })

    },
    '/currency': {  ///base/config/rate
        component: Vue.component('base-config-rate', function (resolve) {
            require(['../view/base/config/rate/index.vue'], resolve);
        })
    },
    //平台自动登录
    '/channel-node': {
        component: Vue.component('base-platform-automatic-login', function (resolve) {
            require(['../view/base/platform-automatic-login/index.vue'], resolve)
        })
    },

    '/servers': { ///base/server-management/index
        component: Vue.component('base-config-rate', function (resolve) {
            require(['../view/base/server-management/index.vue'], resolve);
        })
    },
    '/software': {
        component: Vue.component('software', function (resolve) {
            require(['../view/base/software-management/index.vue'], resolve);
        })
    },
    '/report/amazon-settlement/summary':{
        component:Vue.component('financial-management-store-capital-accounting-amazon',function(resolve){
            require(['../view/financial-management/store-capital-accounting/amazon/index.vue'],resolve)
        })
    },
    '/wish-settlement/index_settle':{
        component:Vue.component('store-capital-accounting-wish-account',function (resolve) {
            require(['../view/financial-management/store-capital-accounting/wish/index.vue'],resolve)
        })
    },
     '/server-network':{
        component:Vue.component('base-server-usage-record',function (resolve) {
            require(['../view/base/server-usage-record/index.vue'],resolve)
        })
     },
    //服务器软件管理
    '/server-software':{
        component:Vue.component('server-software',(resolve)=> {
            require(['../view/base/server-software/index.vue'],resolve)
        })
    },

    '/server-logs': { ///base/server-log/index
        component: Vue.component('base-config-rate', function (resolve) {
            require(['../view/base/server-log/index.vue'], resolve);
        })
    },

    '/pricing-rules': {
        component: Vue.component('base-publish-rules', function (resolve) {
            require(['../view/base/publish-rules/index.vue'], resolve);
        })
    },

    '/rules': {  ///base/order-rule/rate
        component: Vue.component('base-order-rule', function (resolve) {
            require(['../view/base/order-rule/index.vue'], resolve);
        })
    },
    '/purchase-rules': {  ///base/plan-rule/rate
        component: Vue.component('base-plan-rule', function (resolve) {
            require(['../view/base/plan-rule/index.vue'], resolve);
        })
    },
    '/base/entrepot/sort-goods': {  //未调用接口
        component: Vue.component('base-entrepot-sort-goods', function (resolve) {
            require(['../view/base/entrepot/sort-goods.vue'], resolve);
        })
    },
    '/invoices': { ///base/invoice/invoice-record
        component: Vue.component('base-invoice-invoice-record', function (resolve) {
            require(['../view/base/invoice/invoice-record/index.vue'], resolve);
        })
    },
    '/invoice-rules': {  ///base/invoice/invoice-rules
        component: Vue.component('base-invoice-invoice-rules', function (resolve) {
            require(['../view/base/invoice/invoice-rules/index.vue'], resolve);
        })
    },
    '/developers': { ///base/product-class-setting
        component: Vue.component('product-class-setting', function (resolve) {
            require(['../view/base/product-class-setting/index.vue'], resolve);
        })
    },
    '/ebay-orders': { ///order/ebay/published-records
        component: Vue.component('order-ebay-list', function (resolve) {
            require(['../view/order/ebay/list/index.vue'], resolve);
        })
    },
    '/pdd-account': {//拼多多
        component: Vue.component('pinduoduo', function (resolve) {
            require(['../view/base/account/pinduoduo/index.vue'], resolve)
        })
    },
    '/yandex-account': {
        component: Vue.component('yandex', function (resolve) {
            require(['../view/base/account/yandex/index.vue'], resolve)
        })
    },
    '/umka-account': {
        component: Vue.component('umka', function (resolve) {
            require(['../view/base/account/umka/index.vue'], resolve)
        })
    },
    '/zoodmall-orders': {
        component: Vue.component('zood-mall', function (resolve) {
            require(['../view/order/zood-mall/index.vue'], resolve)
        })
    },
    '/Publish/EbayCommon/getCommonModeList': {
        component: Vue.component('Publish-EbayCommon-getCommonModeList', function (resolve) {
            require(['../view/kandeng/ebay/public-module/index.vue'], resolve);
        })
    },
    '/Publish/EbayCommon/getCombList': {
        component: Vue.component('Publish-EbayCommon-getCombList', function (resolve) {
            require(['../view/kandeng/ebay/model-cmb/index.vue'], resolve);
        })
    },
    '/Publish/EbayListing/listingManagement': {
        component: Vue.component('Publish-EbayListing-listingManagement', function (resolve) {
            require(['../view/kandeng/ebay/kandeng-list/index.vue'], resolve);
        })
    },
    '/publish/ebay/titles': {
        component: Vue.component('publish-ebay-titles', function (resolve) {
            require(['../view/kandeng/ebay/ebay-title/index.vue'], resolve);
        })
    },
    '/add-listing': {///kandeng/ebay/add-listing
        realPath: '/add-listing',
        component: Vue.component('add-listing', function (resolve) {
            require(['../view/kandeng/ebay/kandeng-list/add-edit-listing/add-listing.vue'], resolve);
        })
    },
    '/show-message': {
        component: Vue.component('show-message', function (resolve) {
            require(['../view/kandeng/ebay/kandeng-list/add-edit-listing/show-message.vue'], resolve);
        })
    },
    //商店分类管理   暂无接口
    '/store-category': {
        component: Vue.component('store-category', function (resolve) {
            require(['../view/kandeng/ebay/store-category/index.vue'], resolve);
        })
    },
    //刊登风格
    '/Publish/EbayCommon/getStyleList': {
        component: Vue.component('Publish-EbayCommon-getStyleList', function (resolve) {
            require(['../view/kandeng/ebay/kandeng-style/index.vue'], resolve);
        })
    },
    '/Publish/EbayCommon/getPromotionList': {
        component: Vue.component('Publish-EbayCommon-getPromotionList', function (resolve) {
            require(['../view/kandeng/ebay/promotion-set/index.vue'], resolve);
        })
    },
    '/Publish/EbayCommon/getCateList': {
        component: Vue.component('Publish-EbayCommon-getCateList', function (resolve) {
            require(['../view/kandeng/ebay/custom-definition/index.vue'], resolve);
        })
    },
    '/publish/wish/productList': {  ///kandeng/wish/published-records
        component: Vue.component('kandeng-wish-list', function (resolve) {
            require(['../view/kandeng/wish/list/index.vue'], resolve);
        })
    },
    '/publish/wish-express/lists': {
        component: Vue.component('kandeng-wish-we-model', function (resolve) {
            require(['../view/kandeng/wish/we-model/index.vue'], resolve);
        })
    },
    '/aliexpress-windows-list': {
        component: Vue.component('aliexpress-windows', function (resolve) {
            require(['../view/kandeng/aliexpress/windows/index.vue'], resolve);
        })
    },
    '/kandeng/wish/info': { //二级  未动
        component: Vue.component('kandeng-wish-info', function (resolve) {
            require(['../view/kandeng/wish/info/index.vue'], resolve);
        })
    },
    '/publish/express': {  ///kandeng/aliexpress/published-records
        component: Vue.component('kandeng-aliexpress-list', function (resolve) {
            require(['../view/kandeng/aliexpress/list/index.vue'], resolve);
        })
    },

    '/kandeng/aliexpress/info': { ///kandeng/aliexpress/info
        realPath: '/kandeng/aliexpress/info',
        component: Vue.component('kandeng-aliexpress-info', function (resolve) {
            require(['../view/kandeng/aliexpress/info/index.vue'], resolve);
        })
    },
    '/kandeng/aliexpress/preview': { ///kandeng/aliexpress/preview
        // realPath:'/kandeng/aliexpress/preview/:goods_id',
        component: Vue.component('kandeng-aliexpress-preview', function (resolve) {
            require(['../view/kandeng/aliexpress/info/preview.vue'], resolve);
        })
    },
    '/aliexpreee-category-map-list': { ///relevancy/aliexpress/published-records
        component: Vue.component('aliexpreee-category-map-list', function (resolve) {
            require(['../view/relevancy/aliexpress/list/index.vue'], resolve)
        })
    },
    '/aliexpress-product-template-list': {
        component: Vue.component('aliexpress-product-template-list', function (resolve) {
            require(['../view/relevancy/aliexpress/product-info'], resolve)
        })
    },
    '/aliexpress-order': { ///order/aliexpress/published-records
        component: Vue.component('order-aliexpress-list', function (resolve) {
            require(['../view/order/aliexpress/list/index.vue'], resolve);
        })
    },
    '/manual-orders': { ///order/handwork
        component: Vue.component('order-handwork', function (resolve) {
            require(['../view/order/handwork/index.vue'], resolve);
        })
    },
    '/amazon-orders': {  ///order/ymx/published-records
        component: Vue.component('order-ymx-list', function (resolve) {
            require(['../view/order/ymx/list/index.vue'], resolve);
        })
    },
    '/wish-orders': {  ///order/wish/published-records
        component: Vue.component('order-wish-list', function (resolve) {
            require(['../view/order/wish/list/index.vue'], resolve);
        })
    },
    '/fba-orders': { //order/fba/published-records
        component: Vue.component('order-fba-list', function (resolve) {
            require(['../view/order/fba-orders/index.vue'], resolve);
        })
    },
    '/fbp-orders': { //order/fbp/published-records
        component: Vue.component('order-fbp-list', function (resolve) {
            require(['../view/order/fbp-orders/index.vue'], resolve);
        })
    },
    '/orders-audit': { ///order/pending/info
        component: Vue.component('order-pending-info', function (resolve) {
            require(['../view/order/pending/index.vue'], resolve);
        })
    },
    '/brush-orders': {
        component: Vue.component('brush-orders-info', function (resolve) {
            require(['../view/order/brush/index.vue'], resolve);
        })
    },
    '/orders': { ///order/local
        component: Vue.component('order-local', function (resolve) {
            require(['../view/order/local/index.vue'], resolve);
        })
    },
    '/order/local/search': { ///order/local/search
        component: Vue.component('order-local-search', function (resolve) {
            require(['../view/order/local/search.vue'], resolve);
        })
    },
    '/paypal-orders': { ///order/paypal
        component: Vue.component('order-paypal', function (resolve) {
            require(['../view/order/paypal/index.vue'], resolve);
        })
    },
    '/packages': {
        component: Vue.component('packages', function (resolve) {
            require(['../view/order/parcel-list/index.vue'], resolve);
        })
    },
    //同步发货状态
    '/synchronizes': {///order/shipping-status
        component: Vue.component('synchronizes', function (resolve) {
            require(['../view/order/shipping-status/index.vue'], resolve);
        })
    },
    '/warehouse-goods': { ///entrepot/overseas
        component: Vue.component('warehouse-goods', function (resolve) {
            require(['../view/entrepot/warehouse-goods/index.vue'], resolve);
        })
    },
    '/warehouse-goods/overseas': {
        component: Vue.component('warehouse-goods', function (resolve) {
            require(['../view/entrepot/warehouse-goods/overseas-stock/index.vue'], resolve);
        })
    },
    '/warehouse-goods/fba': {
        component: Vue.component('warehouse-goods-fba', function (resolve) {
            require(['../view/entrepot/warehouse-goods/fba-stock/index.vue'], resolve);
        })
    },
    '/warehouse-goods/local': {
        component: Vue.component('warehouse-goods', function (resolve) {
            require(['../view/entrepot/warehouse-goods/local/index.vue'], resolve);
        })
    },
    '/warehouse-goods/third': {
        component: Vue.component('warehouse-goods', function (resolve) {
            require(['../view/entrepot/warehouse-goods/third/index' +
            '.vue'], resolve);
        })
    },
    '/stocking/apply-list': {
        component: Vue.component('stocking-apply-list', function (resolve) {
            require(['../view/entrepot/stocking/apply-list/index.vue'], resolve);
        })
    },
    '/stocking': {
        component: Vue.component('stocking-apply-list', function (resolve) {
            require(['../view/entrepot/stocking/plan/index.vue'], resolve);
        })
    },
    '/warehouse': { ///entrepot/storeManagementNew
        component: Vue.component('entrepot-storeManagementNew', function (resolve) {
            require(['../view/entrepot/storeManagementNew/index.vue'], resolve);
        })
    },
    '/placeorder': { ///entrepot/shipment
        component: Vue.component('placeorder', function (resolve) {
            require(['../view/entrepot/placeorder/index.vue'], resolve);
        })
    },
    '/placeorder/third': { ///entrepot/shipment
        component: Vue.component('placeorder-third', function (resolve) {
            require(['../view/entrepot/placeorder-third/index.vue'], resolve);
        })
    },
    '/delivery': {  ///entrepot/picking
        component: Vue.component('delivery', function (resolve) {
            require(['../view/entrepot/delivery/index.vue'], resolve);
        })
    },
    '/carrier': { ///entrepot/setLogistics
        component: Vue.component('entrepot-setLogistics', function (resolve) {
            require(['../view/entrepot/setLogistics/index.vue'], resolve);
        })
    },
    '/stock-in': { ///entrepot/stock-in
        component: Vue.component("entrepot-stock-in", function (resolve) {
            require(['../view/entrepot/stock-in/index.vue'], resolve)
        })
    },
    '/stock-out': { ///entrepot/stock-out
        component: Vue.component("entrepot-stock-out", function (resolve) {
            require(['../view/entrepot/stock-out/index.vue'], resolve)
        })
    },
    '/warehouse-area': {
        component: Vue.component("warehouse-area", function (resolve) {
            require(['../view/entrepot/warehouse-area/index.vue'], resolve)
        })
    },
    '/warehouse-cargo': {
        component: Vue.component("entrepot-warehouse-cargo", function (resolve) {
            require(['../view/entrepot/warehouse-cargo/index.vue'], resolve)
        })
    },
    '/warehouse-cargo-class': {
        component: Vue.component("entrepot-warehouse-cargo-class", function (resolve) {
            require(['../view/entrepot/warehouse-cargo-class/index.vue'], resolve)
        })
    },
    '/warehouse-cargo-goods': {
        component: Vue.component("entrepot-warehouse-cargo-goods", function (resolve) {
            require(['../view/entrepot/warehouse-cargo-goods/index.vue'], resolve)
        })
    },
    '/warehouse-shelf': {
        component: Vue.component("entrepot-warehouse-shelf", function (resolve) {
            require(['../view/entrepot/warehouse-shelf/index.vue'], resolve)
        })
    },
    '/entrepot/sort-goods': {  //未动
        component: Vue.component('entrepot-sort-goods', function (resolve) {
            require(['../view/entrepot/sort-goods/index.vue'], resolve);
        })
    },
    '/pickings-exception/exception': {
        component: Vue.component('pickings-exception', function (resolve) {
            require(['../view/entrepot/pickings-exception/index.vue'], resolve)
        })
    },
    '/shipping-method/trial': { ///entrepot/freight-trial
        component: Vue.component('entrepot-freight-trial', function (resolve) {
            require(['../view/entrepot/freight-trial/index.vue'], resolve);
        })
    },
    '/orders/trial-rule': { ///entrepot/freight-trial
        component: Vue.component('orders-trial-rule', function (resolve) {
            require(['../view/entrepot/rule-try-run/index.vue'], resolve);
        })
    },
    '/system/menu': { ///system/menu
        component: Vue.component('system-menu', function (resolve) {
            require(['../view/system/menu/index.vue'], resolve);
        })
    },
    '/node': { ///system/mca-node     未对上接口？
        component: Vue.component('system-mca-node', function (resolve) {
            require(['../view/system/mca-node/index.vue'], resolve);
        })
    },
    '/tag': { ///product/tags
        component: Vue.component('product-tags', function (resolve) {
            require(['../view/product/tags/index.vue'], resolve);
        })
    },
    '/sku-map': {  ///product/goods_sku_map
        component: Vue.component('product-goods_sku_map', function (resolve) {
            require(['../view/product/goods_sku_map/index.vue'], resolve);
        })
    },
    '/supplier': { ///procurement/suppliers/assert-sup
        component: Vue.component('procurement-suppliers-assert-sup', function (resolve) {
            require(['../view/procurement/suppliers/assert-sup/index.vue'], resolve);
        })
    },
    '/supplier-offer': { ///procurement/suppliers/supplier-quote
        component: Vue.component('procurement-suppliers-supplier-quote', function (resolve) {
            require(['../view/procurement/suppliers/supplier-quote/index.vue'], resolve);
        })
    },
    '/purchase-order': { ///procurement/purchase
        component: Vue.component('procurement-purchase', function (resolve) {
            require(['../view/procurement/purchase/index.vue'], resolve);
        })
    },
    '/purchase-proposal': { ///procurement/purchasing
        component: Vue.component('procurement-purchasing', function (resolve) {
            require(['../view/procurement/purchasing/index.vue'], resolve);
        })
    },
    '/purchase-plan': { ///procurement/plan
        component: Vue.component('procurement-plan', function (resolve) {
            require(['../view/procurement/plan/index.vue'], resolve);
        })
    },
    '/safe': { ///procurement/delivery
        component: Vue.component('procurement-delivery', function (resolve) {
            require(['../view/procurement/delivery/index.vue'], resolve);
        })
    },
    '/purchase-apply': { ///procurement/payment
        component: Vue.component('procurement-payment', function (resolve) {
            require(['../view/procurement/payment/index.vue'], resolve);
        })
    },
    '/report/financial': { //   未动
        component: Vue.component('report-financial', function (resolve) {
            require(['../view/report/financial/index.vue'], resolve);
        })
    },
    '/report/financial/channel': {  ///report/financial/channel  未动
        component: Vue.component('report-financial-channel', function (resolve) {
            require(['../view/report/financial/channel.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/amazon': {  ///report/financial/channel-profit/Amazon 未动
        component: Vue.component('report-financial-amazon', function (resolve) {
            require(['../view/report/financial/amazon/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/joom': {  //报表系统joom订单利润明细
        component: Vue.component('report-financial-joom', function (resolve) {
            require(['../view/report/financial/joom/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/lazada': {  //报表系统lazada订单利润明细
        component: Vue.component('report-financial-lazada', function (resolve) {
            require(['../view/report/financial/lazada/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/shopee': {  //报表系统shopee订单利润明细
        component: Vue.component('report-financial-shopee', function (resolve) {
            require(['../view/report/financial/shopee/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/paytm': {  //报表系统paytm订单利润明细
        component: Vue.component('report-financial-paytm', function (resolve) {
            require(['../view/report/financial/paytm/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/walmart': {  //报表系统walmart订单利润明细
        component: Vue.component('report-financial-walmart', function (resolve) {
            require(['../view/report/financial/walmart/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/pandao': {  //报表系统mymall订单利润明细
        component: Vue.component('report-financial-pandao', function (resolve) {
            require(['../view/report/financial/mymall/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/jumia': {  //报表系统jumia订单利润明细
        component: Vue.component('report-financial-jumia', function (resolve) {
            require(['../view/report/financial/jumia/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/vova': {  //报表系统vova订单利润明细
        component: Vue.component('report-financial-vova', function (resolve) {
            require(['../view/report/financial/vova/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/umka': {  //报表系统umka订单利润明细
        component: Vue.component('report-financial-umka', function (resolve) {
            require(['../view/report/financial/umka/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/cd': {  //报表系统cd订单利润明细
        component: Vue.component('report-financial-cd', function (resolve) {
            require(['../view/report/financial/cd/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/newegg': {  //报表系统newegg订单利润明细
        component: Vue.component('report-financial-newegg', function (resolve) {
            require(['../view/report/financial/newegg/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/oberlo': {  //报表系统Oberlo订单利润明细
        component: Vue.component('report-financial-oberlo', function (resolve) {
            require(['../view/report/financial/oberlo/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/zoodmall': {  //报表系统Zoodmall订单利润明细
        component: Vue.component('report-financial-zoodmall', function (resolve) {
            require(['../view/report/financial/zoodmall/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/wish': {  ///report/financial/channel-profit/Wish 未动
        component: Vue.component('report-financial-wish', function (resolve) {
            require(['../view/report/financial/wish/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/ali-express': {  ///report/financial/channel-profit/AliExpress  未动
        component: Vue.component('report-financial-aliexpress', function (resolve) {
            require(['../view/report/financial/aliexpress/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement/fba': {  ///report/financial/channel-profit/AliExpress  未动
        component: Vue.component('report-financial-fba', function (resolve) {
            require(['../view/report/financial/fba/index.vue'], resolve);
        })
    },
    '/report/financial/profit-statement': {  ///report/financial/channel-profit/eBay  未动
        component: Vue.component('report-financial-ebay', function (resolve) {
            require(['../view/report/financial/ebay/index.vue'], resolve);
        })
    },
    '/report/export-files': {  ///report/financial/export-manage  未动
        component: Vue.component('report-financial-export-manage', function (resolve) {
            require(['../view/report/export-manage/index.vue'], resolve);
        })
    },
    '/report/financial/performance/amazon': {  ///report/financial/export-manage  未动
        component: Vue.component('report-financial-selling-profit-amazon', function (resolve) {
            require(['../view/report/selling-profit/amazon/index.vue'], resolve);
        })
    },
    '/report/financial/performance/ali': {  ///report/financial/export-manage  未动
        component: Vue.component('report-financial-selling-profit-aliexpress', function (resolve) {
            require(['../view/report/selling-profit/aliexpress/index.vue'], resolve);
        })
    },
    '/report/financial/performance/ebay': {  ///report/financial/export-manage  未动
        component: Vue.component('report-financial-selling-profit-ebay', function (resolve) {
            require(['../view/report/selling-profit/ebay/index.vue'], resolve);
        })
    },
    '/report/financial/performance/wish': {  ///report/financial/export-manage  未动
        component: Vue.component('report-financial-selling-profit-wish', function (resolve) {
            require(['../view/report/selling-profit/wish/index.vue'], resolve);
        })
    },
    '/report/financial/performance/fba': {  ///report/financial/export-manage  未动
        component: Vue.component('report-financial-selling-profit-fba', function (resolve) {
            require(['../view/report/selling-profit/fba/index.vue'], resolve);
        })
    },
    '/report/sale-stock': {  ///report/stock-control  未动
        component: Vue.component('report-stock-control', function (resolve) {
            require(['../view/report/stock-control/index.vue'], resolve);
        })
    },
    '/report/sale-refund': {  ///report/pin-back  未动
        component: Vue.component('report-pin-back', function (resolve) {
            require(['../view/report/pin-back/index.vue'], resolve);
        })
    },
    '/report/goods-analysis': {  ///report/commodity-sales  未动
        component: Vue.component('report-commodity-sales', function (resolve) {
            require(['../view/report/commodity-sales/index.vue'], resolve);
        })
    },
    '/report/order-details': {  ///report/order-details  未动
        component: Vue.component('report-order-details', function (resolve) {
            require(['../view/report/order-details/index.vue'], resolve);
        })
    },
    '/report/express-confirm': {  ///report/express-confirm  快递确清单
        component: Vue.component('report-delivery-list', function (resolve) {
            require(['../view/report/delivery-list/index.vue'], resolve);
        })
    },
    '/settlement/index_settle':{//放款账期放款比例
        component:Vue.component('report-loan-payment-days',function (resolve) {
            require(['../view/report/loan-payment-days/index'],resolve);
        })
    },
    '/publish-time-statistic': {  ///report/shelf-statistics  SPU上架时间统计
        component: Vue.component('report-shelf-statistics', function (resolve) {
            require(['../view/report/shelf-statistics/index.vue'], resolve);
        })
    },
    //  /sku/weightdiff
    '/goods-sku/diff-weight': {  //  sku重量差异
        component: Vue.component('sku-weight-diff', function (resolve) {
            require(['../view/report/sku-weight-diff/index.vue'], resolve);
        })
    },
    '/publish-statistic': {  ///publish-statistic  SPU刊登时间统计
        component: Vue.component('report-platform-statistics', function (resolve) {
            require(['../view/report/platform-statistics/index.vue'], resolve);
        })
    },
    '/report/publish-by-shelf': {//统计刊登上架spu列表
        component: Vue.component('report-publish-statistics-published-on', function (resolve) {
            require(['../view/report/publish-statistics/published-on/index.vue'], resolve)
        })
    },
    '/report/publish-by-picking': {//统计刊登下架spu列表
        component: Vue.component('report-publish-statistics-published-off', function (resolve) {
            require(['../view/report/publish-statistics/published-off/index.vue'], resolve)
        })
    },
    '/report/publish-by-shelf/spu':{
        component:Vue.component('report-publish-statistics-spu-published-statistics',function(resolve){
            require(['../view/report/publish-statistics/spu-published-statistics/index.vue'],resolve)
        })
    },
    '/report/customer-message': {  ///performance-service  客服业绩统计
        component: Vue.component('report-performance-service', function (resolve) {
            require(['../view/report/performance-service/index.vue'], resolve);
        })
    },
    /*成员管理*/
    '/monthly-target-department': {
        component: Vue.component('monthly-target-department', function (resolve) {
            require(['../view/report/target-configure/index.vue'], resolve);
        })
    },
    /*月度目标*/
    '/monthly-target-amount': {
        component: Vue.component('monthly-target-amount', function (resolve) {
            require(['../view/report/monthly-target-amount/index.vue'], resolve);
        })
    },
    /*spu月度目标*/
    '/develop-monthly-target-amount': {
        component: Vue.component('develop-monthly-target-amount', function (resolve) {
            require(['../view/report/develop-target/index.vue'], resolve);
        })
    },
    /*spu成员管理*/
    '/develop-monthly-target-department': {
        component: Vue.component('develop-monthly-target-department', function (resolve) {
            require(['../view/report/develop-target-department/index.vue'], resolve);
        })
    },
    '/first-order': {  ///first-order 首次出单SKU列表
        component: Vue.component('first-order', function (resolve) {
            require(['../view/report/first-order-sku-list/index.vue'], resolve);
        })
    },
    '/finance-purchase': {  ///finance/purchase/settlement
        component: Vue.component('finance-purchase-settlement', function (resolve) {
            require(['../view/finance/purchase-settlement/index.vue'], resolve);
        })
    },
    '/order-sales': { ///customer-service/after-sale
        component: Vue.component('customer-service-after-sale', function (resolve) {
            require(['../view/customer-service/after-sale/index.vue'], resolve)
        })
    },
    '/ali-evaluate': { //customer-service/smt-estimate
        component: Vue.component('customer-service-smt-estimate', function (resolve) {
            require(['../view/customer-service/smt-estimate/index.vue'], resolve)
        })
    },
    '/amazon/getFeedbacks': {//customer-service/ymx-estimate
        component: Vue.component('customer-service-ymx-estimate', function (resolve) {
            require(['../view/customer-service/ymx-estimate/index.vue'], resolve)
        })
    },
    '/ebay-feedback': {
        component: Vue.component('customer-service-eBay-estimate', function (resolve) {
            require(['../view/customer-service/eBay-estimate/index.vue'], resolve)
        })
    },
    '/ebay-message/getMessageList': {
        component: Vue.component('customer-service-station-letter-ebay-box', function (resolve) {
            require(['../view/customer-service/station-letter/ebay-box/index.vue'], resolve)
        })
    },
    '/ebay-message': {
        component: Vue.component('customer-service-station-letter-outbox', function (resolve) {
            require(['../view/customer-service/station-letter/inbox/index.vue'], resolve)
        })
    },
    '/ebay-message/getMessageList/outbox': {
        component: Vue.component('customer-service-station-letter-outbox', function (resolve) {
            require(['../view/customer-service/station-letter/outbox/index.vue'], resolve)
        })
    },
    '/ebay-message/getMessageList/write': {
        component: Vue.component('customer-service-station-letter-outbox', function (resolve) {
            require(['../view/customer-service/station-letter/write/index.vue'], resolve)
        })
    },
    '/aliexpress-msg': { ///customer-service/smt/inbox
        component: Vue.component('customer-service-smt-inbox', function (resolve) {
            require(['../view/customer-service/smt/inbox/index.vue'], resolve)
        })
    },
    '/ali-outbox': { ///customer-service/smt/outbox
        component: Vue.component('customer-service-smt-outbox', function (resolve) {
            require(['../view/customer-service/smt/outbox/index.vue'], resolve)
        })
    },
    '/msg-tpl': { ///customer-service/reply-template
        component: Vue.component('customer-service-reply-template', function (resolve) {
            require(['../view/customer-service/reply-template/index.vue'], resolve)
        })
    },
    '/message-transfer': { ///待处理站內信
        component: Vue.component('customer-service-message-transfer', function (resolve) {
            require(['../view/customer-service/pending-internal/index.vue'], resolve)
        })
    },
    '/message-transfer/record': { ///站内信转派记录
        component: Vue.component('customer-service-message-record', function (resolve) {
            require(['../view/customer-service/message-transfer/index.vue'], resolve)
        })
    },
    '/msg-rule': { ///customer-service/send-rules
        component: Vue.component('customer-service-send-rules', function (resolve) {
            require(['../view/customer-service/send-rules/index.vue'], resolve)
        })
    },
    '/ebay-dispute': { //'/customer-service/dispute/ebay
        component: Vue.component('customer-service-dispute-ebay', function (resolve) {
            require(['../view/customer-service/dispute/ebay/index.vue'], resolve)
        })
    },
    '/paypal-dispute': { //'/customer-service/dispute/paypal
        component: Vue.component('customer-service-dispute-paypal', function (resolve) {
            require(['../view/customer-service/dispute/paypal/index.vue'], resolve)
        })
    },
    '/shopee-dispute': { //'/customer-service/dispute/shopee
        component: Vue.component('customer-service-dispute-shopee', function (resolve) {
            require(['../view/customer-service/dispute/shopee/index.vue'], resolve)
        })
    },
    '/customer-service/dispute/wish': { ///customer-service/dispute/wish  未动
        component: Vue.component('customer-service-dispute-wish', function (resolve) {
            require(['../view/customer-service/dispute/wish/index.vue'], resolve)
        })
    },
    '/ali-issue': { ///customer-service/dispute/aliexpress
        component: Vue.component('customer-service-dispute-aliexpress', function (resolve) {
            require(['../view/customer-service/dispute/aliexpress/index.vue'], resolve)
        })
    },
    '/member-ship': {
        component: Vue.component('base-member-ship', function (resolve) {
            require(['../view/base/member-ship/index.vue'], resolve)
        })
    },
    '/purchase-parcels/createUpdateParcel': {
        component: Vue.component("purchase-parcels-createUpdateParcel", function (resolve) {
            require(["../view/entrepot/package/receive/index.vue"], resolve)
        })
    },
    '/purchase-parcels/getParcelList': {
        component: Vue.component("purchase-parcels-getParcelList", function (resolve) {
            require(["../view/entrepot/package/search/index.vue"], resolve)
        })
    },
    '/purchase-parcels/getParcelListForParcelSplitting': {
        component: Vue.component("purchase-parcels-getParcelListForParcelSplitting", function (resolve) {
            require(["../view/entrepot/package/arrival/index.vue"], resolve)
        })
    },
    '/label': {
        component: Vue.component("labels", function (resolve) {
            require(["../view/base/print/index.vue"], resolve)
        })
    },
    '/wish-health-data-list': {
        component: Vue.component("wish-health-data-list", function (resolve) {
            require(["../view/account-monitoring/wish-account/index.vue"], resolve)
        })
    },
    '/amazon-emails': {
        component: Vue.component("amazon-emails", function (resolve) {
            require(["../view/customer-service/ymx-letter/inbox/index.vue"], resolve)
        })
    },
    '/amazon-emails/sent-emails': {
        component: Vue.component("amazon-emails-sent-emails", function (resolve) {
            require(["../view/customer-service/ymx-letter/outbox/index.vue"], resolve)
        })
    },
    '/amazon-emails/sent-emails/send': {
        component: Vue.component("amazon-emails-sent-emails", function (resolve) {
            require(["../view/customer-service/ymx-letter/write/index.vue"], resolve)
        })
    },
    '/email-account': {
        component: Vue.component("amazon-emails-email-account", function (resolve) {
            require(["../view/customer-service/ymx-setting/index.vue"], resolve)
        })
    },
    '/Publish/EbayListing/getTimingRuleList': {
        component: Vue.component("timing-publish-rules", function (resolve) {
            require(["../view/kandeng/ebay/timing-publish-rules/index.vue"], resolve)
        })
    },
    '/buyers': {
        component: Vue.component("buyer", function (resolve) {
            require(["../view/base/buyer/index.vue"], resolve)
        })
    },
    '/release': {
        component: Vue.component("release", function (resolve) {
            require(["../view/base/release/index.vue"], resolve)
        })
    },
    '/virtual-order': {
        component: Vue.component("request-note", function (resolve) {
            require(["../view/virtual-order/request-note/index.vue"], resolve)
        })
    },
    '/virtual-refund': {
        component: Vue.component("virtual-refund", function (resolve) {
            require(["../view/virtual-order/brush-single-rebates/index.vue"], resolve)
        })
    },
    '/virtual-rules': {
        component: Vue.component("virtual-rules", function (resolve) {
            require(["../view/virtual-rules/index.vue"], resolve)
        })
    },
    '/virtual-order/user-list': {//----用户管理
        component: Vue.component("virtual-order", function (resolve) {
            require(["../view/virtual-order/user-management/index.vue"], resolve)
        })
    },
    '/virtual-order/mission-list': {
        component: Vue.component("virtual-order-mission-list", function (resolve) {
            require(["../view/virtual-order/click-farm-mission/index.vue"], resolve)
        })
    },
    '/virtual-hold': {
        component: Vue.component("order-number-management", function (resolve) {
            require(["../view/virtual-order/order-number-management/index.vue"], resolve)
        })
    },
    '/order-hold': {
        component: Vue.component("order-hold", function (resolve) {
            require(["../view/order/intercept/index.vue"], resolve)
        })
    },
    '/local-buyers': {
        component: Vue.component("buying-management", function (resolve) {
            require(["../view/virtual-order/buying-management/index.vue"], resolve)
        })
    },
    '/publish/amazon-product-export': {
        component: Vue.component('publish-amazon-product-export', function (resolve) {
            require(['../view/kandeng/amazon/amazon-plan-publish/publish-list.vue'], resolve)
        })
    },
    '/make-pickings': {
        component: Vue.component('view-entrepot-generate-order', function (resolve) {
            require(['../view/entrepot/make-picking/index.vue'], resolve)
        })
    },
    '/sorting-shelf': {
        component: Vue.component('view-entrepot-sorting-shelf', function (resolve) {
            require(['../view/entrepot/sorting-shelf/index.vue'], resolve)
        })
    },
    '/pickings': {
        component: Vue.component('view-entrepot-pickings', function (resolve) {
            require(['../view/entrepot/pickings/index.vue'], resolve)
        })
    },
    '/pickings/quick-picking-package': {
        component: Vue.component('view-entrepot-quick-picking', function (resolve) {
            require(['../view/entrepot/quick-pickings/index.vue'], resolve)
        })
    },
    '/turnover-box': {
        component: Vue.component('view-entrepot-turnover-box', function (resolve) {
            require(['../view/entrepot/turnover-box/index.vue'], resolve)
        })
    },
    '/mass-zone': {
        component: Vue.component('view-entrepot-mass-zone', function (resolve) {
            require(['../view/entrepot/mass-zone/index.vue'], resolve)
        })
    },
    '/amazon-template/product': {
        component: Vue.component('amazon-template-product', function (resolve) {
            require(['../view/kandeng/amazon/amazon-template/product-index.vue'], resolve)
        })
    },
    '/amazon-template/category': {
        component: Vue.component('amazon-template-category', function (resolve) {
            require(['../view/kandeng/amazon/amazon-template/category-index.vue'], resolve)
        })
    },
    '/publish/amazon-listing': {
        component: Vue.component('amazon-publish', function (resolve) {
            require(['../view/kandeng/amazon/list/index.vue'], resolve)
        })
    },
    '/publish/amazon/heel-sale-list': {
        component: Vue.component('heel-sale-list', function (resolve) {
            require(['../view/kandeng/amazon/heel-sale-list/index.vue'], resolve)
        })
    },
    '/publish/amazon/up-lower-rule-list': {
        component: Vue.component('up-lower-rule-list', function (resolve) {
            require(['../view/kandeng/amazon/up-lower-rule-list/index.vue'], resolve)
        })
    },
    '/publish/amazon/heel-sale-complain': {
        component: Vue.component('heel-sale-complain', function (resolve) {
            require(['../view/kandeng/amazon/amazon-sales-complaint-management/index.vue'], resolve)
        })
    },
    '/publish/amazon/doc': {
        component: Vue.component('publish-amazon-doc', function (resolve) {
            require(['../view/kandeng/amazon/model-list/index.vue'], resolve)
        })
    },
    '/kandeng/amazon/info': {
        realPath: '/kandeng/amazon/info',
        component: Vue.component('kandeng-amazon-info', function (resolve) {
            require(['../view/kandeng/amazon/info/index.vue'], resolve)
        })
    },
    // '/kandeng/amazon/info-test': {
    //     realPath: '/kandeng/amazon/info/test',
    //     component: Vue.component('kandeng-amazon-info-test', function (resolve) {
    //         require(['../view/kandeng/amazon/info/index.vue'], resolve)
    //     })
    // },
    '/kandeng/amazon/model/info': {
        realPath: '/kandeng/amazon/model/info',
        component: Vue.component('kandeng-amazon-model-info', function (resolve) {
            require(['../view/kandeng/amazon/model-list/model-info.vue'], resolve)
        })
    },
    '/amazon-attribute/config': {
        component: Vue.component('amazon-template-setting', function (resolve) {
            require(['../view/kandeng/amazon/template-set/index.vue'], resolve)
        })
    },
    '/package-collection/set-weight': {
        component: Vue.component('view-entrepot-weighing-packages', function (resolve) {
            require(['../view/entrepot/weighing-packages/index.vue'], resolve)
        })
    },
    '/multiple-sorting': {
        component: Vue.component('multiple-sorting', function (resolve) {
            require(['../view/entrepot/multiple-sorting/index.vue'], resolve)
        })
    },
    '/package-collection/check': {
        component: Vue.component('package-collection-check', function (resolve) {
            require(['../view/entrepot/package-collection-check/index.vue'], resolve)
        })
    },
    '/delivery-check/check-turnover-box': {
        component: Vue.component('delivery-check-check-turnover-box', function (resolve) {
            require(['../view/entrepot/delivery-check/check-turnover-box/index.vue'], resolve)
        })
    },
    '/delivery-check/check-shipping-number': {
        component: Vue.component('delivery-check-check-shipping-number', function (resolve) {
            require(['../view/entrepot/delivery-check/check-shipping-number/index.vue'], resolve)
        })
    },
    '/delivery-check/twice-sorting': {
        component: Vue.component('delivery-check-twice-sorting', function (resolve) {
            require(['../view/entrepot/delivery-check/twice-sorting/index.vue'], resolve)
        })
    },
    '/delivery-check/single-box': {
        component: Vue.component('delivery-check-single-box', function (resolve) {
            require(['../view/entrepot/delivery-check/single-box/index.vue'], resolve)
        })
    },
    '/package-collection': {
        component: Vue.component('package-collection', function (resolve) {
            require(['../view/entrepot/package-collection/index.vue'], resolve)
        })
    },
    '/putaway-order': {
        component: Vue.component('putaway-order', function (resolve) {
            require(['../view/entrepot/putaway-order/index.vue'], resolve)
        })
    },
    '/package-collection/problem': {
        component: Vue.component('parcel-abnormalities', function (resolve) {
            require(['../view/entrepot/parcel-abnormalities/index.vue'], resolve)
        })
    },
    // '/parcel-abnormalities2': {
    //     component: Vue.component('/parcel-abnormalities2', function (resolve) {
    //         require(['../view/entrepot/parcel-abnormalities2/abnormal-tab.vue'],resolve)
    //     })
    // },
    '/package-return': {
        component: Vue.component('package-return', function (resolve) {
            require(['../view/entrepot/package-return/index.vue'], resolve)
        })
    },
    '/package-return/handle': {
        component: Vue.component('package-return-handle', function (resolve) {
            require(['../view/entrepot/package-return-handle/index.vue'], resolve)
        })
    },
    '/putaway-waiting-goods': {
        component: Vue.component('putaway-waiting-goods', function (resolve) {
            require(['../view/entrepot/putaway-waiting-goods/index.vue'], resolve)
        })
    },
    '/package-collection/problem/handle': {
        component: Vue.component('package-handling', function (resolve) {
            require(['../view/entrepot/package-handling/index.vue'], resolve)
        })
    },
    '/warehouse-goods-check': {
        component: Vue.component('warehouse-goods-check', function (resolve) {
            require(['../view/entrepot/warehouse-goods-check/index.vue'], resolve)
        })
    },
    '/return-shelves': {
        component: Vue.component('return-shelves', function (resolve) {
            require(['../view/entrepot/return-shelves/index.vue'], resolve)
        })
    },
    '/reback-shelves-order': {
        component: Vue.component('reback-shelves-order', function (resolve) {
            require(['../view/entrepot/reback-shelves-order/index.vue'], resolve)
        })
    },
    '/return-shelves/quantity': {
        component: Vue.component('return-shelves', function (resolve) {
            require(['../view/entrepot/return-shelves-quantity/index.vue'], resolve)
        })
    },
    '/reback-shelves-order/quantity': {
        component: Vue.component('reback-shelves-order-quantity', function (resolve) {
            require(['../view/entrepot/reback-shelves-order-quantity/index.vue'], resolve)
        })
    },
    '/return-wait-shelf': {
        component: Vue.component('return-wait-shelf', function (resolve) {
            require(['../view/entrepot/return-wait-shelf/index.vue'], resolve)
        })
    },
    '/reback-shelves': {
        component: Vue.component('reback-shelves', function (resolve) {
            require(['../view/entrepot/reback-shelves/index.vue'], resolve)
        })
    },
    '/allocation': {
        component: Vue.component('allocation', function (resolve) {
            require(['../view/entrepot/allocation/index.vue'], resolve)
        })
    },
    '/purchase-parcels-audit': {
        component: Vue.component('purchase-parcels-audit', function (resolve) {
            require(['../view/entrepot/package/purchase-parcels-audit/index.vue'], resolve)
        })
    },
    '/Publish/ebay/oe-makes': {
        component: Vue.component('oe-management', function (resolve) {
            require(['../view/kandeng/ebay/oe-management/index.vue'], resolve)
        })
    },
    '/joom-category': {
        component: Vue.component('joom-category', function (resolve) {
            require(['../view/kandeng/joom/set-store-classify/index.vue'], resolve)
        })
    },
    '/publish/joom/productList': {
        component: Vue.component('joom-product-list', function (resolve) {
            require(['../view/kandeng/joom/list/index.vue'], resolve)
        })
    },
    '/joomlisting': {
        component: Vue.component('joom-listing-list', function (resolve) {
            require(['../view/kandeng/joom/listing/index.vue'], resolve)
        })
    },
    '/publish/joom/getData': {
        realPath: '/publish/joom/getData',
        component: Vue.component('publish-joom-getData', function (resolve) {
            require(['../view/kandeng/joom/info/index.vue'], resolve);
        })
    },
    '/publish/shopee/wait-upload': {//Shopee选品刊登
        component: Vue.component('shopee-wait-upload', function (resolve) {
            require(['../view/kandeng/shopee/selection-publication/index.vue'], resolve)
        })
    },
    '/shopee/info-detail': {//Shopee选品刊登详情
        component: Vue.component('shopee-info-detail', function (resolve) {
            require(['../view/kandeng/shopee/info-detail.vue'], resolve)
        })
    },
    '/shopee-on-selling': {//Shopee在售listing
        component: Vue.component('shopee-on-selling', function (resolve) {
            require(['../view/kandeng/shopee/forsale-listing/index.vue'], resolve)
        })
    },
    '/shopee-stop-selling': {//Shopee停售listing
        component: Vue.component('shopee-stop-selling', function (resolve) {
            require(['../view/kandeng/shopee/halt-sales-listing/index.vue'], resolve)
        })
    },
    '/shopee-sold-out': {//Shopee已售完listing
        component: Vue.component('shopee-sold-out', function (resolve) {
            require(['../view/kandeng/shopee/sold-out-listing/index.vue'], resolve)
        })
    },
    '/shopee-publish-record': {//Shopee刊登记录
        component: Vue.component('shopee-publish-record', function (resolve) {
            require(['../view/kandeng/shopee/published-records/index.vue'], resolve)
        })
    },
    '/shopee-discount': {//Shopee折扣列表
        component: Vue.component('shopee-discount', function (resolve) {
            require(['../view/kandeng/shopee/set-discount/index.vue'], resolve)
        })
    },
    '/purchase-order/get-logistics': {
        component: Vue.component('purchase-order-logistics', function (resolve) {
            require(['../view/procurement/logistics/index.vue'], resolve);
        })
    },
    '/package-not-collection': {
        component: Vue.component('package-not-collection', function (resolve) {
            require(['../view/entrepot/package-not-collection/index.vue'], resolve);
        })
    },
    '/wait-for-make-picking': {
        component: Vue.component('wait-for-make-picking', function (resolve) {
            require(['../view/entrepot/wait-for-picking/index.vue'], resolve);
        })
    },
    '/wait-for-make-picking/not-conforming': {
        component: Vue.component('not-conforming-picking', function (resolve) {
            require(['../view/entrepot/not-conforming-picking/index.vue'], resolve);
        })
    },
    '/wait-for-packing': {
        component: Vue.component('wait-for-packing', function (resolve) {
            require(['../view/entrepot/wait-for-packing/index.vue'], resolve);
        })
    },
    '/delivery-check/print-label': {
        component: Vue.component('wait-for-packing', function (resolve) {
            require(['../view/entrepot/print-label/index.vue'], resolve);
        })
    },
    '/publish-collect-index': { //数据采集
        component: Vue.component('publish-collect-index', function (resolve) {
            require(['../view/kandeng/aliexpress/publish-collect/index.vue'], resolve);
        })
    },
    '/warehouse/report/picking': {
        component: Vue.component('picking-report', function (resolve) {
            require(['../view/entrepot/warehouse-reports/picking-report/index.vue'], resolve);
        })
    },
    '/warehouse/report/label': {
        component: Vue.component('label-report', function (resolve) {
            require(['../view/entrepot/warehouse-reports/label-report/index.vue'], resolve);
        })
    },
    '/warehouse/report/unpack-store': {
        component: Vue.component('library-statistics', function (resolve) {
            require(['../view/entrepot/warehouse-reports/library-statistics/index.vue'], resolve)
        })
    },
    '/warehouse/report/sorting': {
        component: Vue.component('sorting-statistics', function (resolve) {
            require(['../view/entrepot/warehouse-reports/sorting-statistics/index.vue'], resolve);
        })
    },
    '/warehouse/report/shelf': {
        component: Vue.component('putaway-statistics', function (resolve) {
            require(['../view/entrepot/warehouse-reports/putaway-statistics/index.vue'], resolve);
        })
    },
    '/warehouse/report/collection': {
        component: Vue.component('sorting-statistics', function (resolve) {
            require(['../view/entrepot/warehouse-reports/collection/index.vue'], resolve);
        })
    },
    '/warehouse/report/warehouse-statistics-one': {
        component: Vue.component('report-today', function (resolve) {
            require(['../view/entrepot/report-today/index.vue'], resolve);
        })
    },
    '/warehouse/report/packing': {
        component: Vue.component('packaging-statistics', function (resolve) {
            require(['../view/entrepot/warehouse-reports/packaging-statistics/index.vue'], resolve);
        })
    },
    '/warehouse/report/unpack': {
        component: Vue.component('unpacking-statistics', function (resolve) {
            require(['../view/entrepot/warehouse-reports/unpacking-statistics/index.vue'], resolve);
        })
    },
    '/stock-orders': { ///order/local
        component: Vue.component('stock-orders', function (resolve) {
            require(['../view/order/stock-orders/index.vue'], resolve);
        })
    },
    '/providers-exception': { ///order/local
        component: Vue.component('providers-exception', function (resolve) {
            require(['../view/order/providers-exception/index.vue'], resolve);
        })
    },

    // mymall 刊登
    '/publish/pandao/wait-upload': {
        component: Vue.component('mymall-not-published', function (resolve) {
            require(['../view/kandeng/mymall/list/not-published.vue'], resolve)
        })
    },
    '/pandao-publish-record': {
        component: Vue.component('mymall-record-published', function (resolve) {
            require(['../view/kandeng/mymall/list/record-published.vue'], resolve)
        })
    },
    '/pandao-on-selling': {
        component: Vue.component('mymall-sales', function (resolve) {
            require(['../view/kandeng/mymall/listing/sales.vue'], resolve)
        })
    },
    '/pandao-sold-out': {
        component: Vue.component('mymall-sold-out', function (resolve) {
            require(['../view/kandeng/mymall/listing/soldOut.vue'], resolve)
        })
    },
    '/publish/mymall/getdata': {
        component: Vue.component('mymall-publish-info', function (resolve) {
            require(['../view/kandeng/mymall/info/index.vue'], resolve)
        })
    },
    '/wish-account-health': {
        component: Vue.component('wish-health-manage', function (resolve) {
            require(['../view/base/monitor/wish/index.vue'], resolve)
        })
    },
    '/ebay-account-health': {
        component: Vue.component('ebay-account-health', function (resolve) {
            require(['../view/base/monitor/ebay/index.vue'], resolve)
        })
    },
    '/aliexpress-account-health': {
        component: Vue.component('aliexpress-health-manage', function (resolve) {
            require(['../view/base/monitor/aliexpress/index.vue'], resolve)
        })
    },
    '/amazon-account-health': {
        component: Vue.component('amazon-health-manage', function (resolve) {
            require(['../view/base/monitor/amazon/index.vue'], resolve)
        })
    },
    '/joom-orders': {
        component: Vue.component('joom-orders', function (resolve) {
            require(['../view/order/joom/list/index.vue'], resolve)
        })
    },
    '/lazada-orders': {
        component: Vue.component('lazada-orders', function (resolve) {
            require(['../view/order/lazada/list/index.vue'], resolve)
        })
    },
    '/shopee-order': {
        component: Vue.component('shopee-orders', function (resolve) {
            require(['../view/order/shopee/list/index.vue'], resolve)
        })
    },
    '/warehouse-goods-forecast': { //产品预报
        component: Vue.component('warehouse-goods', function (resolve) {
            require(['../view/entrepot/warehouse-goods/product-forecast/index.vue'], resolve);
        })
    },
    '/shopee-account': {  //shopee-account账号
        component: Vue.component('shopee-account', function (resolve) {
            require(['../view/base/account/shopee/index.vue'], resolve);
        })
    },
    '/pandao-orders': {
        component: Vue.component('my-mall-orders', function (resolve) {
            require(['../view/order/my-mall/list/index.vue'], resolve)
        })
    },
    '/paytm-orders': {
        component: Vue.component('paytm-orders', function (resolve) {
            require(['../view/order/paytm/list/index.vue'], resolve)
        })
    },
    '/stock-lack': {
        component: Vue.component('stockout-list', function (resolve) {
            require(['../view/entrepot/stockout-list/index.vue'], resolve)
        })
    },
    '/walmart-orders': {
        component: Vue.component('walmart-orders', function (resolve) {
            require(['../view/order/walmart/list/index.vue'], resolve)
        })
    },
    '/jumia-orders': {
        component: Vue.component('jumia-orders', function (resolve) {
            require(['../view/order/jumia/list/index.vue'], resolve)
        })
    },
    '/cd-orders': {
        component: Vue.component('cd-orders', function (resolve) {
            require(['../view/order/cd-order/list/index.vue'], resolve)
        })
    },
    '/pdd-order': {//拼多多订单
        component: Vue.component('pdd-order', function (resolve) {
            require(['../view/order/pdd-order/list/index.vue'], resolve)
        })
    },
    '/yandex-orders': {//yandex订单
        component: Vue.component('yandex-orders', function (resolve) {
            require(['../view/order/yandex-order/list/index.vue'], resolve)
        })
    },
    '/umka-order': {//Umka订单
        component: Vue.component('umka-order', function (resolve) {
            require(['../view/order/umka-order/list/index.vue'], resolve)
        })
    },
    '/vova-orders': {
        component: Vue.component('vova-orders', function (resolve) {
            require(['../view/order/vova/list/index.vue'], resolve)
        })
    },
    '/delivery-check/print-change-label': {
        component: Vue.component('eub-change-label', function (resolve) {
            require(['../view/entrepot/eub-change-label/index.vue'], resolve)
        })
    },
    '/progress': {
        component: Vue.component('demand-schedules', function (resolve) {
            require(['../view/demand-management/demand-schedules/index.vue'], resolve)
        })
    },
    '/collector': {
        component: Vue.component('set-collector', function (resolve) {
            require(['../view/entrepot/set-collector/index.vue'], resolve)
        })
    },
    '/virtual-order/mission-lists': {
        component: Vue.component('mission-list', function (resolve) {
            require(['../view/virtual-order/scalp-task/index.vue'], resolve)
        })
    },
    '/internal-letters/received-letters': {
        component: Vue.component('system-notice-inbox', function (resolve) {
            require(['../view/system-notice/inbox/index.vue'], resolve)
        })
    },
    '/internal-letters/sent-letter': {
        component: Vue.component('system-notice-outbox', function (resolve) {
            require(['../view/system-notice/outbox/index.vue'], resolve)
        })
    },
    '/internal-letters/draft': {
        component: Vue.component('system-notice-drafts', function (resolve) {
            require(['../view/system-notice/drafts/index.vue'], resolve)
        })
    },
    '/internal-letters': {
        component: Vue.component("system-notice-write-an-e-mail", function (resolve) {
            require(["../view/system-notice/write-an-e-mail/index.vue"], resolve)
        })
    },
    '/wait-for-make-picking/sku': {
        component: Vue.component('wait-for-picking-sku', function (resolve) {
            require(['../view/entrepot/wait-for-picking-sku/index.vue'], resolve)
        })
    },
    '/stock-rules': {
        component: Vue.component('stock-rules', function (resolve) {
            require(['../view/entrepot/stocking/rules/index.vue'], resolve)
        })
    },
    '/purchase-parcels-box': {
        component: Vue.component('purchase-parcels-box', function (resolve) {
            require(['../view/entrepot/package/cardboard/index.vue'], resolve)
        })
    },
    '/purchase-parcels/abnormal': {
        component: Vue.component('purchase-parcels-abnormal', function (resolve) {
            require(['../view/entrepot/package/abnormal/index.vue'], resolve)
        })
    },
    '/warehouse-goods-channel-log': {
        component: Vue.component('warehouse-goods-channel-log', function (resolve) {
            require(['../view/entrepot/warehouse-goods/third-stock-in/index.vue'], resolve)
        })
    },
    '/virtual-purchase-order': {
        component: Vue.component('virtual-purchase-order', function (resolve) {
            require(['../view/procurement/virtual-purchase/index.vue'], resolve)
        })
    },
    //虚拟付款申请
    '/virtual-finance-purchase': {
        component: Vue.component('virtual-pay', function (resolve) {
            require(['../view/procurement/virtual-pay/index.vue'], resolve)
        })
    },
    '/ebay-emails': {
        component: Vue.component('ebay-emails', function (resolve) {
            require(['../view/customer-service/ebay-email/inbox/index.vue'], resolve)
        })
    },
    '/ebay-emails/outbox': {
        component: Vue.component('ebay-emails-outbox', function (resolve) {
            require(['../view/customer-service/ebay-email/outbox/index.vue'], resolve)
        })
    },
    '/ebay-emails/trashbox': {
        component: Vue.component('ebay-emails-trashbox', function (resolve) {
            require(['../view/customer-service/ebay-email/dustbin/index.vue'], resolve)
        })
    },
    '/wish-carrier': {
        component: Vue.component('wish-carrier', function (resolve) {
            require(['../view/entrepot/wish-carrier/index.vue'], resolve)
        })
    },
    '/packages-error': {
        component: Vue.component('packages-error', function (resolve) {
            require(['../view/order/error-info-solution/index.vue'], resolve)
        })
    },
    '/report/sku-sales-dynamic': {
        component: Vue.component('sku-sales-dynamic', function (resolve) {
            require(['../view/report/sku-sales-dynamic/index.vue'], resolve)
        })
    },
    '/after-sale-rules': {
        component: Vue.component('after-sale-rule', function (resolve) {
            require(['../view/customer-service/rule/after-sale-rule/index.vue'], resolve)
        })
    },
    '/stock-up-suggest': {
        component: Vue.component('stock-up-suggest', function (resolve) {
            require(['../view/procurement/stock-up-suggest/index.vue'], resolve)
        })
    },
    '/purchase-parcels/ready-receive': {
        component: Vue.component('ready-receive', function (resolve) {
            require(['../view/entrepot/package/pre-receive/index.vue'], resolve)
        })
    },
    '/purchase-parcels/receive-abnormal': {
        component: Vue.component('receive-abnormal', function (resolve) {
            require(['../view/entrepot/package/receive-abnormal/index.vue'], resolve);
        })
    },
    /*'/allocation': {
        component: Vue.component('allocation-plan', function (resolve) {
            require(['../view/entrepot/allocation-manage/allocation-plan/index.vue'], resolve);
        })
    },
    '/pickings-manage': {
        component: Vue.component('allocation-picking', function (resolve) {
            require(['../view/entrepot/allocation-manage/allocation-picking/index.vue'], resolve);
        })
    },
    '/allocation-logistics': {
        component: Vue.component('allocation-logistics', function (resolve) {
            require(['../view/entrepot/allocation-manage/allocation-logistics/index.vue'], resolve);
        })
    },
    '/packing-manage': {
        component: Vue.component('allocation-packing', function (resolve) {
            require(['../view/entrepot/allocation-manage/allocation-packing/index.vue'], resolve);
        })
    },
    '/allocation-box': {
        component: Vue.component('allocation-box', function (resolve) {
            require(['../view/entrepot/allocation-manage/allocation-box/index.vue'], resolve);
        })
    },*/
};
