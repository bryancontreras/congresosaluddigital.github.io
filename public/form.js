document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    const participacionSelect = document.getElementById('participacion');
    
    // Mostrar/ocultar secciones según tipo de participación
    participacionSelect.addEventListener('change', function(e) {
      const valor = e.target.value;
      ['Poster', 'Hack', 'Stand'].forEach(type => {
        document.getElementById('seccion' + type).classList.add('oculto');
      });
      
      if (valor === 'poster') document.getElementById('seccionPoster').classList.remove('oculto');
      else if (valor === 'hackathon') document.getElementById('seccionHack').classList.remove('oculto');
      else if (valor === 'stand') document.getElementById('seccionStand').classList.remove('oculto');
      
      // Actualizar campos requeridos
      actualizarCamposRequeridos(valor);
    });
    
    // Validación del formulario antes de enviar
    form.addEventListener('submit', function(e) {
      const participacion = participacionSelect.value;
      
      if (participacion === 'poster') {
        const tituloPoster = document.querySelector('[name="tituloPoster"]').value;
        const archivoPoster = document.querySelector('[name="archivoPoster"]').files[0];
        
        if (!tituloPoster) {
          e.preventDefault();
          mostrarError('Por favor, ingresa el título del póster');
          return;
        }
        
        if (!archivoPoster) {
          e.preventDefault();
          mostrarError('Por favor, adjunta el archivo PDF del póster');
          return;
        }
        
        if (archivoPoster.size > 10 * 1024 * 1024) { // 10MB
          e.preventDefault();
          mostrarError('El archivo no debe superar 10MB');
          return;
        }
      }
      
      if (participacion === 'hackathon') {
        const nombreEquipo = document.querySelector('[name="nombreEquipo"]').value;
        const integrantes = document.querySelector('[name="integrantes"]').value;
        
        if (!nombreEquipo || !integrantes) {
          e.preventDefault();
          mostrarError('Por favor, completa todos los campos del hackathon');
          return;
        }
      }
      
      if (participacion === 'stand') {
        const empresa = document.querySelector('[name="empresa"]').value;
        const descStand = document.querySelector('[name="descStand"]').value;
        
        if (!empresa || !descStand) {
          e.preventDefault();
          mostrarError('Por favor, completa todos los campos del stand');
          return;
        }
      }
      
      // Mostrar mensaje de carga
      document.getElementById('loadingMessage').classList.remove('oculto');
    });
    
    // Función para actualizar campos requeridos según tipo de participación
    function actualizarCamposRequeridos(tipo) {
      // Quitar todos los required
      document.querySelectorAll('#seccionPoster input, #seccionHack input, #seccionHack textarea, #seccionStand input, #seccionStand textarea').forEach(el => {
        el.required = false;
      });
      
      // Añadir required según tipo
      if (tipo === 'poster') {
        document.querySelector('[name="tituloPoster"]').required = true;
        document.querySelector('[name="archivoPoster"]').required = true;
      } else if (tipo === 'hackathon') {
        document.querySelector('[name="nombreEquipo"]').required = true;
        document.querySelector('[name="integrantes"]').required = true;
      } else if (tipo === 'stand') {
        document.querySelector('[name="empresa"]').required = true;
        document.querySelector('[name="descStand"]').required = true;
      }
    }
    
    // Función para mostrar mensaje de error
    function mostrarError(mensaje) {
      const errorDiv = document.getElementById('errorMessage');
      errorDiv.textContent = mensaje;
      errorDiv.classList.remove('oculto');
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        errorDiv.classList.add('oculto');
      }, 5000);
    }
    
    // Inicializar (por si hay un valor preseleccionado)
    if (participacionSelect.value) {
      const evento = new Event('change');
      participacionSelect.dispatchEvent(evento);
    }
  });