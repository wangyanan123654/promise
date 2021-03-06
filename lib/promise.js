/*
自定义Promise模块 IIFE
 */

(function () {
    const PENDING = "pending"
    const RESOLVED = "resolved"
    const REJECTED = "rejected"

    // promise构造函数
    //excutor：执行器函数  同步执行函数
    function Promise(excutor) {
        //将当前promise对象保存起来
        const self = this;
        self.status = PENDING // 给promise对象指定status属性，初始值为pending
        self.data = undefined // 给promise对象指定一个用于存储结果数据的属性
        self.callback = [] // 每个元素的结构， {onResolved(){},onRejected(){}}
        function resolve(value) {
            //如果当前状态不是pending，直接结束
            if (self.status !== PENDING) return
            // 将状态改为resolved
            self.status = RESOLVED
            //保存value数据
            self.data = value
            //如果有待执行的callback函数，立即异步执行回调函数
            if (self.callback.length > 0) {
                setTimeout(() => {
                    self.callback.forEach(calbackObjs => {
                        calbackObjs.onResolved(value)
                    });
                })
            }

        };

        function reject(reason) {
            // 将状态改为rejected
            self.status = REJECTED
            //保存value数据
            self.data = reason
            //如果有待执行的callback函数，立即异步执行回调函数
            if (self.callback.length > 0) {
                setTimeout(() => {
                    self.callback.forEach(calbackObjs => {
                        calbackObjs.onRejected(reason)
                    });
                })
            }
        };

        //立即执行excutor
        try {
            excutor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    // promise原型对象上有then（）方法
    //指定成功和失败的回调函数，返回一个新的promise对象

    Promise.prototype.then = function (onResolved, onRejected) {
        onResolved = typeof onResolved === 'function' ? onResolved : value => value //向下传递value值
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason
        } //向下传递value值

        const self = this;
        //返回 一个新的promise
        return new Promise((resolve, rejected) => {
            // 调用指定回调函数处理，根据执行结果，改变return的promise的状态
            function handle(callback) {
                try {
                    const result = callback(self.data)
                    if (result instanceof Promise) {
                        //3.如果回调函数返回的是promise，return的promise结果就是这个promise的结果
                        result.then(
                            value => resolve(value), // result成功时，让true的promise也成功
                            reason => rejected(reason) // result失败时，让true的promise也失败
                        )
                    } else {
                        //2.如果回调函数返回的不是promise，return的promise就会成功，value就是返回值
                        resolve(result)
                    }
                } catch (error) {
                    //1.如果执行抛出异常，return promise就会失败，reason就是error
                    rejected(error)
                }
            }
            if (self.status === PENDING) {
                self.callback.push({
                    onResolved() {
                        handle(onResolved)
                    },
                    onRejected() {
                        handle(onRejected)
                    }
                })
            } else if (self.status === RESOLVED) {
                setTimeout(() => {
                    handle(onResolved)
                })
            } else {
                setTimeout(() => {
                    handle(onRejected)
                })
            }
        })
    }

    // promise原型对象上有catch（）方法  指定失败的回调函数，返回一个新的promise
    Promise.prototype.catch = function (onRejected) {
        return this.then(undefined, onRejected)
    }


    //promise函数对象resolve方法  返回一个成功的promise
    Promise.resolve = function (value) {
        return new Promise((resolve,reject)=>{
            if (value instanceof Promise){
                value.then(resolve,reject)
            }else{
                resolve(value)
            }
        })

    }

    //promise函数对象reject方法 返回一个指定reason的失败的promise
    Promise.reject = function (value) {
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }

    //promise函数对象all方法  返回一个promise ，只有当所有promie都成功时才成功，否则失败（只要有一个失败）
    Promise.all = function (promises) {
        //保证返回的值的结果的顺序和传进来的是一致  只有全部都是成功才返回成功
        const values = new Array(promises.length) //指定数据的长度和promise的个数相同
        let successCount = 0
        return new Promise((resolve,reject)=>[
            promises.forEach((p,index) => {
                Promise.resolve(p).then(
                    value => { //如果成功
                        successCount++
                        values[index] = value
                        if (successCount === promises.length) {
                            resolve(values)
                        }
                    },
                    reason => {
                        reject(reason)
                    }
                )
            })
        ])
    }

    //promise函数对象race方法 返回一个promise 其结果由第一个完成的promie来决定
    Promise.race = function (promises) {
        return new Promise((resolve,reject)=>{
            promises.forEach(p => {
                Promise.resolve(p).then(
                    value => resolve(value),
                    reason => reject(reason)
                )
            })
        })
    }
    //向外暴露promise函数
    window.Promise = Promise
})(window)