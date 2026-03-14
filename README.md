# Selectbox-wheel-picker

Een iOS-stijl wiel-kiezer gebouwd met [Datastar](https://data-star.dev/) signals en attributes.

## 🌐 Live demo

Na het mergen van de PR en het eenmalig inschakelen van GitHub Pages is de pagina direct bereikbaar op:

**`https://martijn80.github.io/Selectbox-wheel-picker/`**

## ⚙️ GitHub Pages inschakelen (eenmalig)

1. Ga naar de repository op GitHub
2. Klik op **Settings** → **Pages** (in de linker zijbalk)
3. Kies bij **Source**: *GitHub Actions*
4. Klik op **Save**

De workflow in `.github/workflows/deploy.yml` deployt automatisch bij elke push naar `main`.

## 🛠️ Lokaal testen

```bash
# Python (3.x)
python3 -m http.server 8080
# open http://localhost:8080
```

## Functionaliteit

| Eis | Implementatie |
|-----|---------------|
| 20 opties | JavaScript-loop genereert `div.wheel-item` elementen |
| Hoogte van 5 opties | `height: 220px` (= 5 × 44 px) op `.wheel-outer` |
| Gekozen optie centreert | `scrollTo({top: index × 44, behavior: 'smooth'})` in `data-on-click` |
| Andere opties gedeselecteerd | `data-signals="{selected: -1}"` — één getal → automatisch exclusief |
| Datastar signals & attributes | `data-signals`, `data-on-click`, `data-class`, `data-text` |
| iOS-uitstraling | Gradient-fades, hairline-selectie-indicator, SF Pro font-stack |