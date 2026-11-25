# KADRE

Plataforma interactiva en estilo HUD para diseñar una web paso a paso: define el stack técnico, elige plantilla, estilo y colores, carga los contenidos y exporta un repositorio listo para GitHub.

**En producción:** https://kadre-sigma.vercel.app/

## Cómo funciona

Seis pasos: bienvenida → descubrimiento (tipo de proyecto, arquitectura, datos, renderizado, integraciones) → plantilla y secciones → estilo y colores → contenidos → exportación (ZIP con el código, un README y un script para subirlo a GitHub).

Todo ocurre en el navegador: no hay backend ni llamadas a APIs de IA, y no hace falta ninguna variable de entorno. El borrador se guarda en `localStorage`.

Interfaz en español e italiano.

## Desarrollo

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera dist/
npm run lint     # comprobación de tipos
```

## Despliegue

Vercel, conectado a este repositorio: cada push a `main` publica una nueva versión. Preset Vite, comando `npm run build`, salida `dist`.

## Origen

Creada con Google AI Studio (Gemini) como ejercicio de un curso de formación y mantenida después con Claude Code.

© 2026 Raffaele Bini
