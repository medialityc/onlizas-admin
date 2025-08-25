import { cn } from '@/lib/utils';
import React, { memo, JSX } from 'react';

type Props = {
  text: string;
  lineClamp: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

const LongText = ({
  lineClamp = 1,
  text,
  as: Component = 'p',
  className,
}: Props) => {
  return (
    <Component
      className={cn(
        `line-clamp-${lineClamp} text-ellipsis overflow-hidden`,
        className
      )}
    >
      {text}
    </Component>
  );
};

export default memo(LongText);
