import { BadRequestException } from '@nestjs/common';

export function validateDiscountDates(startAt: Date, expiresAt: Date): void {
  const currentDate = new Date();

  if (startAt > expiresAt) {
    throw new BadRequestException(
      'The start date cannot be after the expiration date.',
    );
  }

  if (startAt < currentDate) {
    throw new BadRequestException('The start date cannot be in the past.');
  }

  if (expiresAt < currentDate) {
    throw new BadRequestException('The expiration date cannot be in the past.');
  }
}
