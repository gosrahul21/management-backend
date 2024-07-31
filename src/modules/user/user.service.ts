import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { User, UserDocument } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserInput } from 'src/modules/user/dto/user.input';
import { createErrorLog, createInfoLog } from 'src/common/utils/logger';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly i18nService: I18nService,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async getUserFromGoogleId(googleId: string) {
    try {
      const user = await this.userModel.findOne({ googleId }).lean();
      return user;
    } catch (error) {
      createErrorLog(
        `${this.i18nService.t('user.ERROR_GET_USER')}`,
        'getUserFromGoogleId',
        {
          error: error?.message,
        },
      );
      throw error;
    }
  }

  async login(
    userData: UserInput,
    secretKey: string,
  ): Promise<{ jwtToken: string; refreshToken: string }> {
    try {
      const user = await this.getUserFromGoogleId(userData.googleId);
      if (!user) {
        createErrorLog(
          `${this.i18nService.t('user.User_not_available')}`,
          'login-service',
          {
            userId: userData.userId,
            googleId: userData.googleId,
          },
        );
        throw new Error('user.USER_NOT_AVAILABLE');
      } else {
        const payload = {
          googleId: userData.googleId,
          userId: userData.userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          image: userData.image,
        };
        const { jwtToken, refreshToken } = this.generateAuthToken(
          payload,
          secretKey,
        );

        // update user details if there is any changes
        if (
          user.firstName !== userData.firstName ||
          user.lastName !== userData.lastName ||
          user.image !== userData.image
        ) {
          createInfoLog(
            `${this.i18nService.t('user.User_details_updated')}`,
            'login-service',
            {
              userId: userData.userId,
            },
          );
          await this.updateUserById(user._id, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
          });
        }
        return { jwtToken, refreshToken };
      }
    } catch (error) {
      createErrorLog(
        `${this.i18nService.t('user.Error_in_user_login')}`,
        'login-service',
        {
          userId: userData.userId,
          error: error.message,
        },
      );
      // throwErrorMessage(error);
      throw new Error('Error in user login');
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (password === user.password) {
      const { jwtToken, refreshToken } = this.generateAuthToken(
        {
          googleId: user.googleId,
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
        },
        process.env.SECRET_KEY,
      );
      return {
        jwtToken,
        refreshToken,
      };
    }
  }

  async createUser(userData: User): Promise<any> {
    try {
      const user = await this.userModel.findOne({
        googleId: userData.googleId,
      });
      if (!user) {
        const newUser = new this.userModel({
          googleId: userData.googleId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          image: userData.image,
        });
        await newUser.save();
        return newUser;
      } else {
        // createErrorLog(
        //   `${this.i18nService.t('user.User_already_exists')}`,
        //   'createUser',
        //   {
        //     userId: userData._id,
        //   },
        // );
        throw new Error('user.USER_EXISTS');
      }
    } catch (error) {
      // createErrorLog(
      //   `${this.i18nService.t('user.ERROR_CREATE_USER')}`,
      //   'createUser',
      //   {
      //     userId: userData?._id,
      //     error: error?.message,
      //   },
      // );
      // throwErrorMessage(error);
      throw new Error('create user error');
    }
  }

  async updateUserById(userId: Types.ObjectId, updateQuery: UpdateQuery<User>) {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(userId, updateQuery)
        .lean();
      if (!user) {
        // createErrorLog(
        //   `${this.i18nService.t('user.User_does_not_exist')}`,
        //   'updateUserById',
        //   {
        //     userId,
        //   },
        // );
        throw new NotFoundException('user.USER_NOT_AVAILABLE');
      }
      return user;
    } catch (error) {
      // createErrorLog(
      //   `${this.i18nService.t('user.ERROR_UPDATE_USER')}`,
      //   'updateUserById',
      //   {
      //     userId,
      //     error: error?.message,
      //   },
      // );
      throw error;
    }
  }

  generateAuthToken(payload: any, secretKey: string) {
    const jwtToken = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: process.env.LINK_TOKEN_EXPIRY || '30m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '6h',
    });
    return {
      jwtToken,
      refreshToken,
    };
  }

  async getUserById(userId: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(userId).lean();
      if (!user) throw new Error(this.i18nService.t('user.USER_NOT_AVAILABLE'));
      return user;
    } catch (error) {
      createErrorLog(
        `${this.i18nService.t('user.USER_NOT_AVAILABLE')}`,
        'getUserById',
        {
          userId,
          error: error?.message,
        },
      );
      throw error;
    }
  }
}
