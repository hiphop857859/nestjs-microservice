import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import {
  DifficultyType,
  QuizzConfigInput,
  QuizzConfigType,
  TimeType,
  VisibilityType,
  CheckTypeQuizzConfig,
  BaseListResponse,
  Question,
  Category,
  CourseTag,
  BaseTypedef,
  QuizzConfigTypeDef,
  QuestionType,
  RuleQuestionType,
} from '@metahop/graphql';

registerEnumType(TimeType, {
  name: 'TimeType',
});
registerEnumType(QuizzConfigType, {
  name: 'QuizzConfigType',
});
registerEnumType(DifficultyType, {
  name: 'DifficultyType',
});

registerEnumType(CheckTypeQuizzConfig, {
  name: 'CheckTypeQuizzConfig',
});

@ObjectType()
export class QuizzHopana extends BaseTypedef {
  @Field(() => String, {
    nullable: true,
  })
  _id!: string;

  @Field(() => String, {
    nullable: true,
  })
  name!: string;
  @Field(() => String, {
    nullable: true,
  })
  startAt!: string;
  @Field(() => String, {
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
  passCode!: string;
  @Field(() => String, {
    nullable: true,
  })
  content!: string;

  @Field(() => String, {
    nullable: true,
  })
  coverImage!: string;

  @Field(() => Boolean, {
    nullable: true,
  })
  isActive!: boolean;

  @Field(() => [DataQuestionTypedefs], {
    nullable: true,
  })
  dataQuestions!: DataQuestionTypedefs[];
  @Field(() => [Category], {
    nullable: true,
  })
  categories!: Category[];

  @Field(() => [CourseTag], {
    nullable: true,
  })
  tags!: CourseTag[];
  @Field(() => DifficultyType, {
    nullable: true,
  })
  difficulty!: string;
  @Field(() => TimeType, {
    nullable: true,
  })
  timerType!: string;
  @Field(() => QuizzConfigTypeDef, {
    nullable: true,
  })
  config!: object;

  @Field(() => [GraphQLJSON], {
    nullable: true,
  })
  configQuestion!: object[];
  @Field(() => [String], {
    nullable: true,
  })
  whitelistedEmails!: string[];

  @Field(() => QuizzConfigType, {
    nullable: true,
  })
  configType!: string;
  @Field(() => VisibilityType, {
    nullable: true,
  })
  visibility!: string;
}
@ObjectType()
export class ConfigQuestionTydef {
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
@ObjectType()
export class DataQuestionTypedefs {
  @Field(() => String, {
    nullable: false,
  })
  _id!: string;
  @Field(() => String, {
    nullable: false,
  })
  name!: string;
  @Field(() => MetadataQuestionTypeDef, {
    nullable: true,
  })
  metadata!: object;
  @Field(() => String, {
    nullable: false,
  })
  description!: string;
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
  @Field(() => ConfigQuestionTydef, {
    nullable: true,
  })
  config!: ConfigQuestionTydef;
  @Field(() => [DataAnswersTypedef], {
    nullable: true,
  })
  dataAnswers!: DataAnswersTypedef[];
}
@ObjectType()
export class MetadataQuestionTypeDef {
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
@ObjectType()
export class DataAnswersTypedef {
  @Field(() => String, {
    nullable: false,
  })
  _id!: string;
  @Field(() => String, {
    nullable: true,
  })
  description!: string;
  @Field(() => Boolean, {
    nullable: true,
    defaultValue: true,
  })
  isCorrectAnswer!: boolean;

  @Field(() => MetadataAnswersTypedef, {
    nullable: true,
  })
  metadata!: object;
}

@ObjectType()
export class MetadataAnswersTypedef {
  @Field(() => GapFillingAnswersTypedef, {
    nullable: true,
  })
  gap_filling!: object;

  @Field(() => GapTouchingAnswersTypedef, {
    nullable: true,
  })
  gap_touching!: object;
  @Field(() => GapDifferentSpotAnswersTypedef, {
    nullable: true,
  })
  different_spot!: object;
}
@ObjectType()
export class GapFillingAnswersTypedef {
  @Field(() => String, {
    nullable: true,
  })
  data!: string;

  @Field(() => Boolean, {
    nullable: true,
  })
  exact!: boolean;
}
@ObjectType()
export class GapTouchingAnswersTypedef {
  @Field(() => String, {
    nullable: true,
  })
  data!: string;

  @Field(() => [String], {
    nullable: true,
  })
  correct_answers!: string[];
}
@ObjectType()
export class GapDifferentSpotAnswersTypedef {
  @Field(() => Int, {
    nullable: true,
  })
  x!: number;

  @Field(() => Int, {
    nullable: true,
  })
  y!: number;
}
@ObjectType()
export class GenerateQuizz {
  @Field(() => Boolean, {
    nullable: true,
  })
  success!: boolean;
}
@ObjectType()
export class UpdateAllTotalCategoryQuizz {
  @Field(() => Boolean, {
    nullable: true,
  })
  success!: boolean;
}
