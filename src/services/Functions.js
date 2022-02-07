// Merge two arrays based using one of the properties as the key
// The target array will be changed, the source array will provide the new data
// usage: mergeByProperty(target, source, 'name');

export function mergeByProperty (target, source, prop) {
    console.log(target,source,prop)
    source.forEach(sourceElement => {
      let targetElement = target.find(targetElement => {
        return sourceElement[prop] === targetElement[prop];
      })
      targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
    })
  }
  

  export function whichBrowser(){    
    let browserInfo = {}
    let userAgent = navigator.userAgent;
    let browserName;    
    browserInfo.userAgent = navigator.userAgent
    browserInfo.userAgentData = navigator.userAgentData
    browserInfo.cookieEnabled = navigator.cookieEnabled
    browserInfo.connection = navigator.connection
    browserInfo.language = navigator.language

    if(userAgent.match(/chrome|chromium|crios/i)){
        browserName = "chrome";
      }else if(userAgent.match(/firefox|fxios/i)){
        browserName = "firefox";
      }  else if(userAgent.match(/safari/i)){
        browserName = "safari";
      }else if(userAgent.match(/opr\//i)){
        browserName = "opera";
      } else if(userAgent.match(/edg/i)){
        browserName = "edge";
      }else{
        browserName="No browser detection";
      }
    browserInfo.browserName = browserName
    return (browserInfo)
}