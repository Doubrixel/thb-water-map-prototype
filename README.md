# thb-water-map-prototype

[![GitHub Pages](https://img.shields.io/badge/View-Prototype-blue)](https://doubrixel.github.io/thb-water-map-prototype/)

Dieses Projekt dient zur Visualisierung von Pegelständen. Diese Pegelstände werden von LoRaWAN-Sensoren in Brandenburg (a.d.H.) erfasst.

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

### Publish on gh-pages branch

```sh
npm run deploy
```

## Technologien
- GitHub - VCS
- gh-pages - Deployment
- Vite - Serving and Bundling
- Vue - Frontend Framework
- CoreUI - UI Framework
- Leaflet - Karte
- D3 - Datenvisualisierung

## Konfiguration
Aktuell unter res abgelegt
sonden.json: Hält Informationen über die LoRaWAN Sonden:
- sondenId: uuid der Sonde gemäß https://map.ttn-brb.de
- echtwert: Höhe (in m. ü. NHN), auf der die Sonde angebracht ist. Zieht man davon den Messwert der Sonde ab, kennt man den Wasserstand.

## Roadmap
1. Git Repo initialisieren
2. Beispiel Vue App bauen
3. Deployment einrichten
4. Karte von Brandenburg einbinden
5. Beispielsensor einzeichnen mit Visualisierung (statische Daten)
6. An https://map.ttn-brb.de Daten anbinden
7. MUSS-Features bauen
8. KANN-Features bauen

### MUSS Features
- Daten der 5 LoRaWAN Sonden auf einen Blick sehen
- Wasserstand als absolute Angabe
- Verschiedene Zeiträume einsehbar machen

### KANN Features
- Durchschnittspegelstand
- Extremwerte
- Vergleich mit Havelpegel
- Pegel von Landesumweltamt -> https://www.pegelonline.wsv.de/webservice/guideRestapi
- Polderkarte im Hintergrund

## Visuelle Gestaltung
Die visuelle Gestaltung soll sich an den beiden Projekten https://map.ttn-brb.de und https://wasserkarte.badbelzig-klimadaten.de/ orientieren.

## TODO
CORS Problem lösen
