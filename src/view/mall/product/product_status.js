/**
 * Created by RondaFul on 2016/10/26.
 */
export const all = {
    name:'全部',
    status:0
};
export const nonSubmit = {
    name:'未提交',
    status:1
};

export const waitApproval = {
    name:'等待审批',
    status:2
};

export const nonPass = {
    name:'审批不通过',
    status:3
};
export const waitTask = {
    name:'等待取样',
    status:4
};
export const waitQc = {
    name:'等待质检',
    status:5
};
export const qcPass = {
    name:'质检通过',
    status:6
};
export const qcNonPass = {
    name:'质检不通过',
    status:7
};
export const gener = {
    name:'已生成',
    status:8
};
export const waitGenSku = {
    name:'等待生成sku码',
    status:9
};
export const notDesWaitMeiG = {
    name:'未描述等待美工处理',
    status:10
};
export const notDesDisposeMeiG = {
    name:'未描述美工已处理',
    status:11,
}
export const DesWaitPhotograph = {
    name:'已描述等待拍照',
    status:12
}
export const DesWaitMeiG = {
    name:'已描述等待美工处理',
    status:13
}
export const affirm = {
    name:'确认发布',
    status:14
}
export const cancellation={
    name:'作废',
    status:15
}
export const allstatus = {
    all,
    nonSubmit,
    waitTask,
    waitApproval,
    waitQc,
    qcNonPass,
    qcPass,
    nonPass,
    waitGenSku,
    gener,
    notDesWaitMeiG,
    notDesDisposeMeiG,
    DesWaitPhotograph,
    DesWaitMeiG,
    affirm,
    cancellation
};

export const findStatusName = function(status){
    for(let i in allstatus){
        if(allstatus.hasOwnProperty(i)){
            if(allstatus[i].status === status){
                return allstatus[i].name;
            }
        }
    }
};
