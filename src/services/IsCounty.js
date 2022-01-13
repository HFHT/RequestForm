export const isCounty = (googleAddrObj) => {
    var result = googleAddrObj.address_components.filter(obj => obj.types[0] === "administrative_area_level_2")
    console.log(result)
    return (result[0].long_name === "Pima County" ? 'yes' : 'no')
  }