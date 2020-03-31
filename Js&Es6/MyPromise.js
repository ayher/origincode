console.log("Promise begin")
const isFunction=(fun)=> typeof fun === 'function';
const PENDING='PENDING';
const FULFILLED='FULFILLED';
const REJECTED='REJECTED';

class MyPromise{
	constructor(handle){
		// MyPromise的参数必须是个函数。
		if(!isFunction(handle)){
			throw new Error('Promise must accept a function as a parameter!');
		}
		// 初始状态
		this._status=PENDING;
		// 保存提示信息
		this._value=undefined;
		// 成功列表
		this._fulfilledQueues=[];
		// 失败列表
		this._rejectedQuenes=[];
		try{
			// 绑定this，设置执行函数
			handle(this._resolve.bind(this),this._reject.bind(this))
		}catch(err){
			this._reject(err);
		}
	}

	/**
	 * 触发成功的函数
	 * @param {} val 可以传入的参数
	 */
	_resolve(val){
		const run=()=>{
			if(this._status !== PENDING)return;
			this._status=FULFILLED;
			const runFulfilled=(value)=>{
				let cb;
				while(cb=this._fulfilledQueues.shift()){
					cb(value);
				}
			}
			const runRejected=(err)=>{
				let cb;
				while(cb=this._rejectedQueues.shift()){
					cb(err);
				}
			}

			// 判断闯入的参数，当是MyPromise时等待其结束，根据其状态，执行回掉成功或者失败。否则执行成功队列。
			if(val instanceof MyPromise){
				val.then(value=>{
					this._value=value;
					runFulfilled(value);
				},err=>{
					this._value=err;
					runRejected(err);
				})
			}else{
				this._value=val;
				runFulfilled(val);
			}
			
		}
		// 使其异步进行，防止阻塞
		setTimeout(()=>run(),0);
	}

	_reject(err){
		if (this._status !== PENDING)return;
		const run=()=>{
			this._status=REJECTED;
			this._value=err;
			let cb;
			while(cb=this._rejectedQuenes.shift()){
				cb(err);
			}
		}
		setTimeout(()=>run(),0);
	}

	then (onFulfilled,onRejected){
		const {_value,_status}=this;
		return new MyPromise((onFulfilledNext, onRejectedNext)=>{
			let fulfilled=value=>{
				try{
					if(!isFunction(onFulfilled)){
						onFulfilledNext(value);
					}else{
						let res=onFulfilled(value);
						if(res instanceof MyPromise){
							res.then(onFulfilledNext, onRejectedNext);
						}else{
							onFulfilledNext(res)
						}
					}
				}catch(err){
					onRejectedNext(err);
				}
			}

			let rejected=value=>{
				try{
					if (!isFunction(onRejected)) {
						onRejectedNext(value);
					}else{
						let res=onRejected(value);
						if(res instanceof MyPromise){
							res(onFulfilledNext,onRejectedNext);
						}else{
							onFulfilledNext(value);//?????
						}
					}
				}catch(err){
					onRejectedNext(err);
				}
			}

			switch(_status){
				case PENDING:
					this._fulfilledQueues.push(fulfilled);
					this._rejectedQuenes.push(rejected);
					break;
				case FULFILLED:
				 	onFulfilled(_value);
				 	break;
				case REJECTED:
					onRejected(_value);
					break;
			}
		})
	}

	catch(onRejected){
		return this.then(undefined,onRejected);
	}

	static resolve(value){
		if(value instanceof MyPromise)return value;
		return new MyPromise(resolve=>resolve(value))
	}

	static reject(value){
		return new MyPromise((resolve,reject)=>reject(value))
	}

	static all(list){
		return new MyPromise((resolve,reject)=>{
			let values=[];
			let count=0;

			for (let [i,p] of list.entries()) {
				this.resolve(p).then(res=>{
					values[i]=res;
					count++;
					if(count === list.length) resolve(values);
				},err=>{
					reject(err)
				})
			}
		})
	}

	static race(list){
		return new MyPromise((resolve,reject)=>{
			for(let p of list){
				this.resolve(p).then(res=>{
					resolve(res);
				},err=>{
					reject(err);
				})
			}
		})
	}

	static finally(cb){
		return this.then(
			res=>MyPromise.resolve(cb()).then(()=>res),
			resolve=>MyPromise.resolve(cb()).then(()=>{throw reason})
			)
	}
}


function getdata(){
	return new MyPromise((resolve ,reject)=>{
		setTimeout(()=>{resolve('done')},1000);
	})
}

//p=getdata().then((data)=>{console.log(data,'getdata');return getdata()}).then((data)=>{console.log(2+data)})

console.log("Promise end")
