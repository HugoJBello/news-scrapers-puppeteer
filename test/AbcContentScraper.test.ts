import {ScrapingIndexI} from "../src/models/ScrapingIndex";
import {AbcContentScraper} from "../src/scrapers/AbcContentScraper";
import { expect } from 'chai';

require('dotenv').config();

describe('AbcContentScraper 1', function () {
    describe('AbcContentScraper 2', function () {
        this.timeout(9999999);

        const date = new Date()
        const testIndex = {} as ScrapingIndexI
        testIndex.scraperId = "test"
        const scraper = new AbcContentScraper("test","");

        it('AbcContentScraper', async function () {

            const url = "https://www.abc.es/espana/sanchez-admite-referirse-amnistia-confirma-existen-negociaciones-20231005113434-nt.html"
            const result = await scraper.extractNewInUrl(url, "", 0, 0);
            console.log(result);
            expect(result).to.have.property("content")
            expect(result).to.have.property("date")
            expect(result).to.have.property("headline")
            expect(result).to.have.property("description")
            expect(result).to.have.property("scrapedAt")
            expect(result).to.have.property("tags")
            expect(result).to.have.property("sections")
            expect(result.tags).not.equal(null)
            expect(result.sections).not.equal(null)
            expect(result.figuresText).not.equal(null)
            expect(result.figuresUrl).not.equal(null)
            expect(result.figuresUrl).not.equal([])
            expect( result.figuresUrl ).to.be.an( "array" ).that.is.not.empty
            expect(result.content).not.equal(null)
            expect(result.content).not.equal(undefined)
            expect(result.content).not.equal('')
            expect(result.date).not.equal(null)

            expect(result.date).not.equal(undefined)
            expect(result.tags).not.equal(undefined)
            expect(result.content).not.equal(undefined)
            expect(result.description).not.equal(undefined)
            expect(result.headline).not.equal(undefined)
            expect(result.url).not.equal(undefined)
        });
    });
});