# Selectbox-wheel-picker

Een native expanded selectbox, enhanced met [Datastar](https://data-star.dev/) voor reactief gedrag en gestyled met moderne CSS zodat het zoveel mogelijk op een iOS wiel-kiezer lijkt.

## 🌐 Live demo

**`https://martijn80.github.io/Selectbox-wheel-picker/`**

## 🛠️ Lokaal testen

```bash
# Python (3.x)
python3 -m http.server 8080
# open http://localhost:8080
```

## Aanpak (progressive enhancement)

| Laag | Technologie | Doel |
|------|-------------|------|
| **Basis** | `<select size="5">` | Semantisch HTML-element; werkt altijd, ook zonder JS/CSS |
| **Gedrag** | Datastar signals & `data-on-change` | Houdt `$selected` reactief bij; `data-text` rendert de keuze |
| **Uiterlijk** | Moderne CSS | Gradients, hairline-indicator en iOS-typografie maken het tot een wiel-kiezer |

## Functionaliteit

| Eis | Implementatie |
|-----|---------------|
| 20 opties | JavaScript-loop genereert `<option>` elementen vóór Datastar initialiseert |
| Hoogte van 5 opties | `size="5"` + vaste hoogte `220px` (5 × 44 px) op `.wheel-outer` |
| Gekozen optie gecentreerd | `scrollTop`-berekening centreert de geselecteerde optie |
| Andere opties gedeselecteerd | Standaard `<select>`-gedrag; één waarde actief tegelijk |
| Datastar signals & attributes | `data-signals`, `data-on-change` (met `evt`), `data-text` |
| iOS-uitstraling | Gradient-fades, hairline-selectie-indicator, `appearance: none`, SF Pro font-stack |