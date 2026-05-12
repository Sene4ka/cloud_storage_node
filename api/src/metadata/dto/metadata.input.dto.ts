import {
  IsString, IsOptional, IsInt, Min,
  Max, IsBoolean, IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InputType, Field, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class ListMetadataInputDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @Field(() => Int, { nullable: true, defaultValue: 20 })
  pageSize?: number = 20;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  sortOrder?: 'ASC' | 'DESC';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  search?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isTrashed?: boolean;
}

@InputType()
export class UpdateMetadataInputDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  filename?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  originalName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  path?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isPublic?: boolean;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { nullable: true })
  tags?: Record<string, string>;
}