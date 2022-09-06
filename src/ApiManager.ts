import {
    ScrapingIndexI,
} from './models/ScrapingIndex';

import {ScrapingConfigI} from "./models/ScrapingConfig";
import {
    convertScrapingIndexSqlI,
    convertToScrapingIndexSqlI, obtainScrapingIUrlsSqlI,
    ScrapingIndexSql,
    ScrapingIndexSqlI
} from "./models/ScrapingIndexSql";
import {convertToNewsScrapedSqlI, NewScrapedSql} from "./models/NewScrapedSql";
import {NewScrapedI} from "./models/NewScraped";
import {ScrapingUrlsSql, ScrapingUrlsSqlI} from "./models/ScrapingUrlSql";
import {GlobalConfigSql} from "./models/GlobalConfigSql";
import {GlobalConfigI} from "./models/GlobalConfig";

import axios from 'axios';


export default class ApiManager {
    public url = ""

    constructor(config: ScrapingConfigI) {
        this.url = config.apiUrl
    }

    async saveNewsScraped(newScraped: NewScrapedI){
        try{
            const url = this.url + "/api/v1/newScraped/saveOrUpdate"
            await axios.post(url, newScraped)
        } catch (e){
            console.log("error saving news scraped in api")
        }
    }

    async saveScrapingIndex(index: ScrapingIndexI){
        try{
            const url = this.url + "/api/v1/scrapingIndex/saveOrUpdate"
            await axios.post(url, index)
        } catch (e){
            console.log("error saving news scrapingIndex in api")

        }
    }

    async saveGlobalConfig(config: GlobalConfigI){
        try{
            const url = this.url + "/api/v1/globalConfig/saveOrUpdate"
            await axios.post(url, config)
        } catch (e){
            console.log("error saving news globalConfig in api")

        }
    }


    
}
