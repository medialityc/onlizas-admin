import { cn } from '@/lib/utils';
import { formatDate } from 'date-fns';

interface Props {
  value: string | Date | undefined;
  format?: string;
  className?: string;
}

export const DateValue: React.FC<Props> = ({
  value,
  format = 'dd MMM yyyy',
  className,
}) => {
  const getValidDate = (value: string | Date | undefined): Date => {
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'string') {
      const parsedDate = new Date(value);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }
    return new Date();
  };

  const validDate = getValidDate(value);

  return (
    <div className={cn('font-medium', className)}>
      {formatDate(validDate, format)}
    </div>
  );
};

export default DateValue;
