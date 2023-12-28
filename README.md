# sample_nodejs
```
npx express-generator --view=ejs
```
```
npm i
```
- Additional packages
```
npm i express-ejs-layouts
npm i mysql
npm i sync-mysql
npm i bcrypt
npm i mysql2
npm i sequelize
npm i sequelize-cli
npx sequelize-cli init
```
- Migrations
```
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-user.js
```
- Seeders
```
npx sequelize-cli seed:generate --name products-seeder
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo
npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data
npx sequelize-cli db:seed:undo:all
```