export function getMoonEmoji(hour) {
    // DAY CYCLE
    if (hour >= 6 && hour < 9) return "🌞"     
    if (hour >= 9 && hour < 16) return "☀️"    
    if (hour >= 16 && hour < 18) return "🌇"     

    // NIGHT CYCLE
    if (hour >= 18 && hour < 20) return "🌕"
    if (hour >= 20 && hour < 22) return "🌖"
    if (hour >= 22 || hour < 0) return "🌗"
    if (hour >= 0 && hour < 2) return "🌘"
    if (hour >= 2 && hour < 4) return "🌑"
    if (hour >= 4 && hour < 6) return "🌒"
}