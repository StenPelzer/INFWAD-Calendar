# INFWAD-Calendar

Project voor Hogeschool Rotterdam cursus INFWAD / WebAppDevelopment.

## Initial setup

Voor het assessment, en überhaupt om het project goed te draaien, heb ik hier een kort stappenplan voor de initiële setup.

- Clone de repo
- Navigeer via de terminal naar de root folder (of open in IDE)
- Ga naar de backend folder `cd backend`
- Run `docker-compose up --build -d`
- Run `docker-compose up`
- In een tweede CLI, ga naar de root folder
- Run `dotnet ef database update -p backend -s backend`
- Run `npm run seed`
- Run `npm run dev`
- Ga naar http://localhost:3000/
- Gebruik een van de standaard accounts:
  - User: admin@infwad.nl, pass: admin123
  - User: basic@infwad.nl, pass: basic123

## Folder structure

Ik maak gebruik van de bulletproof-react mappenstructuur, zoals [hier](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) beschreven. Dit helpt om het project duidelijk gestructureerd te houden, op een herkenbare en makkelijk te begrijpen manier.

## Docker Compose

Om de backend te draaien, maak ik gebruik van Docker Compose. Draai de command `docker-compose up` in de /backend folder.

## Database migrations

Om de database te bouwen, moeten migrations worden uitgevoerd.
Het aanmaken van een nieuwe migration gaat met de command `dotnet ef migrations add NameOfMigration -p backend -s backend` (verander NameOfMigration)
Het toepassen van de bestaande migrations gaat met de command `dotnet ef database update -p backend -s backend`

## GraphQL

Ik maak gebruik van GraphQL voor mijn API connectie. Hiervoor gebruik ik het framework Hot Chocolate.
Zorg dat `docker-compose up` actief is en ga naar localhost:5001/graphql.
Een voorbeeld van een query voor het ophalen van events:

```graphql
query {
  events {
    id
    title
    description
    startTime
    endTime
  }
}
```
