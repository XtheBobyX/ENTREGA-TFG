import { Sequelize} from 'sequelize';

const db =  new Sequelize(process.env.DB_NAME || 'bd_zend',process.env.DB_USER  || 'root',process.env.DB_PASSWORD  || 'root',{
    host: process.env.DB_HOST|| 'localhost',
    dialect: 'mysql'
});

export default db;  