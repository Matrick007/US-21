// Укажите дату и время начала отсчета (например, 1 января 2025 года, 00:00:00)
const startDate = new Date('2025-04-28T00:00:00');

function updateTimer() {
    const now = new Date();
    const timeDiff = now - startDate; // Разница в миллисекундах

    if (timeDiff < 0) {
        // Если текущая дата раньше startDate, показываем 0
        document.getElementById('timeElapsed').textContent = 
            `0 дней, 0 часов, 0 минут, 0 секунд`;
        return;
    }

    // Вычисляем дни, часы, минуты и секунды
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Обновляем текст на странице
    document.getElementById('timeElapsed').textContent = 
        `${days} дней, ${hours} часов, ${minutes} минут, ${seconds} секунд`;
}

// Обновляем таймер каждую секунду
setInterval(updateTimer, 1000);

// Вызываем сразу, чтобы не ждать секунду при загрузке
updateTimer();
