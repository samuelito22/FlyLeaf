import express from 'express'
import centralizedErrorHandler from '../utils/centralizedErrorHandler.utils';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.utils';
import InterestsModel from '../models/interest.model';
import { COLLECT_INTERESTS, COLLECT_QUESTIONS } from '../utils/aggregate.utils';
import LanguagesModel from '../models/languages.model';
import GenderModel from '../models/gender.model';
import QuestionModel from '../models/questions.model';

async function getOverviewEn(req: express.Request, res: express.Response) {
    try{
        const interests = await InterestsModel.aggregate([
          ...COLLECT_INTERESTS
        ])

        const languages = await LanguagesModel.find({})

        const genders = await GenderModel.find({})

        const questions = await QuestionModel.aggregate([
            ...COLLECT_QUESTIONS
          ])

        return sendSuccessResponse(res, 200, "Data successfully fetched", {interests, languages, genders, questions})


    }catch (error) {
        const errorMessage = (error as Error).message;
    
        const status = centralizedErrorHandler(errorMessage)
    
        return sendErrorResponse(res, status, errorMessage)
      }
}

const overviewController = {getOverviewEn}
export default overviewController