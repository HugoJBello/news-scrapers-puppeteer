import {DataTypes, Model} from 'sequelize';
import {ScrapingIndexI} from "./ScrapingIndex";
import {ScrapingUrlsSqlI} from "./ScrapingUrlSql";


export interface ScrapingIndexSqlI {
    dateScraping: Date;
    urlIndex: number;
    pageNewIndex: number;
    pageIndexSection: number;
    maxPages: number;
    newspaper: string;
    reviewsSource: string;
    startingUrls: string;
    scraperId: string;
    deviceId: string;
    id: number;
}

export const scrapingIndexSqlAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dateScraping: {
        type: DataTypes.DATE,
    },
    urlIndex: {
        type: DataTypes.NUMBER,
    },
    pageNewIndex: {
        type: DataTypes.STRING,
    },
    pageIndexSection: {
        type: DataTypes.NUMBER,
    },
    maxPages: {
        type: DataTypes.NUMBER,
    },
    newspaper: {
        type: DataTypes.STRING,
    },
    reviewsSource: {
        type: DataTypes.STRING,
    },
    startingUrls: {
        type: DataTypes.STRING,
    },
    scraperId: {
        type: DataTypes.STRING,
    },
    deviceId: {
        type: DataTypes.STRING,
    }
}

export const joiningStrUrls = "====="

export class ScrapingIndexSql extends Model<ScrapingIndexSqlI> {
}

export const convertToScrapingIndexSqlI = (index: ScrapingIndexI): ScrapingIndexSqlI => {
    const indexSql = index as any
    if (indexSql.startingUrls && Array.isArray(indexSql.startingUrls)) {
        const urls = indexSql.startingUrls
        indexSql.startingUrls = urls.join(joiningStrUrls)
    }
    return indexSql as ScrapingIndexSqlI
}

export const convertScrapingIndexSqlI = (indexSql: ScrapingIndexSqlI, scrapingUrls: ScrapingUrlsSqlI[]): ScrapingIndexI => {
    const index = indexSql as any
    const urls = scrapingUrls.map(url => url.url)
    index.startingUrls = urls
    return index as ScrapingIndexI
}

export const obtainScrapingIUrlsSqlI = (index: ScrapingIndexI): ScrapingUrlsSqlI[] => {
    return index.startingUrls.map(url => {
        const scrapingUrl: ScrapingUrlsSqlI = {} as ScrapingUrlsSqlI
        scrapingUrl.url = url
        scrapingUrl.newspaper = index.newspaper
        scrapingUrl.scraperId = index.scraperId
        return scrapingUrl
    })

}