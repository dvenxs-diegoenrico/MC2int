# La Cabina

La segunda capa del sitio. **Apagar la luz** oscurece la tienda (el print brilla, como antes) y hace aparecer el botón **La cabina**: solo con la luz apagada se puede entrar. Dentro, **prender la luz** (o el apagador de la pared 08) te regresa a la tienda con la luz prendida.
También se puede entrar directo con un link: `…/#cabina` (el hub) o `…/#cabina/consola` (una estación).

Solo se descarga al apagar la luz: la tienda carga igual que antes.

## Archivos

- `cabina.js`: todo el comportamiento. Al principio está `MEDIA`, el único lugar donde se cambian los placeholders.
- `cabina.css`: los estilos. Solo usa los colores y las tipografías que ya define `index.html`.

## Cómo cambiar un placeholder

1. Pon el archivo en `cabina/img/` (fotos), `cabina/audio/` o `cabina/video/`.
2. En `cabina.js`, dentro de `MEDIA`, escribe la ruta. Por ejemplo: `consola: "cabina/img/consola.jpg"`.
3. Listo: la foto reemplaza su tarjeta "FOTO: …". Si la ruta queda vacía, vuelve el placeholder.

## El cuarto (220°)

El hub es **un solo cuarto**: una panorámica de la cabina (`photos/cabina-panoramica.jpg`, generada con la IA de Canva)
envuelta en una curva de 220° alrededor del fan. Se mira libremente de lado a lado: arrastrando, con ‹ ›,
con las flechas del teclado, con Tab (el cuarto voltea a cada objeto) o con "mover el teléfono". La vista
se detiene en los bordes de la foto.

Los objetos (`OBJECTS` en `cabina.js`) son lugares de la foto, con su tamaño real: x, y son su centro y
w, h su tamaño, en % de la panorámica. De izquierda a derecha: el apagador (diminuto, prender la luz),
el archivero, la consola, la perilla, el vidrio (aquí empiezas), la ranura, la tele y la hoja de sesión.
Si cambias la panorámica, mueve los objetos a donde estén las cosas en la foto nueva.

En el cuarto hay una mira al centro, como en un videojuego: el objeto que miras se ilumina y al tocar la mira entras.

## Las estaciones (primera persona)

Cada estación es el objeto mismo, a pantalla completa: atrás su mundo (`MEDIA.scenes`), arriba el HUD
(regresar y el nombre) y abajo una pista de lo que puedes hacer.

| Estación | Es… | Escena |
|---|---|---|
| frecuencia | un radio: escala con aguja, estática en el aire, perilla | `photos/escena-frecuencia.jpg` |
| consola | la mesa: display de la toma, VU que se mueven al ritmo (~84 bpm), faders | `photos/cabina-consola.jpg` |
| canal | la tele: pantalla completa y botones de canal | `photos/cabina-monitor.jpg` |
| archivo | el cajón abierto: fichas que se hojean | `photos/escena-archivo.jpg` |
| llave | el panel: display LCD y la ranura donde entra la tarjeta | `photos/escena-llave.jpg` |
| el equipo | el vidrio: el dibujo de Héctor pegado en él, con todos los que fueron a Sonic Ranch | `photos/sesion-sala-en-vivo.jpg` (foto real) |
| acta | la hoja de sesión: firmas en ella y se voltea en tu acta | `photos/cabina-hoja.jpg` |

Las escenas nuevas (`escena-*.jpg`) se generaron con la IA de Canva. Para cambiar una, reemplaza el archivo o la ruta en `MEDIA.scenes`.

## Placeholders por reemplazar

### Fotos (`MEDIA.photos`)

Los 8 objetos del cuarto (ventana, monitor, archivero, consola, perilla, hoja, ranura y apagador) ya tienen
imagen: se generaron con la IA de Canva en el estilo de las polaroids de la sesión y viven en
`photos/cabina-*.jpg`. Los originales están en el diseño de Canva "MC² · fotos para La Cabina".
Cuando tengas fotos reales de la cabina, reemplaza el archivo o cambia la ruta en `MEDIA`.
Una panorámica real de la cabina puede reemplazar a la generada.

| Clave        | Dónde aparece                 | Qué foto va                                         |
|--------------|-------------------------------|-----------------------------------------------------|
| `fondo`      | Pared 04, el vidrio           | Lo que se ve por el vidrio (hoy: la sala de grabación). |
| `ventana`    | Hotspot 06, el equipo         | El vidrio de la cabina hacia la sala                |
| `apagador`   | Pared 08                      | El apagador de la cabina                            |
| `monitor`    | Hotspot 03, canal mc²         | La tele o el monitor de la cabina                   |
| `archivero`  | Hotspot 04, archivo           | El archivero                                        |
| `consola`    | Hotspot 02, consola           | La consola, los faders                              |
| `perilla`    | Hotspot 01, frecuencia        | La perilla vista desde arriba (cuadrada, se recorta en círculo) |
| `hoja`       | Hotspot 07, acta              | La hoja de sesión (track sheet)                     |
| `ranura`     | Hotspot 05 y estación llave   | La ranura de la llave                               |
| `boveda`     | Llave, contenido oculto       | Lo que abre la llave MC2-TEE-01                     |

### El equipo (`EQUIPO` en `cabina.js`)

La estación 06 es el dibujo que hizo Héctor (`photos/equipo-dibujo-hector.jpg`) de todos los que fueron a
Sonic Ranch: Héctor, Gü, Greta, Jere, Nava, Jack Kool, Rabi, Dany Dstance y Felipe. Cada persona es un botón
sobre el dibujo; al tocarla "colapsa" y aparece su ficha.

- Roles (integrantes de DSTANCE en Sonic Ranch): Rabi, bajo · Jere, batería · Gü, guitarra · Yakult (Jack Kool en el dibujo), teclado y synths · Greta, voz · Nava, fotógrafo y cafetero · Felipe, ingeniero · Dany, DSTANCE · Héctor, músico y productor (hizo el dibujo). Se cambian en `rol`; el nombre del dibujo va en `dibujo`.
- Fotos: `photos/equipo-<nombre>.jpg` (640 px), del rollo 120 y las Polaroids de Sonic Ranch. Se cambian en `foto`; `pelicula` es `"120"` o `"polaroid"` (la Polaroid lleva su marco blanco). Al colapsar a alguien, su foto se revela. Nava aún no tiene foto.
- Si cambias el dibujo, mueve `x, y, w, h` de cada persona (centro y tamaño, en % del dibujo).

### Audio

- **Consola** (`MEDIA.consola`): los 7 stems oficiales de *Todo Cae* (mezcla de Nach v2, carpeta de Drive "Stems Todo Cae"), uno por canal: voz (Lead All), coros (BVs All), guitarras (EG All), teclados (Keys All), bajo (Bass A), batería (Drums A) y **overdubs** (Synth All: los sintes que se grabaron encima de la toma). 60 s desde 1:48, en `cabina/audio/todo-cae-*.m4a`. Cada canal tiene su VU con el nivel real, solo (s) y mute (m); en el teléfono la consola se desliza de lado. El fader overdubs suena (sube o baja los sintes) y además decide la toma del acta: abajo de la mitad, "recorded live" (foco rojo); arriba, "some overdubs" (foco verde). Con todos en 0 db suena como la mezcla de Nach. Para cambiar el fragmento, corta los mismos segundos de cada stem (que sigan sincronizados) y ajusta `desde`.
- **Frecuencia** (`MEDIA.frecuencia`): ya suena el mismo fragmento de *Todo Cae* (la mezcla de los 7 stems) al sintonizar 106.0.

- Si `MEDIA.frecuencia` queda vacío, el radio vuelve a sonar con un acorde de prueba hecho por el navegador.

### Todo Cae (`SINGLE` en `cabina.js`)

Al sintonizar 106.0 y colapsar el fragmento aparece "al aire // single 01" con el reproductor oficial de Spotify y los links.
El reproductor solo se carga en ese momento. Para el siguiente single, cambia `SINGLE` (título, datos, embed y links).

### Video

- `MEDIA.canal`: las 4 transmisiones del canal mc² (tx-01 a tx-04). Cada una lleva título y uno de estos dos:
  - `video`: un archivo mp4 (H.264, para que funcione en iPhone);
  - `youtube`: el id de un video de YouTube (lo que va después de `youtu.be/`). Con `inicio` y `fin` en segundos pasa solo un fragmento.
  Sin ninguno, sale "sin señal". **tx-01 ya es el lyric video de Todo Cae.**

### Textos y datos de prueba

- Frecuencia: el fragmento en superposición ya usa dos versos de Todo Cae (en `cabina.js`, busca `sp-line`).
- Llave: el título y el texto de `MC2-TEE-01` en `LLAVES`. Ahí mismo se agregan más llaves.
- Archivo: `LOTE` ("lote 01 · session 01"). Confirma el número real del lote de lavado.
- Canal: los títulos de las transmisiones.

## Lo que guarda en el navegador

`localStorage["mc2-cabina"]`: llaves abiertas, si ya sintonizó la frecuencia, la posición del fader overdubs y si ya generó su acta.
"Mi lista" sigue en `localStorage["mc2-cart"]`, la misma llave de la tienda. Todo va envuelto en try/catch.
