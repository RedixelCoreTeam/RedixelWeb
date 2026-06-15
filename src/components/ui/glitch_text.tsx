import {
  type CSSProperties,
  type ElementType,
  Fragment,
  type ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type GlitchStrip = {
  top: number;
  height: number;
  x1: number;
  x2: number;
  hue1: number;
  hue2: number;
  animId: number;
  duration: number;
  delay: number;
};

type GlitchSlicesProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  contentClassName?: string;
  stripContentClassName?: string;
};

type GlitchTextProps = {
  children: string;
  as?: ElementType;
  className?: string;
  textClassName?: string;
};

type GlitchTextButtonProps = GlitchTextProps & {
  onClick?: () => void;
  buttonClassName?: string;
  buttonType?: 'button' | 'submit' | 'reset';
};

const GLITCH_ANIMATION_COUNT = 8;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateStrips(totalHeight: number): GlitchStrip[] {
  const strips: GlitchStrip[] = [];
  let top = 0;

  while (top < totalHeight) {
    const remaining = totalHeight - top;
    const height = remaining <= 5 ? remaining : randomInt(2, Math.min(4, Math.floor(remaining)));

    strips.push({
      top,
      height,
      x1: randomInt(-10, 10),
      x2: randomInt(-10, 10),
      hue1: randomInt(-20, 20),
      hue2: randomInt(-20, 20),
      animId: randomInt(1, GLITCH_ANIMATION_COUNT),
      duration: randomInt(6500, 10000),
      delay: randomInt(0, 3000),
    });

    top += height;
  }

  return strips;
}

export function GlitchSlices({
  children,
  as: Tag = 'span',
  className = '',
  contentClassName = '',
  stripContentClassName = '',
}: GlitchSlicesProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const stripClassName = stripContentClassName || contentClassName;

  // biome-ignore lint/correctness/useExhaustiveDependencies: remeasure when content or typography changes
  useLayoutEffect(() => {
    const element = measureRef.current;
    if (!element) return;

    const updateHeight = () => {
      const nextHeight = element.getBoundingClientRect().height;
      setContentHeight((current) => (Math.abs(current - nextHeight) < 0.5 ? current : nextHeight));
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [children, contentClassName, stripContentClassName]);

  const strips = useMemo(() => (contentHeight > 0 ? generateStrips(contentHeight) : []), [contentHeight]);

  return (
    <Tag className={`glitch-slices relative inline-block ${className}`}>
      <span
        ref={measureRef}
        className={`pointer-events-none absolute opacity-0 ${contentClassName}`}
        aria-hidden
      >
        {children}
      </span>

      <span className='glitch-text-strips relative inline-block align-top'>
        {strips.length > 0 ? (
          <Fragment>
            <span className={`opacity-0 ${contentClassName}`} aria-hidden>
              {children}
            </span>

            <span className='absolute inset-0 overflow-hidden'>
              {strips.map((strip) => (
                <span
                  key={`${strip.top}-${strip.height}-${strip.animId}-${strip.delay}-${strip.x1}`}
                  className='glitch-text-strip relative block overflow-hidden'
                  style={
                    {
                      height: strip.height,
                      '--strip-offset': `${strip.top}px`,
                      '--glitch-x-1': `${strip.x1}px`,
                      '--glitch-x-2': `${strip.x2}px`,
                      '--glitch-hue-1': `${strip.hue1}deg`,
                      '--glitch-hue-2': `${strip.hue2}deg`,
                      animationName: `glitch-strip-${strip.animId}`,
                      animationDuration: `${strip.duration}ms`,
                      animationDelay: `${strip.delay}ms`,
                    } as CSSProperties
                  }
                >
                  <span className={`glitch-text-strip-content absolute left-0 ${stripClassName}`}>
                    {children}
                  </span>
                </span>
              ))}
            </span>
          </Fragment>
        ) : (
          <span className={contentClassName}>{children}</span>
        )}
      </span>
    </Tag>
  );
}

export function GlitchText({
  children,
  as: Tag = 'span',
  className = '',
  textClassName = '',
}: GlitchTextProps) {
  return (
    <GlitchSlices
      as={Tag}
      className={className}
      contentClassName={textClassName}
      stripContentClassName={`whitespace-nowrap ${textClassName}`}
    >
      {children}
    </GlitchSlices>
  );
}

export function GlitchTextButton({
  children,
  className = '',
  textClassName = '',
  onClick,
  buttonClassName = '',
  buttonType = 'button',
}: GlitchTextButtonProps) {
  return (
    <button type={buttonType} onClick={onClick} className={buttonClassName}>
      <GlitchText className={className} textClassName={textClassName}>
        {children}
      </GlitchText>
    </button>
  );
}
