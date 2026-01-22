export async function getUserCity(lat, lon) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            {
                headers: { "User-Agent": "WeatherAPP"}
            }
        )

        if(!res.ok) {
            throw new Error(`Błąd sieci: ${res.status}`)
        }

        const data = await res.json()
        const address = data.address

        return {
            city: address.city || address.town || address.village || address.hamlet || null,
            country: address.country || null
        }
        
    } catch(err) {
        console.error("Error reverseGeocode: ", err)
        return null
    }
}