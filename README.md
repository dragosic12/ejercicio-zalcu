# **Generador de Imágenes con PWA**

Este proyecto es una **aplicación web progresiva (PWA)** que genera imágenes a partir de descripciones textuales utilizando la **API de Hugging Face** y muestra una **notificación** para que los usuarios puedan descargar la imagen generada. La aplicación está construida con **React** y utiliza **Service Workers** para gestionar las notificaciones push.

## **Introducción**

Esta aplicación permite a los usuarios ingresar un texto y seleccionar un estilo para generar una imagen mediante la API de Hugging Face. Una vez que la imagen está lista, se envía una notificación push que permite al usuario descargar la imagen. La aplicación se ha diseñado para funcionar tanto en **navegadores web** como en **dispositivos móviles** cuando se instala como PWA.

## **Tecnologías Utilizadas**

- **React**: Librería de JavaScript para construir la interfaz de usuario.
- **Node.js**: Entorno de ejecución para el backend.
- **Service Workers**: Para gestionar notificaciones push y el almacenamiento en caché de recursos.
- **Hugging Face API**: Para generar imágenes a partir de descripciones textuales.
- **Bootstrap**: Para los estilos.

## **Características**

- **Generación de Imágenes**: Permite a los usuarios generar imágenes basadas en una descripción textual y un estilo seleccionado.
- **Notificaciones Push**: Notifica al usuario cuando la imagen está lista para descargar.
- **Descarga de Imágenes**: Permite a los usuarios descargar la imagen generada en formato PNG.

## **Instalación y Modo de Uso**

No es necesaria la instalación, ya que la aplicación se encuentra en **GitHub Pages**. Con acceder a la URL se puede usar sin problema. El único matiz a tener en cuenta es cuando se descarga la aplicación en dispositivos móviles. En este caso, es necesario conceder permisos para poder recibir notificaciones.

## **Problemas y Soluciones**

- **Varias Imágenes Descargadas**:
  - **Problema**: La aplicación descargaba varias imágenes en lugar de una.
  - **Solución**: Implementé un identificador de imagen único y comparé el ID de la imagen para asegurarme de que solo se descargara la imagen más reciente.

- **Permisos para Notificaciones**:
  - **Problema**: Solicitar permisos para notificaciones no funcionaba como se esperaba.
  - **Solución**: Verifiqué los permisos y aseguré que la solicitud se hiciera correctamente.

- **Problemas en Dispositivos Móviles**:
  - **Problema**: La descarga de imágenes en dispositivos móviles no funcionaba.
  - **Solución**: Ajusté el flujo de trabajo de descarga para asegurarme de que las imágenes se descargaran correctamente, tanto en dispositivos móviles como en navegadores web.

- **Problemas con Depuracion en Dispositivos Moviles**:
  - **Problema**: Supuso un problema la depuración en dispositivos moviles ya que no sabia como hacerlo.
  - **Solución**: Para depurar:

      Conecta tu teléfono al ordenador.
      En Chrome en el ordenador, ve a chrome://inspect/#devices
      En pages le das a la URL que quieras inspeccionar y la inspeccionas
    ![image](https://github.com/user-attachments/assets/ed565f01-e282-4ddc-b9a7-81f900b1ecfb)


- **Error en `createObjectURL`**:
  - **Problema**: Error al crear una URL para el blob de la imagen.
  - **Solución**: Validé que el blob de la imagen estuviera bien formado antes de crear la URL.

## **Aprendizajes**

- **React**: Aprendí a usar React para construir la interfaz de usuario de la aplicación, gestionando estados y efectos secundarios.
- **Node.js**: Utilicé Node.js para gestionar el entorno de desarrollo y las dependencias del proyecto.
- **Service Workers**: Implementé Service Workers para gestionar notificaciones push y almacenamiento en caché, mejorando la funcionalidad offline de la aplicación.
- **Hugging Face API**: Aprendí a integrar la API de Hugging Face para generar imágenes a partir de descripciones textuales.
