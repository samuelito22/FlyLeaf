import express from "express"

export function sendErrorResponse(res: express.Response, statusCode: number, message: string) {
    return res.status(statusCode).json({
      type: "error",
      message: message,
    });
  }
  
 export function sendSuccessResponse(res: express.Response, statusCode: number, message: string, data: any = null) {
    return res.status(statusCode).json({
      type: "success",
      message: message,
      ...data,
    });
  }