console.log("MyDebounce begin")
function MyDebounce(fun){
    let temp;
    return function(){
        clearTimeout(temp);
        temp=setTimeout(()=>{
            fun.apply(this,arguments)
        },1000);
    }
}
//window.onmousewheel = MyDebounce(()=>{console.log('111111')})
console.log("MyDebounce end")
console.log("MyThrottle begin")
function MyThrottle(fun){
    let flag=true;
    return function (){
        if(flag!==true)return;
        flag=false;
        setTimeout(() => { fun.apply(this, arguments);flag=true;},1000);
    }
}
console.log("MyThrottle end")
//window.onmousewheel = MyDebounce(() => { console.log('111111') })