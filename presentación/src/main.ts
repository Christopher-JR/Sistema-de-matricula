import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
// IMPORTO BOOTSTRAP APPLICATION PARA INICIALIZAR LA APLICACIONY EL RECIBE A APP QUE ES EL 
// COMPONENTE PRINCIPAL Y appConfig QUE ES LA CONFIGURACION DE LA APLICACION
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
