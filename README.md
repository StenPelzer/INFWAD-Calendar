# INFWAD-Calendar

Project voor Hogeschool Rotterdam cursus INFWAD / WebAppDevelopment.

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
