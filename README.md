# thb-water-map-prototype

[![GitHub Pages](https://img.shields.io/badge/View-Prototype-blue)](https://doubrixel.github.io/thb-water-map-prototype/)

Dieses Projekt dient zur Visualisierung von Pegelständen. Diese Pegelstände werden von LoRaWAN-Sensoren in Brandenburg (a.d.H.) erfasst.

## Unterstützte Browser
- Chrome
- Firefox
- Edge

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
Um die Website unter einem anderen Pfad zu betreiben, muss das 'base' Attribut unter vite.config.js angepasst werden. 

### Publish on gh-pages branch

```sh
npm run deploy
```

## Technologien
- GitHub - VCS (https://docs.github.com/de)
- gh-pages - Deployment (https://www.npmjs.com/package/gh-pages)
- Vite - Serving and Bundling (https://vite.dev/guide/)
- Vue - Frontend Framework (https://vuejs.org/)
- CoreUI - UI Framework (https://coreui.io/vue/)
- Leaflet - Karte (https://leafletjs.com/index.html / https://github.com/vue-leaflet/vue-leaflet)
- D3 - Datenvisualisierung (https://d3js.org/getting-started)
- AIR Datepicker - Datums-/Zeitraumauswahl (https://air-datepicker.com/)

## APIs
https://pegelonline.wsv.de (Pegelstände Havel)

https://archive-api.open-meteo.com (Niederschlagsdaten)

https://map.ttn-brb.de (LoRaWAN Sensordaten)


## Konfiguration
Aktuell unter res abgelegt
sonden.json: Hält Informationen über die LoRaWAN Sonden:
- sondenId: uuid der Sonde gemäß https://map.ttn-brb.de
- echtwert: Höhe (in m. ü. NHN), auf der die Sonde angebracht ist. Zieht man davon den Messwert der Sonde ab, kennt man den Wasserstand.
- pnp: Höhe in mm auf welcher der Sensor an der Messlatte befestigt ist. Zieht man davon den Messwert der Sonde ab, kennt man den Pegel relativ zu PNP

pegelOnline.json: Hält Informationen zu Messstellen die den Wasserstand der Havel bereitstellen
- uuid: uuid gemäß https://www.pegelonline.wsv.de/
- munhn: PNP der Messlatte in m. ü. NHN

## Roadmap
1. [x] Git Repo initialisieren
2. [x] Beispiel Vue App bauen
3. [x] Deployment einrichten
4. [x] Karte von Brandenburg einbinden
5. [x] Beispielsensor einzeichnen mit Visualisierung (statische Daten)
6. [x] An https://map.ttn-brb.de Daten anbinden
7. [x] MUSS-Features bauen
8. [x] KANN-Features bauen

### MUSS Features
- [x] Daten der 5 LoRaWAN Sonden auf einen Blick sehen
- [x] Wasserstand als absolute Angabe
- [x] Verschiedene Zeiträume einsehbar machen

### KANN Features
- [x] Durchschnittspegelstand
- [x] Extremwerte
- [x] Vergleich mit Havelpegel
- [x] Pegel von Landesumweltamt -> https://www.pegelonline.wsv.de/webservice/guideRestapi
- [x] Polderkarte im Hintergrund
- [x] Niederschlagswerte

## Visuelle Gestaltung
Die visuelle Gestaltung soll sich an den beiden Projekten https://map.ttn-brb.de und https://wasserkarte.badbelzig-klimadaten.de/ orientieren.

