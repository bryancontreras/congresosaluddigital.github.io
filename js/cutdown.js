document.addEventListener('DOMContentLoaded', function() {
    // Fecha del evento (24 de Septiembre de 2025)
    const eventDate = new Date('2025-09-24T00:00:00');
    
    // Elementos del contador
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');
    
    // Función para actualizar la cuenta regresiva
    function updateCountdown() {
        const now = new Date();
        const diff = eventDate - now;
        
        // Verificar si la fecha ya pasó
        if (diff <= 0) {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }
        
        // Cálculo de días, horas, minutos y segundos
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Actualizar los elementos HTML con formato de dos dígitos
        daysElement.textContent = days;
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Actualizar la cuenta regresiva cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
});