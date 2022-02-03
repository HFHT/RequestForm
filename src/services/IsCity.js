export const isCity = (googleAddrObj, zipCodeObj) => {
  if (googleAddrObj && googleAddrObj.hasOwnProperty('address_components') && (zipCodeObj)) {
    var result = googleAddrObj.address_components.filter(obj => obj.types[0] === "postal_code")
    var zipInfo = zipCodeObj.filter(obj => obj.ZIP === result[0].long_name)
    return (zipInfo.length === 0 ? 'no' : zipInfo[0].CityOfTucson)
  } else {
    return (null)
  }
}