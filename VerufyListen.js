// 云端->router->util->pubFunction

/**
在同级目录下创建rules文件夹

示例如下：

云函数
user/sys/add.js
验证规则
user/rules/index.js

PS: 校验文件名只能是index，多个云函数对应一个校验文件

云对象
user/sys/user.js
验证规则
user/sys/user.js

PS: 校验文件与云对象文件同名，一个云对象对应一个校验文件

-------------

用法如下：

const rules = {}

当调用某个云函数(对象)名为 add 时就触发
rules.add = { ...rule }

PS: 云函数和云对象同理

*/

// 在 前置 过滤器中调用，云端->router->middleware


const Verify = require('@skiyee/verify')

pubFun.validate = function (url, source) {
  let res = { code: 0, msg: '通过验证' }

  if (typeof url !== 'string')
    return { code: 51, msg: '索引参数错误' }

  const splitType = url.includes('.') ? '.' : '/'

  const mainPath = url.replace(/sys|kh|pub\b/g, 'rules').split(splitType)

  const methodName = mainPath.pop()

  const mainPathStr = `service/${mainPath.join('/')}`

  let rule = null

  try {
    rule = vk.require(mainPathStr)?.[methodName]
  }
  catch (err) {
    return res
  }

  if (!rule)
    return res

  const validtor = new Verify(rule)

  validtor.validate(source, (err) => {
    if (err !== null)
      res = { code: 100, msg: err }
  })

  return res
}
