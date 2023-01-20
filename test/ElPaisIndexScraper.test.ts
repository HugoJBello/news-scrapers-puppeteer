
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {ElPaisIndexScraper} from "../src/scrapers/ElPaisIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('ElPaisIndexScraper 1', function () {
    describe('ElPaisIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://elpais.com/",]
        } as ScrapingIndexI

        const scraper = new ElPaisIndexScraper(testIndex);
        scraper.maxPages=1


        it('ElDiarioesIndexScraper', async function () {
            testIndex.pageNewIndex = 1
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).not.to.equal(undefined)
            expect(scraper.scrapingIndex.pageNewIndex).to.greaterThan(0)
        });
    });
});