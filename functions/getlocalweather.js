export function getCurrentLocalWeather(timeArray, tempArray) {
    if(!timeArray || !tempArray) {
        return null
    }

    const now = new Date().getHours()

    for(let i = 0; i < timeArray.length; i++) {
        const apiHour = new Date(timeArray[i]).getHours()
        if(apiHour === now) {
            return {
                hour: timeArray[i].slice(11,16),
                temperature: tempArray[i]
            }       
        }
    }

    return { hour: "??", temperature: "Idk"}
}