import { baseInfraError } from '../../base/errors/base-infra-errors';

export class DdbError extends baseInfraError {}

export class DdbValidationError extends DdbError {}
export class DdbInternalServerError extends DdbError {}
