import { DataTypes, Model } from 'sequelize';
import { ScrapingIndexI } from './ScrapingIndex';
import { ScrapingIndexBatchI } from './ScrapingIndexBatch';
import { ScrapingUrlsSqlI } from './ScrapingUrlSql';

export interface ScrapingIndexBatchSqlI {
  dateScraping: Date;
  scrapingIndexesIds: string;
  newspaper: string;
  scraperId: string;
  deviceId: string;
  id:number;
  scrapingIteration:number;
}

export const scrapingIndexSqlAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dateScraping: {
    type: DataTypes.DATE
  },
  newspaper: {
    type: DataTypes.STRING
  },
  
  scraperId: {
    type: DataTypes.STRING
  },
  deviceId: {
    type: DataTypes.STRING
  },
  scrapingIteration: {
    type: DataTypes.NUMBER
  }
};

export const joiningStrUrls = '=====';

export class ScrapingIndexBatchSql extends Model<ScrapingIndexBatchSqlI> {}

export const convertToScrapingIndexBatchSqlI = (
  index: ScrapingIndexBatchI
): ScrapingIndexBatchSqlI => {
  const indexSql = index as any;
  if (indexSql.scrapingIndexesIds && Array.isArray(indexSql.scrapingIndexesIds)) {
    const indexes = indexSql.scrapingIndexesIds;
    indexSql.scrapingIndexesIds = indexes.join(joiningStrUrls);
  }
  
  return indexSql as ScrapingIndexBatchSqlI;
};

export const convertScrapingIndexSqlI = (
  indexSql: ScrapingIndexBatchSqlI
): ScrapingIndexBatchI => {
  const index = indexSql as any;
  
  if (
    index.scrapingIndexesIds &&
    index.scrapingIndexesIds.includes(joiningStrUrls)
  ) {
    index.scrapingIndexesIds =
      index.scrapingIndexesIds.split(joiningStrUrls);
  }

  return index as ScrapingIndexBatchI;
};

