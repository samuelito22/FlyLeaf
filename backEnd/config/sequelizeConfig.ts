import { Sequelize } from 'sequelize-typescript';
import Model from '../models';

export const sequelize = new Sequelize('flyleafdb', 'flyleafadmin', 'Be5zPptVSkXpQl5r', {
  host: 'localhost',
  logging: false,
  dialect: 'postgres'
});

const modelArray = Object.values(Model);
sequelize.addModels(modelArray);
