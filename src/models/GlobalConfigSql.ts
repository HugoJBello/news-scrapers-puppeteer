import {DataTypes, Model} from 'sequelize';

export interface GlobalConfigSqlSqlI {
    lastActive: Date;
    createdAt: Date;
    activeSince: Date;
    scraperId: string;
    globalIteration: number;
    lastNewspaper: string;
    deviceId: string;
    lastLog: string;
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
    createdAt: {
        type: DataTypes.DATE,
    },
    activeSince: {
        type: DataTypes.DATE,
    },
    scraperId: {
        type: DataTypes.STRING,
    },
    globalIteration: {
        type: DataTypes.NUMBER,
    },
    deviceId: {
        type: DataTypes.STRING,
    },
    lastNewspaper: {
        type: DataTypes.STRING,
    },
    lastLog: {
        type: DataTypes.STRING,
    }
}

export class GlobalConfigSql extends Model<GlobalConfigSqlSqlI> {
}