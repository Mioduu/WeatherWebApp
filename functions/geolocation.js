export async function getCoordinates(city) {
    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`)

        if(!res.ok) {
            throw new Error(`Błąd sieci: ${res.status}`)
        }

        const data = await res.json()

        console.log("(getCoordinates) Dane z fetcha: ", data)

        if(!data || !data.results || data.results.length === 0)  {
            throw new Error("Nie odnaleziono miasta: ", city)
        }

        return {
            lat: data.results[0].latitude,
            lon: data.results[0].longitude   
        } 

    } catch(err) {
        console.error("Błąd w funkcji getCoordinates:", err)
        return null
    }
    
}
