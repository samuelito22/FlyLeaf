import express from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.utils';
import centralizedErrorHandler from '../utils/centralizedErrorHandler.utils';
import Model from '../models';

async function getOverviewEn(req: express.Request, res: express.Response) {
    try {
       
        const interests = await Model.Interests.findAll({
            include: [
                {
                  model: Model.InterestsCategory,
                  as: 'category'  
                }
              ]
            });

        // Retrieve all languages
        const languages = await Model.Languages.findAll();

        // Retrieve all genders
        const primaryGenders = await Model.PrimaryGender.findAll();
        const secondaryGenders = await Model.SecondaryGender.findAll();
        const genders = { primaryGenders, secondaryGenders };

        const relationshipGoals = await Model.RelationshipGoal.findAll()

        // Retrieve questions and answers
        const questions = await Model.Questions.findAll();
        const answers = await Model.Answers.findAll()

        return sendSuccessResponse(res, 200, "Data successfully fetched", { interests, languages, relationshipGoals, genders, questions, answers });
    } catch (error) {
        const errorMessage = (error as Error).message;

        // Note: The centralized error handler would need some modifications if it's mongoose specific.
        const status = centralizedErrorHandler(errorMessage); 

        return sendErrorResponse(res, status, errorMessage);
    }
}

const overviewController = { getOverviewEn };
export default overviewController;
