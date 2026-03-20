# AGENTS.md

## Scope

Deze instructies gelden voor de volledige repository.

## Context7-first policy

Bij werk aan HTML, CSS of Datastar moet je eerst de Context7 MCP server gebruiken om je kennis te verifiëren en aan te vullen voordat je code schrijft, reviewt of architectuuradvies geeft.

Gebruik deze volgorde:

1. Resolve eerst de juiste library met `mcp__context7__resolve-library-id`.
2. Query daarna de relevante documentatie met `mcp__context7__query-docs`.
3. Baseer implementatiekeuzes primair op officiële of hoog-reputatie Context7-bronnen.

## Verplichte Context7 domeinen

- HTML: raadpleeg Context7-documentatie voor HTML- of platformgedrag zodra semantiek, forms, accessibility, browsergedrag of element-API's relevant zijn.
- CSS: raadpleeg Context7-documentatie zodra layout, selectors, rendering, responsive gedrag, animaties of platformbeperkingen relevant zijn.
- Datastar: raadpleeg altijd Context7-documentatie bij vragen of wijzigingen rond signals, binds, effects, refs, backend-interactie en Datastar-patronen.

## Werkwijze

- Maak geen aannames over HTML-, CSS- of Datastar-details als Context7 die kan bevestigen.
- Als Context7 geen bruikbare documentatie oplevert, zeg dat kort en ga dan verder met de best beschikbare bron.
- Houd queries gericht; haal alleen documentatie op die nodig is voor de taak.
- Noem in je antwoord kort dat Context7 is geraadpleegd wanneer dat relevant is voor het advies of de wijziging.

## Doel

Voorkom verouderde frontend-aannames en houd implementaties in lijn met actuele documentatie en best practices.
