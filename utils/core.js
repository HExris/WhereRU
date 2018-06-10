/** 
 * Description: Core function of this miniprogram
 * Author: HExris
 * Time: 2018-05-22 20:09:44
*/

/**
 * 获取指定页面的方法
 * @routerName String
 * @functionName String
 */
function getPage(routerName) {
  let pages = getCurrentPages(),
    currentPage = null
  pages.forEach(item => {
    if (item.route === routerName) {
      currentPage = item
    }
  })
  return currentPage
}

/**
 * 调用目标页面的方法
 * routerName String
 * functionName String
 * params
 */
function triggerFunction(routerName, functionName, params) {
  const currentPage = getPage(routerName)
  if (typeof currentPage[functionName] === 'function') {
    currentPage[functionName](params)
  }
}

/**
   * 获取组件实例
   * @compents Array
   * @self this
   */
function getCompoents(compents, self) {
  compents.length && compents.forEach(item => {
    self[item] = self.selectComponent(`#${item}`)
  })
}

/**
   * 设置目标页面Data
   * @routerName String
   * @data Array
   */
function setDataInOtherPage(routerName, param) {
  param.forEach((item,index)=>{
    for (let name in item){
      console.log(getPage(routerName))
      getPage(routerName).data[name] = item[name]
    }
  })
}

module.exports = {
  triggerFunction: triggerFunction,
  getCompoents: getCompoents,
  getPage: getPage,
  setDataInOtherPage: setDataInOtherPage,
}