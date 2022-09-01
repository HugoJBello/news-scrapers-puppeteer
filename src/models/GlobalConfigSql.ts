import {DataTypes, Model} from 'sequelize';
import {ScrapingIndexI} from "./ScrapingIndex";
import {ScrapingUrlsSqlI} from "./ScrapingUrlSql";


export interface GlobalConfigSqlSqlI {
    lastActive: Date;
    scraperId: string;
    lastNewspaper: string;
    deviceId: string;
    id: number;
}

export const globalConfigSqlAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lastActive: {
        type: DataTypes.DATE,
    },
    scraperId: {
        type: DataTypes.STRING,
    },
    deviceId: {
        type: DataTypes.STRING,
    },
    lastNewspaper: {
        type: DataTypes.STRING,
    }
}

export class GlobalConfigSql extends Model<GlobalConfigSqlSqlI> {
}