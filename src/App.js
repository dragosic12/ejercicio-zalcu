import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Ajusta el nombre del archivo según tu estructura


function App() {
  const [inputText, setInputText] = useState('');  // Para el texto ingresado
  const [imageUrl, setImageUrl] = useState('');    // Para la URL de la imagen generada
  const [loading, setLoading] = useState(false);   // Para mostrar un mensaje mientras se genera la imagen
  const [selectedStyle, setSelectedStyle] = useState('imagen');  // Para el estilo seleccionado
  const [isSubscribed, setIsSubscribed] = useState(false);




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
  
  
  

  // Solicitar permisos para notificaciones push
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
    let isHandlingMessage = false; // Variable para controlar el manejo de mensajes
  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'DOWNLOAD_IMAGE') {
          if (isHandlingMessage) return; // Si ya se está manejando un mensaje, no hacer nada
  
          isHandlingMessage = true; // Establecer la variable para indicar que se está manejando un mensaje
          const imageUrl = event.data.imageUrl;
          
          if (imageUrl) {
            // Crear un enlace temporal para descargar la imagen
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = `${inputText} estilo ${selectedStyle}.png`; // Nombre del archivo para descargar
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
  
          isHandlingMessage = false; // Restablecer la variable después de manejar el mensaje
        }
      });
    }
  }, []);
  
  

  // Función para enviar una notificación push cuando la imagen está lista
  const sendNotification = async (imageUrl) => {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage({
        type: 'SHOW_NOTIFICATION',
        title: 'Imagen lista para descargar',
        options: {
          body: 'Haz clic para descargar tu imagen.',
          icon: imageUrl,
          requireInteraction: true,
          data: { imageUrl }
        }
      });
    } else {
      console.log('El navegador no soporta notificaciones.');
    }
    
  };
  
  
  /*
  Public Key:
  BKYjCwvb9Dlps2i3Qm01LoWDvxa0RGVH_vdPPUUOOcwH7FFW-Q1vAi-X5FLFqtRtn--ueZzl9oesiwgsbaavnk4

  Private Key:
  hGdsGngDnVhHiNhK-C9gaPEEPwaY2pCaSnKPgPRSXQE
  */

  // Función para enviar el texto y generar la imagen
  const handleGenerateImage = async () => {
    setLoading(true);
    const apiToken = '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'; 

    // Combinar el input del usuario con el estilo seleccionado
    const prompt = `${inputText}, estilo: ${selectedStyle}`;

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
        { inputs: prompt }, // El estilo se incluye en el prompt como parte del texto
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',  // Obtener la respuesta en formato de blob (imagen)
        }
      );
      
      const imageBlob = response.data;  // Obtener el blob de la imagen
      const imageObjectURL = URL.createObjectURL(imageBlob);  // Crear una URL para mostrar la imagen
      setImageUrl(imageObjectURL);  // Guardar la URL de la imagen generada

      // Enviar una notificación push cuando la imagen esté lista
      sendNotification(imageObjectURL);
    } catch (error) {
      console.error('Error al generar la imagen:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  

  // Función para borrar el cuadro de texto
  const handleClear = () => {
    setInputText('');
    setImageUrl('');  // Limpiar también la imagen generada
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // Prevenir el salto de línea en el textarea
      handleGenerateImage();  // Ejecutar la generación de la imagen
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
