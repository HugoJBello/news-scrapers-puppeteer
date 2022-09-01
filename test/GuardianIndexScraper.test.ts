
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {GuardianNewIndexScraper} from "../src/scrapers/GuardianNewIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('GuardianIndexScraper 1', function () {
    describe('GuardianIndexScraper 2', function () {

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://www.theguardian.com/uk/commentisfree",]
        } as ScrapingIndexI

        const scraper = new GuardianNewIndexScraper(testIndex);
        scraper.maxPages=1


        it('GuardianIndexScraper', async function () {
            testIndex.pageNewIndex = 2
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
            console.log(result);
            console.log(scraper.scrapingIndex);
            expect(result).not.to.equal(undefined)
            expect(scraper.scrapingIndex.pageNewIndex).to.equal(2)
        });
    });
});