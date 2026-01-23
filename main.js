// IMPORTY Z FUNKCJAMI
import { setBackground } from "./functions/daynightcycle.js"
import { getCoordinates } from "./functions/geolocation.js" // Koordynaty z Open meteo
import { getUserPosition } from "./functions/getcurrentposition.js"
import { getMoonEmoji } from "./functions/getemoji.js"
import { getUserCity } from "./functions/reverselocation.js"
import { getCityData } from "./functions/getplacename.js"
import { getWeather } from "./functions/getweather.js" // Pogoda z Open meteo
import { getCurrentLocalWeather } from "./functions/getlocalweather.js"

async function getUserLocationData() {
    try {   
        const coords = await getUserPosition()
        console.log(coords)

        if (!coords) {
            console.log("Cannot get your position")
            return
        }

        const place = await getUserCity(coords.lat, coords.lon)

        const { city: userCityName, country: userCountryName } = place

        const userWeatherData = await getWeather(coords.lat, coords.lon)  // NIE RUSZAĆ BO JEBNIE
        
        const userWeatherTime = userWeatherData?.hourly?.time
        const userWeatherDataInfo = userWeatherData?.hourly?.temperature_2m 
        console.log(userWeatherData)
        
        return {
            userCityName: userCityName,
            userCountryName: userCountryName,
            userWeatherData: userWeatherDataInfo,
            userWeatherTime: userWeatherTime
        }

    } catch(err) {
        console.error("Error:", err)
    } 
    
}

function createLocalData(city, country, weather, time) {  // Tworzy lokalne info w rogu
    const localDataDiv = document.getElementById("localUserArea")
    const container = document.createElement("div")
    container.style.display = "flex"
    container.style.flexDirection = "column"
    container.style.gap = "8px"
    container.style.textAlign = "center"
    container.style.fontSize = "18px"
    container.style.border = "3px solid #01162E"
    container.style.borderRadius = "16px"
    container.style.backgroundColor = "#01162E"

    const cityName = document.createElement("div")
    cityName.textContent = city + " " + country
    cityName.style.color = (time >= 6 && time < 18) ? dayPrimaryText : "white"

    let fullLocalInfo = getCurrentLocalWeather(time, weather)
    let weatherInfo = document.createElement("div")
    let emojiDiv = document.createElement("div")

    emojiDiv.textContent = `${fullLocalInfo.hour} ${getMoonEmoji(fullLocalInfo.hour.slice(0,2))}`
    emojiDiv.style.color = (time >= 6 && time < 18) ? dayPrimaryText : "white"
    weatherInfo.textContent = `${fullLocalInfo.temperature}°C`
    weatherInfo.style.color = (time >= 6 && time < 18) ? dayPrimaryText : "white"

    container.append(cityName)
    container.append(emojiDiv)
    container.append(weatherInfo)
    localDataDiv.appendChild(container)

    // TODO: Dodać clickable obiekt żeby sprawdzić aktualną pogode dla lokalizacja użytkownika (będzie super zabawa :DDDD)
}


// ŁADOWANIE DOM
document.addEventListener("DOMContentLoaded", async () => {
    const localData = await getUserLocationData()
    if (localData) {
        createLocalData(localData.userCityName, localData.userCountryName, localData.userWeatherData, localData.userWeatherTime)
    }
    let dayPrimaryText = "#2B2B2B"
    let dayBgColor = "rgba(255, 255, 255, 0.75)"
    const today = new Date()

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]

    const day = today.getDate()
    const monthName = months[today.getMonth()]
    const dayOfTheWeek = daysOfWeek[today.getDay()]
    const currentTime = today.getHours()
    setBackground(currentTime)

    
    const form = document.getElementById("weatherForm") // Cały forms
    const locationInput = document.getElementById("location") // Input do miejscowości
    let currentDateDiv = document.getElementById("currentDate")
    let locationName = document.getElementById("locationName")
    let weatherScrollableBar = document.getElementById("scrollWeatherBar")
    let midWeatherMenu = document.getElementById("midWeather")
    weatherScrollableBar.style.display = "none"
    currentDateDiv.textContent = `${day} ${monthName}, ${dayOfTheWeek}`

    // SCROLLBAR WHEEL EVENT
    weatherScrollableBar.addEventListener("wheel", (e) => {
        e.preventDefault()
        weatherScrollableBar.scrollLeft += e.deltaY

    })
    
    // Funkcja do formsów zwraca mi value wpisane w inputa po naciśnięciu przycisku
    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const hours = new Date().getHours()
        setBackground(hours)
        weatherScrollableBar.innerHTML = ""
        const locationValue = locationInput.value.trim() // Value z boxa
        console.log(`Szukam miasta: ${locationValue}`)

        const coords = await getCoordinates(locationValue) // Koordynaty z inputa
        const cityData = await getCityData(locationValue)

        if(!coords) {
            console.log("Koordynaty nie istnieją elo")
        }
        weatherScrollableBar.style.display = "inline-block"
        const weatherData = await getWeather(coords.lat, coords.lon) // Fetch z pogodą
        const temperatures = weatherData?.hourly?.temperature_2m // Temperaturki
        const time = weatherData?.hourly?.time // Godziny od temperatur
        const formattedTime = time.map(element => `${element.slice(11,16)}`) // Usuwanie daty
        const formattedTemperature = temperatures.map(element => `${element}°C`) // Mapowanie znaczka celsjusza
        locationName.style.display = "flex"
        locationName.style.justifyContent = "center"
        locationName.textContent = `✈ ${cityData.name} ${cityData.country} ${cityData.code}`
        
        // SCROLLBAR
        for(let i = 0; i < 25; i++) {
            const container = document.createElement("div")
            container.style.display = "inline-block"
            container.style.textAlign = "center"
            container.style.padding = "10px"

            const timeTag = document.createElement("div")
            timeTag.textContent = formattedTime[i]
            timeTag.style.fontSize = "0.8em"
            timeTag.style.marginBottom = "4px"
            timeTag.style.color = (hours >= 6 && hours < 18) ? dayPrimaryText : "white"

            const tempTag = document.createElement("div")
            tempTag.textContent = formattedTemperature[i]
            tempTag.style.color = (hours >= 6 && hours < 18) ? dayPrimaryText : "white"

            const emojiTag = document.createElement("div")
            emojiTag.style.fontSize = "1.5em"
            emojiTag.style.margin = "0 0 4px 0"

            const hour = parseInt(formattedTime[i].slice(0, 2))
            console.log(formattedTime[i])
            console.log(formattedTime[i].slice(0,2))
            const emoji = getMoonEmoji(hour)

            emojiTag.textContent = emoji

            if(hours == hour) {
                midWeatherMenu.innerHTML = ""
                midWeatherMenu.style.marginTop = "110px"
                midWeatherMenu.style.display = "flex"
                midWeatherMenu.style.justifyContent = "center"
                midWeatherMenu.style.flexDirection = "column"
                midWeatherMenu.style.alignItems = "center"
                
                let currentWeather = document.createElement("div")
                currentWeather.textContent = "Current Weather:"
                currentWeather.style.fontSize = "3rem"
                currentWeather.style.color = "white"
                currentWeather.style.marginBottom = "10px"
                let timeClone = timeTag.cloneNode(true)
                let emojiClone = emojiTag.cloneNode(true)
                let tempClone = tempTag.cloneNode(true)

                timeClone.style.fontSize = "4rem"
                timeClone.style.color = "white"
                emojiClone.style.fontSize = "4rem"
                tempClone.style.fontSize = "4rem"
                tempClone.style.color = "white"

                if(hours >= 6 && hours < 18) {
                    weatherScrollableBar.style.backgroundColor = dayBgColor
                    weatherScrollableBar.style.border = dayBgColor
                    weatherScrollableBar.style.color = dayPrimaryText
                    currentWeather.style.color = dayPrimaryText
                    timeClone.style.color = dayPrimaryText
                    tempClone.style.color = dayPrimaryText
                }
                midWeatherMenu.appendChild(currentWeather)
                midWeatherMenu.appendChild(timeClone)
                midWeatherMenu.appendChild(emojiClone)
                midWeatherMenu.appendChild(tempClone)
            }

            container.appendChild(timeTag)
            container.appendChild(emojiTag)
            container.appendChild(tempTag)
            weatherScrollableBar.appendChild(container)

            emojiTag.addEventListener("click", () => {
                midWeatherMenu.innerHTML = ""

                let currentWeather = document.createElement("div")
                currentWeather.textContent = "Current Weather:"
                currentWeather.style.fontSize = "3rem"
                currentWeather.style.color = "white"
                currentWeather.style.marginBottom = "10px"

                const timeClone = timeTag.cloneNode(true)
                const emojiClone = emojiTag.cloneNode(true)
                const tempClone = tempTag.cloneNode(true)

                timeClone.style.fontSize = "4rem"
                timeClone.style.color = "white"
                emojiClone.style.fontSize = "4rem"
                tempClone.style.fontSize = "4rem"
                tempClone.style.color = "white"

                midWeatherMenu.appendChild(currentWeather)
                midWeatherMenu.appendChild(timeClone)
                midWeatherMenu.appendChild(emojiClone)
                midWeatherMenu.appendChild(tempClone)
                
            })
            
        }
    })

    

})