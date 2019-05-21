const cmds = {
    async ggg(param){
        return new Promise(succ =>{
            setTimeout(succ(param), 3000);
        })
    }
};

onmessage = async (event) =>{
    let {btime, next, cmd, params} = JSON.parse(event.data);
    let status = true;
    let result = null;
    try{
        result = await processCmd(cmd, params)
    }catch (e) {
        status = false;
        result = e.message;
    }
    postMessage(JSON.stringify({btime, etime:Date.now(), cmd,next, status, result}))
};

function processCmd(cmd, params){
    if(cmds[cmd]){
        return cmds[cmd](params)
    }else{
        throw new Error(`worker cmd ${cmd} not defined`);
    }
}


