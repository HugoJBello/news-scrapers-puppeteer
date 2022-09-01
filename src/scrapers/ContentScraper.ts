
import {PuppeteerScraper} from "./PuppeteerScraper";
import {NewScrapedI} from "../models/NewScraped";
import {ScrapingIndexI} from "../models/ScrapingIndex";

export class ContentScraper extends PuppeteerScraper {

    async extractNewInUrl(url: string, scraperId: string):Promise<NewScrapedI> {
        return {} as NewScrapedI
    }
}