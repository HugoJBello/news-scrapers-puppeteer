import {
    ScrapingIndexI,
} from './models/ScrapingIndex';

import {ContentScraper} from "./scrapers/ContentScraper";
import {IndexScraper} from "./scrapers/IndexScraper";

import scrapingConfig from './config/scrapingConfigFull.json';

import PersistenceManager from "./managers/PersistenceManager";
import {GlobalConfigI} from "./models/GlobalConfig";
import {NewYorkTimesContentScraper} from "./scrapers/NewYorkTimesContentScraper";
import {NewYorkTimesIndexScraper} from "./scrapers/NewYorkTimesIndexScraper";
import { initDb } from './models/sequelizeConfig';
import { GuardianNewContentScraper } from './scrapers/GuardianNewContentScraper';
import { GuardianNewIndexScraper } from './scrapers/GuardianNewIndexScraper';
import { ElDiarioesIndexScraper } from './scrapers/ElDiarioesIndexScraper';
import { ElDiarioesContentScraper } from './scrapers/ElDiarioesContentScraper';
import { PublicoIndexScraper } from './scrapers/PublicoIndexScraper';
import { PublicoContentScraper } from './scrapers/PublicoContentScraper';
import UtilsManager from './managers/UtilsManager';
import { ElPaisContentScraper } from './scrapers/ElPaisContentScraper';
import { ElPaisIndexScraper } from './scrapers/ElPaisIndexScraper';
import { ElMundoContentScraper } from './scrapers/ElMundoContentScraper';
import { ElMundoIndexScraper } from './scrapers/ElMundoIndexScraper';
import { ElHeraldoSoriaContentScraper } from './scrapers/ElHeraldoSoriaContentScraper';
import { ElHeraldoSoriaIndexScraper } from './scrapers/ElHeraldoSoriaIndexScraper';
import { LaVanguardiaContentScraper } from './scrapers/LaVanguardiaContentScraper';
import { LaVanguardiaIndexScraper } from './scrapers/LaVanguardiaIndexScraper';
import { ScienceNewsIndexScraper } from './scrapers/ScienceNewsIndexScraper';
import { ScienceNewsContentScraper } from './scrapers/ScienceNewsContentScraper';
import { AbcIndexScraper } from './scrapers/AbcIndexScraper';
import { AbcContentScraper } from './scrapers/AbcContentScraper';
import { PhysOrgIndexScraper } from './scrapers/PhysOrgIndexScraper';
import { PhysOrgContentScraper } from './scrapers/PhysOrgContentScraper';
import { XatakaIndexScraper } from './scrapers/XatakaIndexScraper';
import { XatakaContentScraper } from './scrapers/XatakaContentScraper';
import {ScrapingConfigI} from './models/ScrapingConfig'
 
require('dotenv').config();

 
export interface ScraperTuple {
    pageScraper: ContentScraper;
    urlSectionExtractorScraper: IndexScraper;
}

export default class ScraperApp {
    public config: ScrapingConfigI = scrapingConfig as any

    public scrapers: ScraperTuple[] = [];
    public joiningStr = "===="
    public globalConfig: GlobalConfigI;
    public persistenceManager: PersistenceManager
    constructor() {
    }

    async startScraper() {
        await initDb()

        await this.loadIndexAndScrapers()
        let continueScraping = true;

        while (continueScraping) for (let scraperTuple of this.scrapers) {
            try {
                await this.scrapOneIterationFromOneScraper(scraperTuple)
            } catch (e) {
                console.log("----------------------------------")
                console.log("ERROR")
                console.log(e)
                console.log("----------------------------------")
                this.globalConfig.lastLog = this.globalConfig.lastLog + "\n ERROR: " + e
                await this.persistenceManager.updateGlobalConfig(this.globalConfig)

                await this.setUpNextIteration(scraperTuple)

            }
            await this.waitIfLast()

        }
    }

    async loadIndexAndScrapers() {

        this.persistenceManager = new PersistenceManager(this.config)
        await this.prepareGlobalConfig()

        const newspapersReordered = this.reorderNewspaperArrayStartingWithLastScraped()

        for (let newspaper of newspapersReordered) {
            console.log("loading index for " + newspaper)
            
            const indexScraper = await this.prepareIndex(newspaper)
            console.log(indexScraper)

            let scraper = null

            if (newspaper === "abc") {
                scraper = {
                    pageScraper: new AbcContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new AbcIndexScraper(indexScraper)
                } as ScraperTuple
            }

            if (newspaper === "lavanguardia") {
                scraper = {
                    pageScraper: new LaVanguardiaContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new LaVanguardiaIndexScraper(indexScraper)
                } as ScraperTuple
            }

            if (newspaper === "elheraldosoria") {
                scraper = {
                    pageScraper: new ElHeraldoSoriaContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new ElHeraldoSoriaIndexScraper(indexScraper)
                } as ScraperTuple
            }

            if (newspaper === "publico") {
                scraper = {
                    pageScraper: new PublicoContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new PublicoIndexScraper(indexScraper)
                } as ScraperTuple
            }

            if (newspaper === "eldiario.es") {
                scraper = {
                    pageScraper: new ElDiarioesContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new ElDiarioesIndexScraper(indexScraper)
                } as ScraperTuple
            }

            if (newspaper === "elpais") {
                scraper = {
                    pageScraper: new ElPaisContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new ElPaisIndexScraper(indexScraper)
                } as ScraperTuple
            }
            if (newspaper === "elmundo") {
                scraper = {
                    pageScraper: new ElMundoContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new ElMundoIndexScraper(indexScraper)
                } as ScraperTuple
                this.scrapers.push(scraper)
            }

            if (newspaper === "guardianus") {
                scraper = {
                    pageScraper: new GuardianNewContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new GuardianNewIndexScraper(indexScraper)
                } as ScraperTuple
                this.scrapers.push(scraper)
            }
            if (newspaper === "sciencenews") {
                scraper = {
                    pageScraper: new ScienceNewsContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new ScienceNewsIndexScraper(indexScraper)
                } as ScraperTuple
                this.scrapers.push(scraper)
            }

            if (newspaper === "newyorktimes") {
                scraper = {
                    pageScraper: new NewYorkTimesContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new NewYorkTimesIndexScraper(indexScraper)
                } as ScraperTuple
            }

            if (newspaper === "physorg") {
                scraper = {
                    pageScraper: new PhysOrgContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new PhysOrgIndexScraper(indexScraper)
                } as ScraperTuple
            }

            if (newspaper === "xataka") {
                scraper = {
                    pageScraper: new XatakaContentScraper(indexScraper.scraperId, indexScraper.newspaper),
                    urlSectionExtractorScraper: new XatakaIndexScraper(indexScraper)
                } as ScraperTuple
            }

            this.scrapers.push(scraper)


        }

        if (this.config.shuffleScrapers) {
            this.shuffleArray(this.scrapers)
        }
    }
    async prepareGlobalConfig() {
        let globalConfig = await this.persistenceManager.findCurrentGlogalConfig()
        if (globalConfig) {
            this.globalConfig = globalConfig
            this.globalConfig.activeSince = new Date()
            this.globalConfig.lastActive = this.globalConfig.activeSince

        } else {
            console.log("global config nof found, starting new one");
            
            globalConfig = {} as GlobalConfigI
            globalConfig.scraperId = this.config.scraperId
            globalConfig.deviceId = this.config.deviceId
            globalConfig.lastNewspaper = this.config.newspapers[0]
            globalConfig.lastActive = new Date()
            globalConfig.activeSince = globalConfig.lastActive
            globalConfig.createdAt = globalConfig.lastActive
            globalConfig.globalIteration = 0
            this.globalConfig = globalConfig
            await this.persistenceManager.updateGlobalConfig(globalConfig)
        }
    }

    reorderNewspaperArrayStartingWithLastScraped():string[] {
        const currentNewspaper = this.globalConfig.lastNewspaper
        const index = this.config.newspapers.indexOf(currentNewspaper)
        const newspapersReordered = this.config.newspapers.slice(index).concat(this.config.newspapers.slice(0, index))
        return newspapersReordered
    }

    async refreshGlobalConfigFromIndex(index: ScrapingIndexI) {
        this.globalConfig.lastNewspaper = index.newspaper
        this.globalConfig.lastActive = new Date()
        await this.persistenceManager.updateGlobalConfig(this.globalConfig)

    }

    async prepareIndex(newspaper: string): Promise<ScrapingIndexI> {
        let indexScraper = await this.persistenceManager.findCurrentIndex(newspaper)
        if (!indexScraper || !indexScraper.scraperId) {
            console.log("not found index", indexScraper)
            indexScraper = this.loadIndexFromConfig(newspaper)
        }

        await this.persistenceManager.updateIndex(indexScraper)
        return indexScraper

    }


    loadIndexFromConfig(newspaper: string): ScrapingIndexI {
        console.log("@---------------------------------------@")
        console.log("loading from config")
        console.log("@---------------------------------------@")
        const indexScraper = {} as ScrapingIndexI
        indexScraper.urlIndex = 0
        indexScraper.scrapingIteration = 0
        indexScraper.startingUrls = this.config.scrapingSettings[newspaper].startingUrls
        indexScraper.pageNewIndex = 0
        indexScraper.newspaper = newspaper
        indexScraper.scraperId = this.config.scraperId
        indexScraper.deviceId = this.config.deviceId
        indexScraper.tag = this.config.scrapingSettings[newspaper].tag
        indexScraper.maxPages = this.config.scrapingSettings[newspaper].maxPages
        indexScraper.logoUrl =  this.config.scrapingSettings[newspaper].logoUrl
               
        return indexScraper
    }


    
    async waitIfLast() {
        const iteration = this.globalConfig.globalIteration
        const waitMinutes = this.config.waitMinutes
        const waitOnIteration = this.config.waitOnIteration

        if (waitMinutes != 0 && waitOnIteration != 0) {
            const itemInRound = (iteration+1) % waitOnIteration 
            if (itemInRound == 0) {
                console.log("----------------------------------")
                console.log("Waiting ", waitMinutes, " minutes")
                console.log("----------------------------------")

                this.globalConfig.lastLog = this.globalConfig.lastLog + "\n Waiting for " + waitMinutes + " minutes "
                await this.persistenceManager.updateGlobalConfig(this.globalConfig)
                
                await this.wait(waitMinutes * 60 * 1000)

                if (this.config.killAfterWaiting) {
                    this.globalConfig.globalIteration = this.globalConfig.globalIteration + 1
                    await this.persistenceManager.updateGlobalConfig(this.globalConfig)

                    this.globalConfig.lastLog = this.globalConfig.lastLog + "\n Closing after waiting " + waitMinutes + " minutes "
                    await this.persistenceManager.updateGlobalConfig(this.globalConfig)

                    process.exit(1);
                }
            }
        } else {
            const message = "not waiting this time. Iteration " + iteration + ". Waiting for a multiple of " + waitOnIteration
            this.globalConfig.lastLog = this.globalConfig.lastLog + "\n "+ message
            await this.persistenceManager.updateGlobalConfig(this.globalConfig)
        }
    }

    async wait(delay: number) {
        return new Promise(function(resolve) {
            setTimeout(resolve, delay);
        });
    }
 

    async scrapOneIterationFromOneScraper(scraperTuple: ScraperTuple) {
        await this.refreshGlobalConfigFromIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex)

        const urls = await scraperTuple.urlSectionExtractorScraper.extractNewsUrlsInSectionPageFromIndexOneIteration()
        const ids = urls.map(url => UtilsManager.createIdFromUrl(url))


        scraperTuple.urlSectionExtractorScraper.scrapingIndex.currentScrapingUrlList = urls
        scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewTotal = urls.length
        scraperTuple.urlSectionExtractorScraper.scrapingIndex.currentScrapingIdList = ids
        
        console.log("--->  starting scraping urls ")
        console.log(ids)


        if (scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex >= urls.length - 1) {
            scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = 0
        }

        await this.persistenceManager.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex)

        while (scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex <= urls.length - 1) {
            scraperTuple.urlSectionExtractorScraper.scrapingIndex = scraperTuple.urlSectionExtractorScraper.scrapingIndex

            const url = urls[scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex]
            let message = "scraping from " + scraperTuple.urlSectionExtractorScraper.scrapingIndex.newspaper
            if (url) {
                console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
                message = "scraping url " + "page: " + scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex + " of " + scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewTotal + " from " + scraperTuple.urlSectionExtractorScraper.scrapingIndex.newspaper 
                console.log(message)
                console.log(url)
                console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")

                const extractedNews = await scraperTuple.pageScraper.extractNewInUrl(url, scraperTuple.urlSectionExtractorScraper.scrapingIndex.scraperId, scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex, scraperTuple.urlSectionExtractorScraper.scrapingIndex.scrapingIteration)
                extractedNews.id = UtilsManager.createIdFromUrl(url)
                
                console.log(extractedNews)
                
                await this.persistenceManager.saveNewsScraped(extractedNews)
            }

            
            scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex + 1
            
            await this.persistenceManager.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex)
            this.globalConfig.lastLog = this.globalConfig.lastLog + "\n " +  message
            await this.refreshGlobalConfigFromIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex)
        }

       
        await this.setUpNextIteration(scraperTuple)
    }

    async setUpNextIteration(scraperTuple: ScraperTuple) {
        console.log("---> Preparing for next iteration")

        
        scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex = scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex + 1
        scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageNewIndex = 0
        scraperTuple.urlSectionExtractorScraper.scrapingIndex.pageIndexSection = 0

        if (scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex > scraperTuple.urlSectionExtractorScraper.scrapingIndex.startingUrls.length - 1) {
            scraperTuple.urlSectionExtractorScraper.scrapingIndex.urlIndex = 0
        }
        scraperTuple.urlSectionExtractorScraper.scrapingIndex.scrapingIteration = scraperTuple.urlSectionExtractorScraper.scrapingIndex.scrapingIteration + 1
        this.globalConfig.globalIteration = this.globalConfig.globalIteration + 1
        this.globalConfig.lastLog = this.globalConfig.lastLog + "\n completed " + scraperTuple.pageScraper.newspaper
        await this.persistenceManager.updateGlobalConfig(this.globalConfig)
        await this.persistenceManager.updateIndex(scraperTuple.urlSectionExtractorScraper.scrapingIndex)
    }

    shuffleArray= (array:any) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }


} 