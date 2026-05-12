import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import GraphQLJSON from 'graphql-type-json';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { FilesModule } from './files/files.module';
import { MetadataModule } from './metadata/metadata.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        ssl: configService.get<string>('DB_SSLMODE') === 'require' ? { rejectUnauthorized: false } : false,
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      csrfPrevention: false,
      context: ({ req }) => ({ req }),
      buildSchemaOptions: {
        scalarsMap: [{ type: Object, scalar: GraphQLJSON }],
      },
    }),

    CommonModule,
    MailModule,
    AuthModule,
    UsersModule,
    FilesModule,
    FileModule,
    MetadataModule,
  ],
})
export class AppModule {}