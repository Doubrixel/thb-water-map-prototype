# thb-water-map-prototype

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

## Technologien
- GitHub - VCS
- ?Docker - Deployment?
- Vite - Serving and Bundling
- Vue - Frontend Framework
- Leaflet - Karte
- D3 - Datenvisualisierung


## Roadmap
1. Git Repo initialisieren
2. Beispiel Vue App bauen
3. Karte von Brandenburg einbinden
4. Beispielsensor einzeichnen mit Visualisierung (statische Daten)
5. An https://map.ttn-brb.de Daten anbinden
6. Deployment einrichten
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
- Pegel von Landesumweltamt
- Polderkarte im Hintergrund

## Visuelle Gestaltung
Die visuelle Gestaltung soll sich an den beiden Projekten https://map.ttn-brb.de und https://wasserkarte.badbelzig-klimadaten.de/ orientieren.
