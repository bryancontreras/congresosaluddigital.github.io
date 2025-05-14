// Mostrar/ocultar secciones según tipo de participación
document.getElementById('participacion').addEventListener('change', function(e) {
    const valor = e.target.value;
    ['Poster','Hack','Stand'].forEach(type => {
      document.getElementById('seccion' + type).classList.add('oculto');
    });
    if (valor === 'poster')      document.getElementById('seccionPoster').classList.remove('oculto');
    else if (valor === 'hackathon') document.getElementById('seccionHack').classList.remove('oculto');
    else if (valor === 'stand')   document.getElementById('seccionStand').classList.remove('oculto');
  });