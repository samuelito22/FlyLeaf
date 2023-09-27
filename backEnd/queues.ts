import { Op } from "sequelize";
import Model from "./models";

// Function to delete old AuthCodes
async function deleteOldAuthCodes() {
  const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);
  try {
    await Model.AuthCode.destroy({
      where: {
        createdAt: {
          [Op.lte]: fiveMinutesAgo,
        },
      },
    });
  } catch (error) {
    console.error("Error deleting old AuthCodes:", error);
  }
}

// Function to delete old OTPs
async function deleteOldOTPs() {
  const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);
  try {
    await Model.PhoneNumberOTP.destroy({
      where: {
        createdAt: {
          [Op.lte]: fiveMinutesAgo,
        },
      },
    });
  } catch (error) {
    console.error("Error deleting old OTPs:", error);
  }
}

// Function to delete old email tokens
async function deleteOldEmailTokens() {
  const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000);
  try {
    await Model.EmailToken.destroy({
      where: {
        createdAt: {
          [Op.lte]: fifteenMinutesAgo,
        },
      },
    });
  } catch (error) {
    console.error("Error deleting old email tokens:", error);
  }
}

// Run functions every 5 minutes (300000 milliseconds)
setInterval(deleteOldAuthCodes, 300000);
setInterval(deleteOldOTPs, 300000);

// Run function every 15 minutes (900000 milliseconds)
setInterval(deleteOldEmailTokens, 900000);
