
import {ScrapingIndexI} from "../src/models/ScrapingIndex";

import {NewYorkTimesIndexScraper} from "../src/scrapers/NewYorkTimesIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('NewYorkTimesIndexScraper 1', function () {
    describe('NewYorkTimesIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://www.nytimes.com",]
        } as ScrapingIndexI

        const scraper = new NewYorkTimesIndexScraper(testIndex);
        scraper.maxPages=1

        

        it('NewYorkTimesIndexScraper 3', async function () {
            testIndex.pageNewIndex = 2
            testIndex.urlIndex = 0
            const result = await scraper.extractNewsUrlsInSectionPageFromIndexOneIteration();
     

            expect(result).not.equal(undefined)
            expect(result).to.have.lengthOf.at.least(1)
            expect(scraper.scrapingIndex.pageNewIndex).to.equal(2)
            console.log(result);
            
        });
    });
});