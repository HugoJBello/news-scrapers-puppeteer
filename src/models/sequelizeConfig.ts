import {Sequelize} from 'sequelize';

import {DataTypes} from "sequelize";
import {NewScrapedSql, newScrapedSqlAttributes} from "./NewScrapedSql";
import {
    ScrapingIndexSql,
    scrapingIndexSqlAttributes,
} from "./ScrapingIndexSql";
import {scrapingUrlSqlAttributes, ScrapingUrlsSql} from "./ScrapingUrlSql";
import {GlobalConfigSql, globalConfigSqlAttributes} from "./GlobalConfigSql";

const timestamp = new Date().valueOf()

export const sequelize =  new Sequelize({
    storage: './db/database_news' + timestamp + '.sqlite3',
    dialect: 'sqlite',
    logging: false
})

export const initDb = async () => {
    NewScrapedSql.init(
        newScrapedSqlAttributes,
        {
            tableName: "NewScraped",
            sequelize: sequelize, // this bit is important
        }
    )

    ScrapingIndexSql.init(
        scrapingIndexSqlAttributes,
        {
            tableName: "ScrapingIndex",
            sequelize: sequelize, // this bit is important
        }
    )

    ScrapingUrlsSql.init(
        scrapingUrlSqlAttributes as any,
        {
            tableName: "ScrapingUrl",
            sequelize: sequelize, // this bit is important
        }
    )

    GlobalConfigSql.init(
        globalConfigSqlAttributes,
        {
            tableName: "GlobalConfig",
            sequelize: sequelize, // this bit is important
        }
    )

    await NewScrapedSql.sync({force: false})
    await ScrapingIndexSql.sync({force: false})
    await ScrapingUrlsSql.sync({force: false})
    await GlobalConfigSql.sync({force: false})
}
