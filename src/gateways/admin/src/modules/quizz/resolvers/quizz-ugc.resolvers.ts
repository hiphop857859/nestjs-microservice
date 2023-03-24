import {
  QuizzUgcMessagePattern,
  QuizzMicroserviceConfig,
  CurrentUser,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  QuizzUgcQueryInput,
  CreateQuizzUgcInput,
  UpdateQuizzUgcInput,
  QuizzUgcListReponse,
  QuizzUgc,
} from '@metahop/graphql';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ApproveQuizzUgcInput,
  RejectQuizzUgcInput,
} from '../inputs/quizz.input';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();

@Resolver(() => QuizzUgc)
@UseGuards(AdminJwtAuthGuard)
export class QuizzUgcResolver extends BaseResolver<
  CreateQuizzUgcInput,
  UpdateQuizzUgcInput,
  QuizzUgcQueryInput
>({
  viewDto: QuizzUgc,
  createInput: CreateQuizzUgcInput,
  updateInput: UpdateQuizzUgcInput,
  listQueryInput: QuizzUgcQueryInput,
  listViewDto: QuizzUgcListReponse,
  name: 'quizzUgc',
  pluralName: 'quizzUgcs',
}) {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, QuizzUgcMessagePattern);
  }

  @ResolveField()
  async user(@Parent() quizzUgc: QuizzUgc, @Context() { loaders }) {
    const user = await loaders.user.load(quizzUgc.user);
    if (!user) {
      return {
        email: '',
      };
    }
    return user;
  }

  @ResolveField()
  async approveBy(@Parent() quizzUgc: QuizzUgc, @Context() { loaders }) {
    if (!quizzUgc.approveBy) {
      return {
        email: '',
      };
    }
    return await loaders.administrator.load(quizzUgc.approveBy);
  }

  @ResolveField()
  async rejectBy(@Parent() quizzUgc: QuizzUgc, @Context() { loaders }) {
    if (!quizzUgc.rejectBy) {
      return {
        email: '',
      };
    }
    return await loaders.administrator.load(quizzUgc.rejectBy);
  }

  @Mutation(() => QuizzUgc, { name: 'approveQuizzUgc' })
  async approve(
    @Args('input') input: ApproveQuizzUgcInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.quizzMicroservice.send(QuizzUgcMessagePattern.APPROVE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => QuizzUgc, { name: 'rejectQuizzUgc' })
  async reject(@Args('input') input: RejectQuizzUgcInput, @CurrentUser() user) {
    return await firstValueFrom(
      this.quizzMicroservice.send(QuizzUgcMessagePattern.REJECT, {
        input,
        user,
      }),
    );
  }
}
