// IMPORTY Z FUNKCJAMI
import { setBackground } from "./functions/daynightcycle.js"
import { getCoordinates } from "./functions/geolocation.js" // Koordynaty z Open meteo
import { getMoonEmoji } from "./functions/getemoji.js"
import { getCityData } from "./functions/getplacename.js"
import { getWeather } from "./functions/getweather.js" // Pogoda z Open meteo

// ŁADOWANIE DOM
document.addEventListener("DOMContentLoaded", () => {
    var currentHour = new Date()
        currentHour.getHours()
    setBackground(currentHour)

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

    const form = document.getElementById("weatherForm") // Cały forms
    const locationInput = document.getElementById("location") // Input do miejscowości
    let currentDateDiv = document.getElementById("currentDate")
    let locationName = document.getElementById("locationName")
    let weatherScrollableBar = document.getElementById("scrollWeatherBar")
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
        weatherScrollableBar.innerHTML = ""
        const locationValue = locationInput.value.trim() // Value z boxa
        console.log(`Szukam miasta: ${locationValue}`)

        const coords = await getCoordinates(locationValue) // Koordynaty z inputa
        const cityData = await getCityData(locationValue)

        if(!coords) {
            console.log("Koordynaty nie istnieją elo")
        }
        scrollWeatherBar.style.display = "inline-block"
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

            const tempTag = document.createElement("div")
            tempTag.textContent = formattedTemperature[i]

            const emojiTag = document.createElement("div")
            emojiTag.style.fontSize = "1.5em"
            emojiTag.style.margin = "0 0 4px 0"

            const hour = parseInt(formattedTime[i].slice(0, 2))
            const emoji = getMoonEmoji(hour)

            emojiTag.textContent = emoji

            container.appendChild(timeTag)
            container.appendChild(emojiTag)
            container.appendChild(tempTag)
            weatherScrollableBar.appendChild(container)
            
        }
    })

    

})