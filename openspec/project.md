# Proyecto: ClaseFit

## Contexto

ClaseFit es una aplicación móvil desarrollada con React Native y Expo para que un socio de un gimnasio pueda consultar y reservar clases grupales.

Es un MVP frontend-only. No existe backend ni autenticación real. Los datos son locales y las reservas se manejan en memoria.

El único usuario es **Laura Gómez**, quien se considera autenticada al iniciar la aplicación.

## Stack

- React Native
- Expo
- TypeScript
- Expo Router
- React Context API
- React Native StyleSheet
- Jest
- Datos locales/mock

## Estructura

- `app/`: rutas y pantallas de Expo Router.
- `src/components/`: componentes reutilizables.
- `src/context/`: estado global mediante Context API.
- `src/hooks/`: hooks reutilizables.
- `src/types/`: tipos TypeScript compartidos.
- `src/utils/`: funciones auxiliares y lógica reutilizable.
- `mock-data/`: datos locales de las clases.

## Estado

- El estado global se maneja mediante React Context API.
- Las reservas de Laura se mantienen en memoria.
- No utilizar Redux, Zustand, MobX ni otras librerías de estado global.
- Podemos usar AsyncStorage para que los cambios que el usuario haga en la App sean persistidos al cerrarla.

## Estilos

- Utilizar `StyleSheet` de React Native.
- No utilizar Tailwind, NativeWind, styled-components ni librerías externas de UI.

## Datos

- La aplicación no utiliza backend ni APIs externas.
- Las clases iniciales se encuentran en `mock-data/clases.json`.
- No introducir networking o servicios externos salvo que se solicite explícitamente.

## Arquitectura

- Mantener la solución simple y apropiada para un MVP.
- Mantener la lógica de negocio separada de la UI.
- Evitar API clients o capas de abstracción innecesarias.
- Reutilizar componentes, hooks y utilidades existentes.
- No agregar dependencias sin una necesidad clara.
- Usar Context API para estado global.
- Usar datos locales; no introducir backend ni APIs.
- Usar StyleSheet para estilos.

## Convenciones

- Utilizar TypeScript.
- Evitar any.
- Utilizar nombres descriptivos.
- Mantener componentes pequeños y enfocados.
- Preferir funciones simples y fáciles de probar.
- Mantener los cambios relacionados con la tarea solicitada.

## Testing

- Utilizar Jest para las pruebas unitarias.
- Priorizar pruebas de funciones puras y lógica de negocio sobre pruebas de implementación interna de componentes.
- Los tests deben ser deterministas y no depender de red, APIs externas, fecha real del sistema ni estado persistente.
- Utilizar datos controlados y mocks cuando sea necesario.
- Los nombres de los tests deben describir el comportamiento esperado.
- Ejecutar todas las pruebas con npm test antes de considerar una tarea terminada.
- Cada regla de negocio RN-01 a RN-04 debe tener al menos una prueba correspondiente a su escenario esperado.


## Desarrollo

Instalar dependencias:

```bash
npm install

## Desarrollo

Instalar dependencias:

```bash
npm install
```

Correr el proyecto en el emulador de Android:

```bash
npm run android
```

Ejecutar pruebas:
```bash
npm test
```
