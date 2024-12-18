
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {PublicoIndexScraper} from "../src/scrapers/PublicoIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('PublicoIndexScraper 1', function () {
    describe('PublicoIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://www.publico.es/",]
        } as ScrapingIndexI

        const scraper = new PublicoIndexScraper(testIndex);
        scraper.maxPages=1


        it('PublicoIndexScraper', async function () {
            testIndex.pageNewIndex = 1
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).not.to.equal(undefined)
            expect(result).to.have.lengthOf.at.least(1)
            expect(scraper.scrapingIndex.pageNewIndex).to.greaterThan(0)
        });
    });
});