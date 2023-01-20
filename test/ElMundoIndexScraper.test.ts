
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {ElMundoIndexScraper} from "../src/scrapers/ElMundoIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('ElMundoIndexScraper 1', function () {
    describe('ElMundoIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://www.elmundo.es/",]
        } as ScrapingIndexI

        const scraper = new ElMundoIndexScraper(testIndex);
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