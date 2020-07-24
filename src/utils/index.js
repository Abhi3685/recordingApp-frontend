export function formatTime(secs) {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":")
}

export function toggleMenu(e) {
    var menuRef = e.target.parentElement.parentElement.querySelector(".menuWrapper");
    if (menuRef.style.display === 'none' || menuRef.style.display === '') {
        var menus = document.querySelectorAll(".menuWrapper");
        menus.forEach(menu => {
            menu.style.display = 'none';
        });
        menuRef.style.display = 'block';
    } else {
        menuRef.style.display = 'none';
    }
}

export function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function pad(num) {
    return ("0" + num).slice(-2);
}

export function hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}
