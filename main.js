// IMPORTY Z FUNKCJAMI
import { getCoordinates } from "./functions/geolocation.js" // Koordynaty z Open meteo
import { getWeather } from "./functions/getweather.js" // Pogoda z Open meteo

// ŁADOWANIE DOM
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("weatherForm") // Cały forms
    const locationInput = document.getElementById("location") // Input do miejscowości
    const weatherTable = document.querySelector("#weatherTable tbody")
    const cold = "🥶"
    const hot = "🔥"
    const neutral = "⛅"
    


    // Funkcja do formsów zwraca mi value wpisane w inputa po naciśnięciu przycisku
    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const locationValue = locationInput.value.trim() // Value z boxa
        console.log(`Szukam miasta: ${locationValue}`)

        const coords = await getCoordinates(locationValue) // Koordynaty z inputa

        if(!coords) {
            console.log("Koordynaty nie istnieją elo")
        }

        weatherTable.innerHTML = ""
        const weatherData = await getWeather(coords.lat, coords.lon) // Fetch z pogodą
        const temperatures = weatherData?.hourly?.temperature_2m // Temperaturki
        const time = weatherData?.hourly?.time // Godziny od temperatur
        const formattedTime = time.map(element => `${element.slice(11,16)}`) // Usuwanie daty
        const formattedTemperature = temperatures.map(element => `${element}°C`) // Mapowanie znaczka celsjusza


        // EMOTKI
        for(let i = 0; i < 25; i++) {
            const temp = temperatures[i]

            if(temp <= 9) {
                formattedTemperature[i] += cold
            } else if (temp <= 20) {
                formattedTemperature[i] += neutral
            } else {
                formattedTemperature[i] += hot
            }
        }
        
        // TABELKA
        for(let i = 0; i < 25; i++) {
            const tr = document.createElement("tr")

            const tdTime = document.createElement("td")
            tdTime.textContent = `- ${formattedTime[i]} `

            const tdTemp = document.createElement("td")
            tdTemp.textContent = `: ${formattedTemperature[i]}`

            tr.append(tdTime, tdTemp)
            weatherTable.appendChild(tr)
        }
    })

    

})