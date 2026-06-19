export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateBudget(budget: number): boolean {
  return typeof budget === 'number' && budget > 0;
}

export function validateJobId(jobId: string): boolean {
  return typeof jobId === 'string' && jobId.length > 0;
}

export function validateContractId(contractId: string): boolean {
  return typeof contractId === 'string' && contractId.length > 0;
}

export function validateMessage(message: string): boolean {
  return typeof message === 'string' && message.length > 0 && message.length <= 5000;
}

export function validateCoverLetter(coverLetter: string): boolean {
  return typeof coverLetter === 'string' && coverLetter.length >= 10 && coverLetter.length <= 5000;
}

export function validateSkillsList(skills: string[]): boolean {
  return (
    Array.isArray(skills) &&
    skills.length > 0 &&
    skills.length <= 20 &&
    skills.every((skill) => typeof skill === 'string' && skill.length > 0)
  );
}

export function validateRating(rating: number): boolean {
  return typeof rating === 'number' && rating >= 0 && rating <= 5;
}

export function validateRate(rate: number): boolean {
  return typeof rate === 'number' && rate > 0 && rate <= 999;
}
