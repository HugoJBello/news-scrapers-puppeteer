

import {DataTypes, Model} from 'sequelize';
import {NewScrapedI} from "./NewScraped";
import {sequelize} from "./sequelizeConfig";

export interface NewScrapedSqlI {
    newspaper: string
    author: string
    description: string
    image: string
    date: Date
    scrapedAt: Date
    content: string
    headline: string
    tags: string
    url: string
    scraperId: string
    id: string
}

export class NewScrapedSql extends Model<NewScrapedSqlI> {
}

export const newScrapedSqlAttributes = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    newspaper: {
        type: DataTypes.STRING,
    },
    author: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.DATE,
    },
    scrapedAt: {
        type: DataTypes.DATE,
    },
    content: {
        type: DataTypes.STRING,
    },
    headline: {
        type: DataTypes.STRING,
    },
    tags:{
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING,
    },
    scraperId: {
        type: DataTypes.STRING,
    }
} as any

export const joiningStrtags = ","


export const convertToNewsScrapedSqlI = (newScrapedI: NewScrapedI): NewScrapedSqlI => {
    const newScrapedSql = newScrapedI as any
    if (newScrapedSql.tags && Array.isArray(newScrapedSql.tags)){
        const tags = newScrapedSql.tags
        newScrapedSql.tags =  tags.join(joiningStrtags)
    }
    return newScrapedSql as NewScrapedSqlI
}

export const convertNewsScrapedSqlI = (newScrapedSqlI: NewScrapedSqlI): NewScrapedI => {
    const index = newScrapedSqlI as any
    if (newScrapedSqlI.tags.includes(joiningStrtags)) {
        const tags = newScrapedSqlI.tags
        index.tags =  tags.split(joiningStrtags)
    }
    return index as NewScrapedI
}