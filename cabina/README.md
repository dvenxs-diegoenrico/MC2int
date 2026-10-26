# La Cabina

La segunda capa del sitio. Se entra con **Apagar la luz** y se sale con **prender la luz**.
También se puede entrar directo con un link: `…/#cabina` (el hub) o `…/#cabina/consola` (una estación).

Solo se descarga al apagar la luz: la tienda carga igual que antes.

## Archivos

- `cabina.js`: todo el comportamiento. Al principio está `MEDIA`, el único lugar donde se cambian los placeholders.
- `cabina.css`: los estilos. Solo usa los colores y las tipografías que ya define `index.html`.

## Cómo cambiar un placeholder

1. Pon el archivo en `cabina/img/` (fotos), `cabina/audio/` o `cabina/video/`.
2. En `cabina.js`, dentro de `MEDIA`, escribe la ruta. Por ejemplo: `consola: "cabina/img/consola.jpg"`.
3. Listo: la foto reemplaza su tarjeta "FOTO: …". Si la ruta queda vacía, vuelve el placeholder.

## Placeholders por reemplazar

### Fotos (`MEDIA.photos`)

| Clave        | Dónde aparece                 | Qué foto va                                         |
|--------------|-------------------------------|-----------------------------------------------------|
| `fondo`      | Fondo del hub                 | La cabina completa. Se recorta sola en vertical y horizontal. |
| `ventana`    | Hotspot 06, sala de huéspedes | El vidrio de la cabina hacia la sala                |
| `monitor`    | Hotspot 03, canal mc²         | La tele o el monitor de la cabina                   |
| `archivero`  | Hotspot 04, archivo           | El archivero                                        |
| `consola`    | Hotspot 02, consola           | La consola, los faders                              |
| `perilla`    | Hotspot 01, frecuencia        | La perilla vista desde arriba (cuadrada, se recorta en círculo) |
| `hoja`       | Hotspot 07, acta              | La hoja de sesión (track sheet)                     |
| `ranura`     | Hotspot 05 y estación llave   | La ranura de la llave                               |
| `boveda`     | Llave, contenido oculto       | Lo que abre la llave MC2-TEE-01                     |
| `mits`       | Sala de huéspedes             | Sesión invitada MITS                                |
| `ripe`       | Sala de huéspedes             | Sesión invitada RiPE                                |
| `sonicranch` | Sala de huéspedes             | Sesión invitada Sonic Ranch                         |

### Audio

- `MEDIA.frecuencia`: el fragmento que suena al sintonizar 106.0 MHz (mp3 o m4a). Mientras esté vacío suena un acorde de prueba hecho por el navegador.

### Video

- `MEDIA.canal`: las 4 transmisiones del canal mc² (tx-01 a tx-04). Cada una tiene título y `video`; si `video` está vacío, sale "sin señal". Usa mp4 (H.264) para que funcione en iPhone.

### Textos y datos de prueba

- Frecuencia: las dos líneas del fragmento en superposición (en `cabina.js`, busca `sp-line`).
- Llave: el título y el texto de `MC2-TEE-01` en `LLAVES`. Ahí mismo se agregan más llaves.
- Archivo: `LOTE` ("lote 01 · session 01"). Confirma el número real del lote de lavado.
- Canal: los títulos de las transmisiones.

## Lo que guarda en el navegador

`localStorage["mc2-cabina"]`: llaves abiertas, si ya sintonizó la frecuencia, la posición del fader overdubs y si ya generó su acta.
"Mi lista" sigue en `localStorage["mc2-cart"]`, la misma llave de la tienda. Todo va envuelto en try/catch.
