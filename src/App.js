import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('imagen');
  const [lastImageId, setLastImageId] = useState(''); // Añadir estado para ID de la última imagen

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/ejercicio-zalcu/service-worker.js')
        .then(registration => {
          console.log('Service Worker registrado con éxito:', registration);
        })
        .catch(error => {
          console.log('Error al registrar el Service Worker:', error);
        });
    } else {
      console.log('Service Worker no es compatible en este navegador.');
    }
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Permiso para notificaciones concedido.');
        }
      });
    }
  }, []);

  useEffect(() => {
    let isHandlingMessage = false;
  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'DOWNLOAD_IMAGE') {
          if (isHandlingMessage) return;

          isHandlingMessage = true;
          const imageUrl = event.data.imageUrl;
          const imageId = event.data.imageId;

          if (imageUrl && imageId === lastImageId) { // Comparar ID de imagen
            const cleanInputText = inputText.replace(/[\/:*?"<>|]/g, '');
            const cleanSelectedStyle = selectedStyle.replace(/[\/:*?"<>|]/g, '');
            const fileName = `${cleanInputText} estilo ${cleanSelectedStyle}.png`;

            console.log('fileName:', fileName);

            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }

          isHandlingMessage = false;
        }
      });
    }
  }, [inputText, selectedStyle, lastImageId]); // Agregar lastImageId a las dependencias

  const sendNotification = async (imageUrl) => {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      const imageId = new Date().toISOString(); // Generar un ID único para la imagen

      registration.active.postMessage({
        type: 'SHOW_NOTIFICATION',
        title: 'Imagen lista para descargar',
        options: {
          body: 'Haz clic para descargar tu imagen.',
          icon: imageUrl,
          requireInteraction: true,
          data: { imageUrl, imageId } // Enviar el ID único
        }
      });

      setLastImageId(imageId); // Establecer el ID de la imagen como la última imagen
    } else {
      console.log('El navegador no soporta notificaciones.');
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    const apiToken = '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';

    const prompt = `${inputText}, estilo: ${selectedStyle}`;

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );
      
      const imageBlob = response.data;
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImageUrl(imageObjectURL);

      sendNotification(imageObjectURL);
    } catch (error) {
      console.error('Error al generar la imagen:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setImageUrl('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateImage();
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ backgroundColor: '#333', color: '#fff', padding: '20px', borderRadius: '8px' }}>
      <div className="row">
        <div className="col-md-6">
          <h1>Generador de Imágenes</h1>
          <div className="input mt-3">
            <label>Describe la imagen que quieres generar:</label>
            <textarea
              className="form-control hs-input hs-fieldtype-textarea"
              value={inputText}
              onKeyDown={handleKeyPress}
              onChange={(e) => setInputText(e.target.value)}
              placeholder=""
              rows="5"
              disabled={loading}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="selectStyle">Selecciona el estilo:</label>
            <select
              id="selectStyle"
              className="form-control"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              disabled={loading}
            >
              <option value="imagen">Imagen</option>
              <option value="dibujo">Dibujo</option>
              <option value="ciberpunk neon suelo mojado">Ciberpunk neon suelo mojado</option>
              <option value="en la luna">En la luna</option>
            </select>
          </div>
          <div className="d-grid mt-3">
            <button className="shadow-primary silicon-button btn btn-primary btn-lg rounded-pill mb-2" onClick={handleGenerateImage} disabled={loading}>
              {loading ? 'Generando Imagen...' : 'Generar Imagen'}
            </button>
            <button className="shadow-danger silicon-button btn btn-danger btn-lg rounded-pill mb-3" onClick={handleClear} disabled={loading}>Borrar</button>
            <h3>Instrucciones de uso:</h3>
            <p>Para generar una imagen a partir de un texto, introduce lo que quieres que la IA genere. Pulsa <strong>Enter</strong> o haz clic en <strong>Generar imagen</strong>.
            Tambien puedes filtrar la imagen con el menu desplegable en el cual se puede seleccionar el tipo de imagen que se quiere generar. Por defecto mostrará imágenes</p>
          </div>
        </div>
        <div className="col-md-6">
          {imageUrl && (
            <div>
              <h1>Imagen Generada:</h1>
              <img src={imageUrl} alt="Imagen Generada" className="img-fluid mt-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
