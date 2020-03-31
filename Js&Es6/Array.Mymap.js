Array.prototype.MyMap = function (fun) {
    let arr=[];
    for(let i=0;i<this.length;i++){
        arr.push(fun(this[i],i,this));
    }
    return arr;
}
// console.log([2,2,5].MyMap((value,index,arr)=>{
//     return value+20;
// }))