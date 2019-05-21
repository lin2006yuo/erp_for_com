
class log{
    log(){

    }
    waring(...arg){
        let all=arg;
        let first=arg.shift()
        console.log(`位置：${first}    打印:`,...all)
    }
    error(){

    }
}

window.pack_logs =new log();