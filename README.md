# Projektiplaan

## Teema: E-pood raamatute müügiks.
Idee kirjeldus: Meie eesmärk on luua kasutajasõbralik ja kaasaegne veebipood, kus kliendid saavad mugavalt osta erinevaid raamatuid.
 Platvorm pakub laia valikut kirjandusžanre ja kiiret otsingufunktsiooni, et muuta ostuprotsess lihtsaks ja nauditavaks.

## Persoona:

Nimi ja vanus: Laura, 28-aastane.
Huvid: Laura on suur kirjandushuviline. Laura naudib ilukirjandust ja eneseabi raamatuid.

Laura vajab meie e-poodi kuna Laura otsib mugavat ja kiiret võimalust osta uusi ja populaarseid raamatuid. 
Ta hindab veebipoodi, mida on kerge kasutada ja mis võimaldab kiirelt leida soovitud raamatuid.


## Sarnased lahendused:

    Apollo e-pood
        Võrdlus: Meie projekt keskendub rohkem kasutajate mugavusele.
    Rahva Raamat
        Võrdlus: Meie veebileht keskendub paremini organiseeritud kataloogile ja kiirele
         juurdepääsule haruldastele või niširaamatutele, mida mainstream platvormid ei pruugi pakkuda.

## Figma disain
Tegime disaini prototüübi figma platvormil. Mida ka arenduse jooksul üpris üksühele jälgisime.
See on nähtav [siin](https://www.figma.com/design/ii4Au4bb6UUhOJA8nwB7RH/Untitled?node-id=0-1&t=p5j6RsOB8boqgbXU-1).


## Serveri lokaalne käivitamine

Kasutame lokaalselt terviksüsteemi käivitamiseks Dockerit ja selle konteineried. Selleks, et muuta käivitus lihtsaks ja tagada mugavus igal platvormil.  

### Käivitamise juhend
1. Veenduge, et teie seadmel on installitud ning uusimal versioonil [git](https://git-scm.com/downloads) ja [Docker ja Docker Compose](https://www.docker.com/products/docker-desktop/).

2. Kloonige giti repo soovitud asukohta kasutades https'i:
   ```bash
   git clone https://gitlab.cs.taltech.ee/maparp/prototuup-erialatutvustus.git
   cd prototuup-erialatutvustus
   ```
   või ssh'i:
   ```bash
   git clone git@gitlab.cs.taltech.ee:maparp/prototuup-erialatutvustus.git
   cd prototuup-erialatutvustus
   ```

3. Kopeerige .env.template .env file:
   ```bash
   cp .env.template .env
   ```


4. Käivitage Docker Compose arendajale:
   ```bash
   docker compose up
   ```

5. Rakendus on nüüd kättesaadav aadressil `http://localhost:3000`

6. Pärast suuremat muudatusi on soovitatav uuesti konteinerid ehitada:
   ```bash
   docker compose up --build
   ```

7. Ühe konkreetse konteineri taaskäivitamiseks kasuta käsku (nt backend):
   ```bash
   docker compose --file docker-compose.yml up -d <konteineri nimi> --build
   ```

8. Konteineri kustutamiseks või peatamiseks kasuta:
   ```bash
   docker compose down # konteineri kustutamiseks
   docker compose stop # konteineri peatamiseks
   ```

---
Kõik ühes http kloonimine ja valmis versiooni käivitamine:
```bash
git clone https://gitlab.cs.taltech.ee/maparp/prototuup-erialatutvustus.git
cd prototuup-erialatutvustus
cp .env.template .env
docker compose up
```


## Baaskasutajade andmed
   1. Admin:admin
   2. Kasutaja:Parool123

## Kasutatud tehnoloogiat:
   - Frontend: Next js, tailwind css, typescript
   - Backend: GoLang
   - DB: PostgreSQL

## Autorid
   1. Martin Parts - Fullstack
   2. Oliver Lapp - Frontend
   3. Tristjan Lutter - Backend ja selle implementatsioon frontendis
