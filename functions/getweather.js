export async function getWeather(lat, lon) {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=auto`)

        if(!res.ok) {
            throw new Error(`Błąd sieci: ${res.status}`)
        }

        const data = await res.json()

        console.log("(getWeather) Dane z fetcha: ", data)

        if(!data?.hourly?.temperature_2m?.length)  {
            throw new Error("Brak danych")
        }

        return data

    } catch(err) {
        console.error("Błąd w funkcji getWeather:", err)
    }


}