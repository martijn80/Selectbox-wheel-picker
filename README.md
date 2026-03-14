# Selectbox-wheel-picker

Een uitklapbare native selectbox met 20 opties.

## 🌐 Live demo

**`https://martijn80.github.io/Selectbox-wheel-picker/`**

## 🛠️ Lokaal testen

```bash
# Python (3.x)
python3 -m http.server 8080
# open http://localhost:8080
```

## Functionaliteit

| Eis | Implementatie |
|-----|---------------|
| 20 opties | JavaScript-loop genereert `<option>` elementen |
| Hoogte van 5 opties | `size="5"` attribuut op `<select>` |
| Gekozen optie zichtbaar | `change`-event werkt het resultaatveld bij |
| Andere opties gedeselecteerd | Standaard gedrag van `<select>` |
| Geen externe afhankelijkheden | Puur HTML, CSS en vanilla JavaScript |