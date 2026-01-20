export function setBackground(hour) {
    const body = document.body
    if(hour >= 6 && hour < 18) {
        body.classList.add("day")
        body.classList.remove("night")
    } else {
        body.classList.add("night")
        body.classList.remove("day")
    }
}