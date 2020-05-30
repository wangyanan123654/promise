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
        //立即同步执行excutor函数 
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
        const self = this;
        //返回 一个新的promise
        return new Promise((resolve, rejected) => {
            if (self.status === PENDING) {
                self.callback.push({
                    onResolved,
                    onRejected
                })
            } else if (self.status === RESOLVED) {
                setTimeout(() => {
                    try {
                        const result = onResolved(self.data)
                        if (result instanceof Promise) {
                            //3.如果回调函数返回的是promise，return的promise结果就是这个promise的结果
                            result.then(
                                value => resolve(value),
                                reason => rejected(reason)
                            )
                        } else {
                            //2.如果回调函数返回的不是promise，return的promise就会成功，value就是返回值
                            resolve(result)
                        }
                    } catch (error) {
                        //1.如果执行抛出异常，return promise就会失败，reason就是error
                        rejected(error)
                    }

                })
            } else {
                setTimeout(() => {
                    onRejected(self.data)
                })
            }
        })
    }

    // promise原型对象上有catch（）方法  指定失败的回调函数，返回一个新的promise
    Promise.prototype.catch = function (onResolved, onRejected) {

    }


    //promise函数对象resolve方法  返回一个成功的promise
    Promise.resolve = function (value) {

    }

    //promise函数对象reject方法 返回一个指定reason的失败的promise
    Promise.reject = function (value) {

    }

    //promise函数对象all方法  返回一个promise ，只有当所有promie都成功时才成功，否则失败（只要有一个失败）
    Promise.all = function (promise) {

    }

    //promise函数对象race方法 返回一个promise 其结果由第一个完成的promie来决定
    Promise.race = function (promise) {

    }
    //向外暴露promise函数
    window.Promise = Promise
})(window)