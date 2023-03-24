import {
  DifficultyType,
  QuestionType,
  QuizzConfigInput,
  QuizzConfigType,
  RuleQuestionType,
  TimeType,
  VisibilityType,
} from '@metahop/graphql';
import { Field, InputType, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
@InputType()
export class ConfigQuestionInput {
  @Field(() => Number, {
    nullable: true,
    defaultValue: 0,
  })
  questionScore!: number;
  @Field(() => Number, {
    nullable: true,
    defaultValue: 0,
  })
  SCORE!: number;
  @Field(() => Number, {
    nullable: true,
    defaultValue: 0,
  })
  EXP!: number;
  @Field(() => Boolean, {
    nullable: true,
    defaultValue: false,
  })
  isRequired!: boolean;
}
@InputType()
export class BaseQuizzHopanaInput {
  @Field(() => String, {
    nullable: true,
  })
  name!: string;
  @Field(() => Date, {
    nullable: true,
  })
  startAt!: string;
  @Field(() => Date, {
    nullable: true,
  })
  endAt!: string;
  @Field(() => String, {
    nullable: true,
  })
  description!: string;

  @Field(() => String, {
    nullable: true,
  })
  coverImage!: string;
  @Field(() => String, {
    nullable: true,
  })
  passCode!: string;
  @Field(() => Boolean, {
    nullable: true,
  })
  isActive!: boolean;

  @Field(() => [String], {
    nullable: true,
  })
  categories!: string[];

  @Field(() => [String], {
    nullable: true,
  })
  tags!: string[];
  @Field(() => DifficultyType, {
    nullable: true,
    defaultValue: DifficultyType.MEDIUM,
  })
  difficulty!: string;
  @Field(() => TimeType, {
    nullable: true,
    defaultValue: TimeType.NO_TIMER,
  })
  timerType!: string;
  @Field(() => QuizzConfigInput, {
    nullable: true,
  })
  config!: object;

  @Field(() => [String], {
    nullable: true,
  })
  whitelistedEmails!: string[];

  @Field(() => QuizzConfigType, {
    nullable: true,
    defaultValue: QuizzConfigType.QUIZZ,
  })
  configType!: string;
  @Field(() => VisibilityType, {
    nullable: true,
    defaultValue: VisibilityType.PUBLIC,
  })
  visibility!: string;
  @Field(() => [DataQuestions], {
    nullable: true,
  })
  dataQuestions!: DataQuestions[];
}
@InputType()
export class DataQuestions {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  description!: string;
  @Field(() => MetadataQuestion, {
    nullable: true,
  })
  metadata!: object;
  @Field(() => QuestionType, {
    nullable: true,
    defaultValue: QuestionType.DEFAULT,
  })
  type!: string;
  @Field(() => RuleQuestionType, {
    nullable: false,
    defaultValue: RuleQuestionType.QUIZZ,
  })
  ruleQuestion!: string;
  @Field(() => ConfigQuestionInput, {
    nullable: true,
  })
  config!: ConfigQuestionInput;
  @Field(() => [DataAnswers], {
    nullable: true,
  })
  dataAnswers!: DataAnswers[];
}
@InputType()
export class DataAnswers {
  @Field(() => String, {
    nullable: true,
  })
  description!: string;
  @Field(() => Boolean, {
    nullable: true,
    defaultValue: true,
  })
  isCorrectAnswer!: boolean;
  @Field(() => MetadataAnswers, {
    nullable: true,
  })
  metadata!: object;
}
@InputType()
export class MetadataAnswers {
  @Field(() => GapFillingAnswers, {
    nullable: true,
  })
  gap_filling!: object;

  @Field(() => GapTouchingAnswers, {
    nullable: true,
  })
  gap_touching!: object;
  @Field(() => GapDifferentSpotAnswers, {
    nullable: true,
  })
  different_spot!: object;
}
@InputType()
export class GapFillingAnswers {
  @Field(() => String, {
    nullable: true,
  })
  data!: string;

  @Field(() => Boolean, {
    nullable: true,
  })
  exact!: boolean;
}
@InputType()
export class MetadataQuestion {
  @Field(() => String, {
    nullable: true,
  })
  descriptionFull!: string;
  @Field(() => String, {
    nullable: true,
  })
  image!: string;
  @Field(() => [String], {
    nullable: true,
  })
  image_slider!: string[];
}
@InputType()
export class GapTouchingAnswers {
  @Field(() => String, {
    nullable: true,
  })
  data!: string;

  @Field(() => [String], {
    nullable: true,
  })
  correct_answers!: string[];
}
@InputType()
export class GapDifferentSpotAnswers {
  @Field(() => Int, {
    nullable: true,
  })
  x!: number;

  @Field(() => Int, {
    nullable: true,
  })
  y!: number;
}
@InputType()
export class UpdateDataAnswers extends DataAnswers {
  @Field(() => String, {
    nullable: true,
  })
  _id!: string;
  @Field(() => Boolean, {
    nullable: true,
    defaultValue: false,
  })
  isDeleted!: boolean;
}
@InputType()
export class UpdateDataQuestions extends DataQuestions {
  @Field(() => String, {
    nullable: true,
  })
  _id!: string;
  @Field(() => Boolean, {
    nullable: true,
    defaultValue: false,
  })
  isDeleted!: boolean;
  @Field(() => [UpdateDataAnswers], {
    nullable: true,
  })
  dataAnswers!: UpdateDataAnswers[];
}
@InputType()
export class CreateQuizzHopanaInput extends BaseQuizzHopanaInput {}

@InputType()
export class UpdateQuizzHopanaInput extends BaseQuizzHopanaInput {
  @Field(() => [UpdateDataQuestions], {
    nullable: true,
  })
  dataQuestions!: UpdateDataQuestions[];
}
