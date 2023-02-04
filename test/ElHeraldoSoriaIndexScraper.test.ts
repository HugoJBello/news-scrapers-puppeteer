
import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {ElHeraldoSoriaIndexScraper} from "../src/scrapers/ElHeraldoSoriaIndexScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('ElHeraldoSoriaIndexScraper 1', function () {
    describe('ElHeraldoSoriaIndexScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {urlIndex:1, pageNewIndex:2, startingUrls:
                ["https://heraldodiariodesoria.elmundo.es/",]
        } as ScrapingIndexI

        const scraper = new ElHeraldoSoriaIndexScraper(testIndex);
        scraper.maxPages=1


        it('ElHeraldoSoriaIndexScraper', async function () {
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