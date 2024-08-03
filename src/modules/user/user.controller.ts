import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  Req,
  Request,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import {
  getAccessToken,
  verifyToken,
} from 'src/common/utils/verifyGoogleToken';
import { LoginUserDto } from './dto/login-user.dto';
import { createInfoLog } from 'src/common/utils/logger';
import { Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { AuthGuard } from 'src/guard/user.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly i18nService: I18nService,
  ) {}

  // @Post()
  // async create(@Body() user: User): Promise<User> {
  //   return this.userService.create(user);
  // }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateUserDetails(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserById(
      new Types.ObjectId(userId),
      updateUserDto,
    );
  }

  /**
   * This is api function used to login user if user exist else create new user
   * @param loginUserInput
   * @returns jwt token
   */
  @Post()
  async login(@Body() loginUserInput: LoginUserDto): Promise<any> {
    // if user exist then login else create user
    if (loginUserInput.email && loginUserInput.password)
      return this.userService.signInWithEmailAndPassword(
        loginUserInput.email,
        loginUserInput.password,
      );
    const tokenDetails = await getAccessToken(loginUserInput.code);
    const payload = await verifyToken(tokenDetails.id_token);
    const googleId = payload.sub;
    const { email, given_name, family_name, picture } = payload;
    console.log(payload);
    let existingUser = await this.userService.getUserFromGoogleId(googleId);
    if (!existingUser) {
      existingUser = await this.userService.createUser({
        googleId: payload.sub,
        email: email,
        firstName: given_name,
        lastName: family_name,
        image: picture,
      });

      createInfoLog(`${this.i18nService.t('user.New_user_created')}`, 'login', {
        userId: existingUser._id,
      });
    }

    const { jwtToken, refreshToken } = await this.userService.login(
      {
        googleId: payload.sub,
        email,
        userId: existingUser._id,
        firstName: given_name,
        lastName: family_name,
        image: picture,
      },
      process.env.SECRET_KEY,
    );

    createInfoLog(`${this.i18nService.t('user.JWT_created')}`, 'login', {
      userId: existingUser._id,
    });
    return { jwtToken, refreshToken };
  }

  // async getRefreshToken(@Context() ctx: any): Promise<RefreshTokenResponse> {
  //   // get accesss to token
  //   // check the refresh token expiry
  //   // if refresh token is not expired then create login and refresh token
  //   let refreshToken = ctx.req.headers['refresh-token'];
  //   if (refreshToken == null) {
  //     throw new UnauthorizedException(
  //       this.i18nService.t('default.GUARD_TOKEN_REQUIRED'),
  //     );
  //   }

  //   if (refreshToken.startsWith('Bearer ')) {
  //     refreshToken = refreshToken.slice(7, refreshToken.length);
  //   }
  //   const tokenResponse = await this.userService.refreshSession(refreshToken);
  //   return {
  //     jwt: tokenResponse.jwtToken,
  //     refreshToken: tokenResponse.refreshToken,
  //   };
  // }

  /**
   * This is api function used to validate user
   * @param token
   * @returns boolean
   */
  // @Query(() => GetTokenResponse)
  // async validateUser(
  //   @Args('validateUserInput') validateUserInput: ValidateUserInput,
  // ): Promise<GetTokenResponse> {
  //   const tokenDetails = await getAccessToken(validateUserInput.code);
  //   const { userExist, googleId } = await this.userService.validateUser(
  //     tokenDetails.id_token,
  //   );
  //   return {
  //     ...tokenDetails,
  //     userExist,
  //     googleId,
  //   };
  // }

  /**
   * This api function used is to check if the pin is correct for a particular user
   * @returns boolean
   */
  // @UseGuards(UserGuard)
  // @Query(() => Boolean)
  // async checkPinForUser(
  //   @Args('checkPinForUserInput') checkPinForUserInput: CheckPinForUserInput,
  //   @Context() ctx: any,
  // ): Promise<boolean> {
  //   const { googleId } = ctx.req.decoded;
  //   const response = await this.userService.checkPinForUser(
  //     googleId,
  //     checkPinForUserInput.pin,
  //   );
  //   return response;
  // }

  /**
   * This is api function used to fetch user
   * @param
   * @returns user
   */
  // @UseGuards(UserGuard, LoggerGuard)
  async getUserDetails(@Request() req: any): Promise<User> {
    const { userId } = req.decoded;
    createInfoLog(
      `${this.i18nService.t('user.Sending_user_details')}`,
      'getUserDetails',
      {
        userId,
      },
    );
    const user: any = await this.userService.getUserById(
      new Types.ObjectId(userId),
    );
    return user;
  }
}
