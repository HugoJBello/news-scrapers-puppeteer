# News scraper
# 

docker build . -t news-scraper
docker stop -t news-scraper

docker run -d --name  news-scraper --restart always --network=host news-scraper
docker logs --follow news-scraper


docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

run single test using it(..) handle:
    npm test -- --grep "NewYorkTimesContentScraper"
    npm test -- --grep "GuardianNewContentScraper"
    npm test -- --grep "ElDiarioesContentScraper"
    npm test -- --grep "PublicoContentScraper"
    npm test -- --grep "ElMundoContentScraper"
    npm test -- --grep "ElHeraldoSoriaContentScraper"
    npm test -- --grep "ScienceNewsContentScraper"


    npm test -- --grep "ElDiarioesIndexScraper"
    npm test -- --grep "ElPaisIndexScraper"
    npm test -- --grep "PublicoIndexScraper"
    npm test -- --grep "GuardianIndexScraper"    
    npm test -- --grep "NewYorkTimesIndexScraper"
    npm test -- --grep "ElHeraldoSoriaIndexScraper"    
    npm test -- --grep "ScienceNewsIndexScraper"