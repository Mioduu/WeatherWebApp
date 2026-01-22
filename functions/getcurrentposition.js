export async function getUserPosition() {
    try {
        if (!("geolocation" in navigator)) {
            throw new Error("Geolocation is not supported in your browser.")
        }

        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                () => reject(new Error("Cannot get your position")),
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            )
        })

        return {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }

    } catch(err) {
        console.error("Error in function getUserPosition:", err)
        return null
    }
}