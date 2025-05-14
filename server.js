require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Configuración de Google API
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

const sheets = google.sheets({
  version: 'v4',
  auth: oauth2Client
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para manejar el envío del formulario
app.post('/upload', upload.single('archivoPoster'), async (req, res) => {
  try {
    // Datos del formulario
    const formData = req.body;
    
    // ID de la hoja de cálculo de Google Sheets (reemplazar con tu ID real)
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    // ID de la carpeta de Google Drive para los archivos PDF (reemplazar con tu ID real)
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    
    // Preparar datos para Google Sheets
    let rowData = [
      formData.nombre,
      formData.email,
      formData.participacion,
      new Date().toISOString()
    ];
    
    // Agregar datos específicos según el tipo de participación
    switch (formData.participacion) {
      case 'poster':
        rowData.push(formData.tituloPoster || '');
        // Si hay archivo, guardar su nombre
        if (req.file) {
          rowData.push(req.file.originalname || '');
        } else {
          rowData.push('');
        }
        rowData.push(''); // campos vacíos para otros tipos
        rowData.push('');
        rowData.push('');
        rowData.push('');
        break;
      case 'hackathon':
        rowData.push(''); // vacío para título poster
        rowData.push(''); // vacío para archivo
        rowData.push(formData.nombreEquipo || '');
        rowData.push(formData.integrantes || '');
        rowData.push(''); // vacío para empresa
        rowData.push(''); // vacío para descripción stand
        break;
      case 'stand':
        rowData.push(''); // vacío para título poster
        rowData.push(''); // vacío para archivo
        rowData.push(''); // vacío para nombre equipo
        rowData.push(''); // vacío para integrantes
        rowData.push(formData.empresa || '');
        rowData.push(formData.descStand || '');
        break;
      default:
        // Asistencia regular
        rowData.push(''); // Campos vacíos para los otros tipos
        rowData.push('');
        rowData.push('');
        rowData.push('');
        rowData.push('');
        rowData.push('');
    }
    
    // Guardar datos en Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Registros!A:J', // Ajustar según tu hoja
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData]
      }
    });
    
    // Si hay archivo, subir a Google Drive
    let fileUrl = '';
    if (req.file && formData.participacion === 'poster') {
      const fileMetadata = {
        name: req.file.originalname,
        parents: [folderId]
      };
      
      const media = {
        mimeType: 'application/pdf',
        body: fs.createReadStream(req.file.path)
      };
      
      const driveResponse = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,webViewLink'
      });
      
      fileUrl = driveResponse.data.webViewLink;
      
      // Actualizar URL del archivo en Google Sheets
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Registros!G${rowData[0]}`, // Ajustar según tu hoja
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[fileUrl]]
        }
      });
      
      // Eliminar archivo local
      fs.unlinkSync(req.file.path);
    }
    
    res.redirect('/success.html');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Ocurrió un error al procesar tu registro. Por favor, intenta nuevamente.');
  }
});

// Página de éxito
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});