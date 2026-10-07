# Checklist de release · ClaseFit

## Listo en el proyecto
- [x] Nombre, `slug` y versión en `app.json`
- [x] `android.package` e `ios.bundleIdentifier` configurados con `com.keppri.clasefit.daviddiazh`
- [x] `eas.json` con perfiles `preview` y `production`
- [ ] (Bonus) Build instalable · enlace: pendiente, requiere login de EAS y ejecución de `eas build --platform android --profile preview`

## Falta para Google Play
- [ ] Cuenta de desarrollador de Google Play activa
- [ ] Ficha de la app en Google Play Console completada
- [ ] Capturas, texto promocional, icono, categoría y política de privacidad
- [ ] Información de privacidad y seguridad de datos revisada
- [ ] Clasificación de contenido y consentimiento si aplica
- [ ] Pruebas reales en Android y firma de release

## Falta para App Store
- [ ] Cuenta Apple Developer activa
- [ ] App Store Connect configurado con la app y permisos de acceso
- [ ] Información de la app, capturas, texto de marketing y privacidad
- [ ] Labels de privacidad y consentimiento de datos completados
- [ ] TestFlight para validación de QA con usuarios internos o externos
- [ ] Pruebas reales en iOS y revisión final antes de publicar

## Riesgos o bloqueos para publicar
- [x] Validar que no hay dependencias faltantes para web y que la app funciona en dispositivos reales
- [x] Confirmar que la app cumple la política de privacidad y requisitos de Google/App Store
- [ ] Generar el certificado y el perfil de firma antes del primer release oficial
