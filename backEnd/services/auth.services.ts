import { Op } from 'sequelize';
import {
  REVOKED_TOKEN,
  TOKEN_NOT_FOUND,
} from '../constants/errors';
import Model from '../models';

async function updateUserRefreshTokenInDB(userId: string, refreshToken: string, transaction?: any) {
  let tokenDoc = await Model.RefreshTokens.findOne({ where: { userId }, transaction });

  if (tokenDoc) {
    await Model.RefreshTokens.update(
      {
        revoked: null,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
      },
      { where: { userId }, transaction }
    );
  } else {
    await Model.RefreshTokens.create(
      {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
      } as any,
      { transaction }
    );
  }
}

async function deactivateRefreshToken(refreshToken: string) {
  const tokenDoc = await Model.RefreshTokens.findOne({ where: { token: refreshToken } });

  if (!tokenDoc) {
    throw new Error(TOKEN_NOT_FOUND);
  }

  if (tokenDoc.revoked) {
    throw new Error(REVOKED_TOKEN);
  }

  await tokenDoc.update({ revoked: new Date() });

  return { status: 'success', message: REVOKED_TOKEN };
}

async function emailExistService(data: { email: string }) {
  const emailExist = await Model.User.findOne({ where: { email: data.email } });
  return emailExist;
}

async function phoneNumberExistService(data: { phoneNumber: string }) {
  const phoneNumberExist = await Model.User.findOne({ where: { phoneNumber: data.phoneNumber } });
  return phoneNumberExist;
}

async function uidExistService(data: { id: string }) {
  const user = await Model.User.findOne({ where: { id: data.id } });
  return user;
}

const AuthServices = {
  emailExistService,
  phoneNumberExistService,
  uidExistService,
  deactivateRefreshToken,
  updateUserRefreshTokenInDB,
};

export default AuthServices;
