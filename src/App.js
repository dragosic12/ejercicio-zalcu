import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Ajusta el nombre del archivo según tu estructura

function App() {
  const [inputText, setInputText] = useState('');  // Para el texto ingresado
  const [imageUrl, setImageUrl] = useState('');    // Para la URL de la imagen generada
  const [loading, setLoading] = useState(false);   // Para mostrar un mensaje mientras se genera la imagen
  const [selectedStyle, setSelectedStyle] = useState('imagen');  // Para el estilo seleccionado

  if ('serviceWorker' in navigator) {
    
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registrado con éxito:', registration);
        })
        .catch(error => {
          console.log('Error al registrar el Service Worker:', error);
        });
    
  } else {
    console.log('Service Worker no es compatible en este navegador.');
  }
  

   /*
  Public Key:
  BKYjCwvb9Dlps2i3Qm01LoWDvxa0RGVH_vdPPUUOOcwH7FFW-Q1vAi-X5FLFqtRtn--ueZzl9oesiwgsbaavnk4

  Private Key:
  hGdsGngDnVhHiNhK-C9gaPEEPwaY2pCaSnKPgPRSXQE
  */

  const subscribeUser = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BKYjCwvb9Dlps2i3Qm01LoWDvxa0RGVH_vdPPUUOOcwH7FFW-Q1vAi-X5FLFqtRtn--ueZzl9oesiwgsbaavnk4')
      });
      console.log('Usuario suscrito:', subscription);
      // Aquí podrías enviar el subscription.endpoint a tu servidor para gestionarlo
    } else {
      console.log('PushManager no está disponible en este navegador.');
    }
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

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

  const sendNotification = async (imageUrl) => {
    const registration = await navigator.serviceWorker.ready;
  
    // Verificar si es un dispositivo Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isDesktop = !isAndroid; // Consideramos que si no es Android, es escritorio (aunque podría ser iOS u otro)
  
    let notificationOptions = {
      body: 'Haz clic para descargar tu imagen.',
      icon: imageUrl,
      requireInteraction: true,  // Mantener la notificación visible hasta que se haga clic
    };
  
    if (isAndroid) {
      // Opciones específicas para Android (puedes personalizar si es necesario)
      notificationOptions.body = 'Tu imagen está lista en Android. Haz clic para descargarla.';
    } else if (isDesktop) {
      // Opciones específicas para escritorio
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Imagen lista para descargar', {
          body: 'Haz clic para descargar tu imagen.',
          icon: imageUrl,  // Opcional: Puedes mostrar la imagen generada como ícono de la notificación
          requireInteraction: true,  // Mantener la notificación visible hasta que se haga clic
        });
  
        notification.onclick = () => {
          // Crear un enlace temporal para descargar la imagen
          const a = document.createElement('a');
          a.href = imageUrl;
          a.download = `${inputText} estilo ${selectedStyle}.png`;  // Nombre del archivo que se descargará
          document.body.appendChild(a);  // Agregar el enlace al DOM
          a.click();  // Simular el clic para descargar la imagen
          document.body.removeChild(a);  // Eliminar el enlace después de la descarga
        };
      }
    }
  
    // Mostrar notificación
    registration.showNotification('Imagen lista para descargar', notificationOptions);
  };


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
