// const bookshelf = require('_/database')
// const PriceListData = require('_/models/priceListData')
// const MasterProductName = require('_/models/masterProductName')
// const MasterProductNames = require('_/collections/masterProductNames')
// const SupplierProductName = require('_/models/supplierProductName')
// const Supplier = require('_/models/supplier')
const logger = require('_/logger')
const Promise = require('bluebird')
const pcConfig = require('../pcConfig')
const assert = require('assert')
// const _ = require('lodash')
// const pcFormula = require('../helpers/pcFormula')
// const parseBonus = require('../helpers/parseBonus')
// const currencyDotToComma = require('_/util/converter').currencyDotToComma
// const fetchWithCollectionId = require('../helpers/fetchWithCollectionId')
// const fetchIdNamePairs = require('../helpers/fetchIdNamePairs')
const arrangeForFile = require('../helpers/arrangeForFile')
const ArrangeProcess = require('../processes/arrange')
const DB = require('../db')

const dbToObject = (arrangeProcess) => {
  assert(arrangeProcess, 'requires an ArrangeProcess instance')
  return (req, res, next) => {
    Promise.coroutine(function * () {
      let start = new Date()
      let priceListData
      // logger.debug(req.params)
      // if collection id was provided, fetch price list data with it
      if (req.params && req.params.collectionId) {
        // const collectionId = req.params.collectionId // string
        // // Validate collection id
        // if (!Number.isInteger(parseFloat(collectionId))) {
        //   throw new Error('No collection id provided')
        // }
        priceListData = yield arrangeProcess.getPriceListData({ collectionId: req.params.collectionId })
      }
      // else if price list data is already supplied
      else if (req.priceListData) { // eslint-disable-line
        priceListData = req.priceListData
      }
      let records = yield arrangeProcess.arrangeForFile(priceListData)

      // let toCsvArrayOfObject = []
      // let masterHash = {}
      // let skippedRecords = []

      // // Fetch required data from database
      // let nameIdPairs = yield fetchIdNamePairs()
      // let supplierNameIds = nameIdPairs.supplierNameIds
      // let supplierProductNameIds = nameIdPairs.supplierProductNameIds
      // let masterProductNamesKnex = nameIdPairs.masterProductNamesKnex
      // // let suppliers = yield Supplier.fetchAll()
      // // let supplierNameIds = suppliers.getNameIdPairs('id', 'name')
      // //
      // // let supplierProductNames = yield SupplierProductName.fetchAll()
      // // let supplierProductNameIds = supplierProductNames.getNameIdPairs('id', 'supplier_product_name')
      // // // let masterProductNames = yield MasterProductName.fetchAll({withRelated: ['supplierProductNames']})
      // // let masterProductNamesKnex = yield bookshelf.knex.select('id', 'master_product_name').from('master_product_name')
      //
      //
      //
      // // Fetch Price List Data from DB
      // // let priceListDataKnex = yield bookshelf.knex.select().from('price_list_data').where({price_list_collection_id: collectionId})
      // // if (priceListDataKnex.length === 0) {
      // //   throw new Error('Collection not found')
      // // }
      // let priceListDataKnex = yield fetchWithCollectionId(collectionId)
      // logger.debug(priceListDataKnex[0])
      // // let masterProductNamesIds = MasterProductNames.forge(masterProductNamesKnex).getNameIdPairs('id', 'master_product_name_id')
      // let records = arrangeForFile({ priceListData: priceListDataKnex, supplierNameIds, supplierProductNameIds, masterProductNamesKnex })
      // logger.debug(records)
      // Create one record for each Master in the database and add it to the masterHash so that priceListData can be associated with it
      // masterProductNamesKnex.forEach(master => {
      //   let record = Object.assign({}, pcConfig.defaultValues)
      //   record['si_no'] = master.id
      //   record['product_master_name'] = master.master_product_name
      //
      //   masterHash[master.id] = record
      // })
      //
      // // For each price list data record, search the matching master product name in the masterHash, take its value and mutate it by adding its data
      // priceListDataKnex.forEach(data => {
      //   let record = masterHash[data.master_product_name_id]
      //   let supplierName = supplierNameIds[data.supplier_id]
      //   let lowerSupName = supplierName ? supplierName.toLowerCase() : undefined
      //   let basePrice = data.whole_sale_price
      //   if (record && supplierName) {
      //     // **************************************************************************************************************************************
      //     // MEDSEVEN
      //     // **************************************************************************************************************************************
      //     if (lowerSupName === 'medseven') {
      //       record['medseven_product_name'] = supplierProductNameIds[data.supplier_product_name_id]
      //       record['medseven_price'] = currencyDotToComma(basePrice)
      //     }
      //     // **************************************************************************************************************************************
      //     // SHARJAH
      //     // **************************************************************************************************************************************
      //     else if (lowerSupName === 'sharjah') {
      //       record['sharjah_product_name'] = supplierProductNameIds[data.supplier_product_name_id]
      //       record['sharjah_price'] = currencyDotToComma(basePrice)
      //       record['moh'] = data.moh_percentage
      //     }
      //     // **************************************************************************************************************************************
      //     // SULTAN
      //     // **************************************************************************************************************************************
      //     else if (lowerSupName === 'sultan') {
      //       let parsedBonus = parseBonus.single(data.bonus)
      //       let bonus1 = parsedBonus.bonus_1
      //       let bonus2 = parsedBonus.bonus_2
      //       let bonus3 = parsedBonus.bonus_3
      //       record['sultan_product_name'] = supplierProductNameIds[data.supplier_product_name_id]
      //       record['sultan_base_price'] = currencyDotToComma(basePrice)
      //       record['sultan_scheme'] = data.bonus
      //       record['sultan_price_1'] = bonus1 ? currencyDotToComma(pcFormula(basePrice, bonus1.normalAmount, bonus1.bonusAmount)) : '-'
      //       record['sultan_price_2'] = bonus2 ? currencyDotToComma(pcFormula(basePrice, bonus2.normalAmount, bonus2.bonusAmount)) : '-'
      //       record['sultan_price_3'] = bonus3 ? currencyDotToComma(pcFormula(basePrice, bonus3.normalAmount, bonus3.bonusAmount)) : '-'
      //       record['sultan_bonus_1'] = parsedBonus.bonusStrings.bonus_1 || '+'
      //       record['sultan_bonus_2'] = parsedBonus.bonusStrings.bonus_2 || '+'
      //       record['sultan_bonus_3'] = parsedBonus.bonusStrings.bonus_3 || '+'
      //     }
      //     // **************************************************************************************************************************************
      //     // TAMIMI
      //     // **************************************************************************************************************************************
      //     else if (lowerSupName === 'tamimi') {
      //       let parsedBonus = parseBonus.triple({bonus_1: data['bonus_1'], bonus_2: data['bonus_2'], bonus_3: data['bonus_3']})
      //       let bonus1 = parsedBonus.bonus_1
      //       let bonus2 = parsedBonus.bonus_2
      //       let bonus3 = parsedBonus.bonus_3
      //       record['tamimi_product_name'] = supplierProductNameIds[data.supplier_product_name_id]
      //       record['tamimi_base_price'] = currencyDotToComma(basePrice)
      //       record['tamimi_price_1'] = bonus1 ? currencyDotToComma(pcFormula(basePrice, bonus1.normalAmount, bonus1.bonusAmount)) : '-'
      //       record['tamimi_price_2'] = bonus2 ? currencyDotToComma(pcFormula(basePrice, bonus2.normalAmount, bonus2.bonusAmount)) : '-'
      //       record['tamimi_price_3'] = bonus3 ? currencyDotToComma(pcFormula(basePrice, bonus3.normalAmount, bonus3.bonusAmount)) : '-'
      //       record['tamimi_bonus_1'] = parsedBonus.bonusStrings.bonus_1 || '+'
      //       record['tamimi_bonus_2'] = parsedBonus.bonusStrings.bonus_2 || '+'
      //       record['tamimi_bonus_3'] = parsedBonus.bonusStrings.bonus_3 || '+'
      //     }
      //   } else {
      //     skippedRecords.push(data)
      //   }
      // })
      //
      // // Add all entires in the masterhash as rows to the toCsvArrayOfObject object
      // _.forOwn(masterHash, (value, key) => {
      //   toCsvArrayOfObject.push(value)
      // })


      // let rows = masterProductNames.models.map((model) => model.attributes)
      // logger.debug(masterProductNames)

      // let supplierProductNames = yield SupplierProductName.fetchAll()
      // let supplierProductNamesIds = supplierProductNames.getNameIdPairs('supplier_product_name', 'id')

      // let priceListData = yield PriceListData.where({price_list_collection_id: collectionId}).fetchAll()
      // priceListData = priceListData.models.map((model) => model.attributes)
      //

      //
      // rows.forEach(row => {
      //   let toCsvObject = pcConfig.defaultValues
      //   toCsvArrayOfObject.push(toCsvObject)
      // })
      //
      // logger.debug(toCsvArrayOfObject[100])
      req.createCsvFileSettings = {
        rows: records,
        columns: pcConfig.columns
      }
      // get master ids, 1 row per master
      // create object with default vales
      logger.info('Price comparison took: ' + (new Date() - start) + 'ms')
    })()
    .then(() => {
      logger.info('Creating price comparison data: success')
      next()
      return null
    })
    .catch(err => {
      logger.info('Creating Price comparison data: failed')
      logger.info(err)
      next(err)
    })
  }
}

module.exports = dbToObject