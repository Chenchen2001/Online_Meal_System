# Online Meal Order System
A React.js + Node.js + MySQL Project

The frontend supports i18n for simplified Chinese, Hong Kong traditional Chinese and English.

The backend supports English only.

- `completed` folder is the compiled react frontend program
- `server` folder is the backend program
- `proj` folder is the source code of the react frontend program
- `serverdata.sql` is for implementing the MySQL database data

An `npm -i` command is required to execute to install dependencies.

This is an online meal order system for resaurants. There're three kinds of auth_flags, including customer, user and admin.
- For customers, they can only order meals
- For users, they can manage the food provided, deal with orders and order meals.
- For admins, they can order meals, deal with orders, manege users, categories and foods and arrange settings.

The whole system is constructed on `antd`, developed with the help of AIGC tools like ChatGPT and DeepSeek.

Server port can be modified at `PORT` of `/server/.env`, request URL can be modifed at `BASE_URL` of `/proj/src/index.js`.
