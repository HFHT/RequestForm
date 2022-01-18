export const isCity = (googleAddrObj, zipCodeObj) => {
  console.log(googleAddrObj, zipCodeObj)  
    if (googleAddrObj.hasOwnProperty('address_components') && (zipCodeObj)) {
      var result = googleAddrObj.address_components.filter(obj => obj.types[0] === "postal_code")
      console.log(result)
      console.log(zipCodeObj)
      var zipInfo = zipCodeObj.ZipCodes.filter(obj => obj.ZIP === result[0].long_name)
      console.log(zipInfo)
      return (zipInfo.length === 0 ? 'no' : zipInfo[0].CityOfTucson)
    } else {
      return (null)
    }
  }