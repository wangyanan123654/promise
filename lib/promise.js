/*
自定义Promise模块 IIFE
 */

(function () {
    // promise构造函数
    //excutor：执行器函数  同步执行函数
    function Promise(excutor) {
        this.status = 'pending' // 给promise对象指定status属性，初始值为pending
        this.data = undefined // 给promise对象指定一个用于存储结果数据的属性
        this.callback = [] // 每个元素的结构， {onResolved(){},onRejected(){}}
        //立即同步执行excutor函数 
        function resolve(value) {
            //如果当前状态不是pending，直接结束
            if(this.status!=='pending') return
            // 将状态改为resolved
            this.status = 'resolved'
            //保存value数据
            this.data = value
            //如果有待执行的callback函数，立即异步执行回调函数
            if (this.callback.length > 0) {
                setTimeout(() => {
                    this.callbacks.forEach(calbackObjs => {
                        calbackObjs.onResolved(value)
                    });
                })
            }

        };

        function reject(reason) {
            // 将状态改为rejected
            this.status = 'rejected'
            //保存value数据
            this.data = reason
            //如果有待执行的callback函数，立即异步执行回调函数
            if (this.callback.length > 0) {
                setTimeout(() => {
                    this.callbacks.forEach(calbackObjs => {
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

    }

    // promise原型对象上有catch（）方法  指定失败的回调函数，返回一个新的promise
    Promise.prototype.catch = function (onRejected) {

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