document.addEventListener('DOMContentLoaded', function() {
    // Los elementos de la cuenta regresiva
    const daysElem = document.getElementById('countdown-days');
    const hoursElem = document.getElementById('countdown-hours');
    const minutesElem = document.getElementById('countdown-minutes');
    const secondsElem = document.getElementById('countdown-seconds');
    
    // Verificar si todos los elementos existen
    if (!daysElem || !hoursElem || !minutesElem || !secondsElem) {
        console.error('Elementos de la cuenta regresiva no encontrados');
        return; // Salir si no existen
    }
    
    // Fecha del evento (24 de Septiembre de 2025)
    const eventDate = new Date('2025-09-25T00:00:00').getTime();
    
    // Función para actualizar el contador
    function updateCounter() {
        // Fecha actual
        const now = new Date().getTime();
        
        // Diferencia de tiempo
        const timeRemaining = eventDate - now;
        
        // Si la fecha ya pasó
        if (timeRemaining <= 0) {
            daysElem.textContent = '0';
            hoursElem.textContent = '00';
            minutesElem.textContent = '00';
            secondsElem.textContent = '00';
            return;
        }
        
        // Cálculos de tiempo
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Actualizar el HTML
        daysElem.textContent = days;
        hoursElem.textContent = hours.toString().padStart(2, '0');
        minutesElem.textContent = minutes.toString().padStart(2, '0');
        secondsElem.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Ejecutar una vez inmediatamente
    updateCounter();
    
    // Luego actualizar cada segundo
    setInterval(updateCounter, 1000);
});