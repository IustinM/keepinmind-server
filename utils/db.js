import mysql  from 'mysql2';

const db = mysql.createConnection({
    host: 'localhost', // Adresa IP a serverului MySQL
    user: 'root', // Numele utilizatorului MySQL
    password: '18082002', // Parola utilizatorului MySQL
    database: 'keepinmind'
}) 

export default db;