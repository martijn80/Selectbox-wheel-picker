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

De root van de demo gebruikt deze signals:

- `$firstRealOptionIndex`: index van de eerste echte optie, exclusief de lege placeholders.
- `$lastRealOptionIndex`: index van de laatste echte optie, exclusief de lege placeholders.
- `$scrollPixelsPerOption`: aantal scroll-pixels tussen twee aangrenzende opties.
- `$i`: berekende index van de optie die op dit moment in het midden staat.

## Scrolllogica

`$firstRealOptionIndex` en `$lastRealOptionIndex` zijn statisch: ze hangen alleen af van de optielijst en worden daarom eenmalig in `data-init` berekend.

`$scrollPixelsPerOption` hangt af van `scrollHeight` en `clientHeight`, en moet daarom opnieuw berekend worden wanneer de layout verandert.
Dat gebeurt zowel in `data-init` als in `data-on-resize`, zodat het goed blijft werken bij window-resize.

Alleen `$i` verandert tijdens scrollen. Daardoor kan `data-on:scroll` beperkt blijven tot de actuele selectie berekenen en toepassen.

## Selectgedrag

De `<select>` blijft de toegankelijke basis:

- `size="5"` toont precies vijf zichtbare regels.
- Twee lege, niet-selecteerbare opties aan begin en eind fungeren als uitfadende wheel opties (en zien leeg en niet selecteerbaar), zodat ook de eerste en laatste echte optie in het midden kunnen landen.
- De hairline-indicator markeert visueel de actieve middelste regel.

## Datastar-attributen

- `data-init`: roept `__initializeWheelPicker()` aan om de eerste en laatste echte optie-index, de initiële `$scrollPixelsPerOption` en de startwaarde van `$i` te zetten.
- `data-on-resize`: roept `__recalculateScrollPixelsPerOption()` aan om `$scrollPixelsPerOption` opnieuw af te leiden uit de actuele afmetingen.
- `data-on:scroll`: roept `__syncCenteredOptionFromScroll()` aan om de gecentreerde optie te berekenen, te clampen en daarna `selectedIndex` en `$i` te synchroniseren.
- `data-on:change`: roept `__centerSelectionAfterChange()` aan om een via klik of toetsenbord gekozen optie visueel te centreren. Omdat het zetten van `selectedIndex` via JavaScript geen `change` triggert, ontstaat er geen event-loop.
- `data-text`: roept `__selectedOptionLabelFromIndex()` aan om de huidige selectie als labeltekst te renderen.
- `data-effect`: roept `__updateOptionColors()` aan om de inline tekstkleur van opties aan te passen op basis van afstand tot de gecentreerde optie.
