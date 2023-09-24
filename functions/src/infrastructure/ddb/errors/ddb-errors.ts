import { baseInfraError } from '../../base/errors/base-infra-errors';

export class DdbError extends baseInfraError {}

export class DdbResourceNotFoundError extends DdbError {}
export class DdbProvisionedThroughputExceededError extends DdbError {}
export class DdbValidationError extends DdbError {}
export class DdbInternalServerError extends DdbError {}
