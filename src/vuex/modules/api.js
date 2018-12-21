/**
 * Created by wuchuguang on 17-5-11.
 */
export default {
    namespaced:true,
    state: {
        channels:[],
        warehouses:[],
        suppliers:[],
        purchasers:[],
        shippings:[],
        accounts:{},
        getAccounts:[],
        printer:'',
        printerList:[],
        collectionList:[],
        publishAccount:{
            ebay:[],
            amazon:[],
            warehouse:[],
            shipping:[],
            serverIp:[],//服务器ip列表
            memberShipAccount:[], //用户账号
            memberShipSales:[], //用户销售员
            memberShipCustomer:[], //客服
            memberShipVirtual:[],
            memberShipDeveloper:[], //开发人员
            warehouseUser:[],//仓库人员
            wishPublishAccount:[],//wish刊登用户
            smtPublishAccount:[],//速卖通刊登用户
            shippingMethod:[],
            amazonAccount:[],//亚马逊 账号,
            departmentAccount:[],    //部门负责人,
            skuMapAccount:[], //产品映射账号
            allAccount:[],
            paypalAccount:[],//paypalAccount账号,
            mymallPublishAccount:[],
            monitorWish:[],
            shopeeAccount:[],
            creatorList:[],//Amazon创建人
            saleRule: [],//跟卖规则
            productBrand:[],//品牌
        },
        warehouseCargo:[],
        warehouseStaffs:[],
    },
    mutations:{
        channels(state, channels){
            state.channels = channels;
        },
        warehouses(state, warehouses){
            state.warehouses = warehouses;
        },
        shippings(state, shippings){
            state.shippings = shippings;
        },
        suppliers(state, suppliers){
            state.suppliers = suppliers;
        },
        purchasers(state, purchasers){
            state.purchasers = purchasers;
        },
        getAccounts(state, getAccounts){
          state.getAccounts = getAccounts;
        },
        set_publish_account(state,data){
            state.publishAccount[data.type]= data.data;
        },
        warehouseCargo(state,warehouseCargo){
            state.warehouseCargo = warehouseCargo;
        },
        warehouseStaffs(state,warehouseStaffs){
            state.warehouseStaffs = warehouseStaffs;
        },
        set_printer(state,printer){
            state.printer = printer;
        },
        set_printerList(state,printer){
            state.printerList = printer;
        },
        set_collectionList(state,collectionList){
            state.collectionList = collectionList;
        }
    },
    actions: {
        channels({commit}, channels){
            commit('channels', channels);
        },
        warehouses({commit}, warehouses){
            commit('warehouses', warehouses);
        },
        shippings({commit}, shippings){
            commit('shippings', shippings);
        },
        suppliers({commit}, suppliers){
            commit('suppliers', suppliers);
        },
        purchasers({commit}, purchasers){
            commit('purchasers', purchasers);
        },
        getAccounts({commit}, getAccounts){
            commit('getAccounts', getAccounts);
        },
        set_publish_account({commit},data){
            commit('set_publish_account',data);
        },
        warehouseCargo({commit},warehouseCargo){
            commit('warehouseCargo',warehouseCargo);
        },
        warehouseStaffs({commit},warehouseStaffs){
            commit('warehouseStaffs',warehouseStaffs);
        },
        set_printer({commit}, printer){
            commit('set_printer', printer);
        },
        set_printerList({commit}, printer){
            commit('set_printerList', printer);
        },
        set_collectionList({commit}, collectionList){
            commit('set_collectionList', collectionList);
        },
    },
    getters:{
        channels(state){
            return state.channels;
        },
        warehouses(state){
            return state.warehouses;
        },
        shippings(state){
            return state.shippings;
        },
        suppliers(state){
            return state.suppliers;
        },
        purchasers(state){
            return state.purchasers;
        },
        account(state){
            return (channel_id, account_id) =>{
                const accounts = state.accounts[channel_id] || {};
                return accounts[account_id] || {account_name:'not find'}
            }
        },
        getAccounts(state){
          return state.getAccounts;
        },
        getPublishAccount(state){
            return (type) => {
                return state.publishAccount[type] || [];
            };
        },
        getParamAccount(state){
            return (type, value, def = 'label') =>{
                const labelValue = state.publishAccount[type].find(row=>row.value === value);
                if(labelValue){
                    return labelValue[def];
                }else{
                    return ''
                }
            }
        },
        warehouseCargo(state){
            return state.warehouseCargo;
        },
        warehouseStaffs(state){
            return state.warehouseStaffs;
        },
        getPrinter(state){
            return state.printer;
        },
        getPrinterList(state){
            return state.printerList;
        },
        getCollectionList(state){
            return state.collectionList;
        }
    }
};
