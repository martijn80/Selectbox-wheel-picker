# Selectbox-wheel-picker

Een html5 expanded selectbox, enhanced met [Datastar](https://data-star.dev/) voor reactief gedrag en gestyled met moderne CSS zodat het zoveel mogelijk op een iOS wheelpicker lijkt.

## 🌐 Live demo

- [https://martijn80.github.io/Selectbox-wheel-picker/](https://martijn80.github.io/Selectbox-wheel-picker/)

## 🛠️ Lokaal testen

```bash
# Python (3.x)
python3 -m http.server 8080
# open http://localhost:8080
```

## Datastar-opzet

De demo gebruikt bewust maar twee publieke signals:

- `$month`: de geselecteerde maandwaarde uit de `<select>`.
- `$styleAsWheel`: togglet of de wheel-styling aan staat.

De wheel-picker houdt zijn technische metadata juist niet in Datastar-signals bij. Waarden zoals de eerste echte optie-index, de laatste echte optie-index en de scrollafstand per optie leven in `select._wheelPicker`. Dat zijn implementatiedetails van het DOM-element, geen gedeelde applicatiestate.

## Scrolllogica

Bij `data-init` berekent `_initializeWheelPicker()` eenmalig de interne wheel-metadata en zet daarna de huidige selectie meteen visueel in het midden.

Bij `data-on-resize` rekent `_recalculateWheelPicker()` alleen de layout-afhankelijke scrollafstand opnieuw uit. Daarna centreert `_syncScrollFromSelection()` de huidige selectie opnieuw zodat de wheel netjes uitgelijnd blijft na een resize.

Bij `data-on:scroll` berekent `_syncSelectionFromScroll()` welke optie in het midden staat, zet `selectedIndex`, werkt de optiekleuren bij en plant daarna een snap in. Als dezelfde selectie 200ms stabiel blijft, centreert `_scheduleSnapToSelection()` die optie alsnog exact in het midden.

## Selectgedrag

De `<select>` blijft de toegankelijke basis:

- `size="5"` toont precies vijf zichtbare regels.
- Twee lege, niet-selecteerbare opties aan begin en eind fungeren als uitfadende wheel opties (en zien leeg en niet selecteerbaar), zodat ook de eerste en laatste echte optie in het midden kunnen landen.

## Datastar-attributen

- `data-bind="month"` houdt de geselecteerde waarde in sync met `$month`.
- `data-ref="monthSelect"` maakt de `<select>` direct beschikbaar voor andere Datastar-expressies, zonder `querySelector(...)`.
- `data-init`: initialiseert de interne wheel-state op het element en zet `$month` op de actuele selectie.
- `data-on-resize`: herberekent alleen de layout-metadata en centreert daarna de bestaande selectie opnieuw.
- `data-on:scroll`: synchroniseert scrollpositie naar selectie en werkt daarna `$month` bij.
- `data-on:change`: werkt direct de selectie en optiekleuren bij en laat de gekozen optie na 200ms stabiliteit naar het midden snappen.
- `data-text`: reageert op `$month` en leest daarna het label rechtstreeks van `$monthSelect`.
- `data-effect`: werkt de optiekleuren bij wanneer `$month` verandert.
