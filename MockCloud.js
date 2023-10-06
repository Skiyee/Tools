// 跟Mock调用同理，API一旦设置 listen 就直接触发Mock

class MUC {
  constructor(callFunction) {
    // 模拟数据，用于存储函数调用的模拟结果
    this._mock = {}
    // 原始callFunction函数的引用，将在后续调用中使用
    this._callFunction = callFunction
  }

  // 用于匹配函数调用名称并返回模拟结果
  match(name) {
    const item = this._mock[name] || null
    return item?.res
  }

  // 调用装饰MUC函数，args是函数调用时传入的参数，temp是模拟结果的生成函数
  decoratorUC(args, temp) {
    if (typeof args.success === 'function') {
      // 如果参数存在success函数，则调用success函数并传入temp的结果
      args.success(temp())

      // 如果参数存在complete函数，则调用complete函数并传入temp的结果
      if (typeof args.complete === 'function')
        args.complete(temp())

      return true
    }
    else {
      // 返回一个Promise并解析temp的结果
      return Promise.resolve(temp())
    }
  }

  // 调用原始MUC函数，args是函数调用时传入的参数
  originUC(args) {
    this._callFunction(args)
  }

  // 返回一个函数，该函数用于装饰或调用函数
  open() {
    return (args) => {
      const callName = args.name
      const temp = this.match(callName)
      let UC = null

      if (temp)
        // 如果有匹配的模拟结果，调用装饰函数
        UC = this.decoratorUC(args, temp)
      else
        // 否则调用原始函数
        UC = this.originUC(args)

      return UC
    }
  }

  // 监听MUC，用于设置模拟结果
  listen(name = null, res = null) {
    if (name && res) {
      // 如果提供了名称和结果，则将其存储在模拟数据中
      this._mock[name] = {
        name,
        res,
      }
    }
    // 将open方法返回的函数赋值给uniCloud.callFunction，用于后续函数调用
    uniCloud.callFunction = this.open()
  }
}

// 创建一个新的MUC实例，传入uniCloud.callFunction作为原始函数
const newMUC = new MUC(uniCloud.callFunction)

// 导出这个新的MUC实例
export default newMUC
