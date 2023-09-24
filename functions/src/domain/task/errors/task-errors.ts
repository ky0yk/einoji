import { DomainError } from '../../base/errors/domain-error';

export class TaskError extends DomainError {}

export class TaskNotFoundError extends TaskError {}
export class TaskUpdateRuleError extends TaskError {}
