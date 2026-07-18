import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';

export const commercialSchema = z.object({
  brandName: z.string(),
  headline: z.string(),
  subheadline: z.string(),
  callToAction: z.string(),
  accentColor: z.string(),
  secondaryColor: z.string(),
  backgroundColor: z.string(),
  showMusic: z.boolean(),
});

export type CommercialProps = z.infer<typeof commercialSchema>;

export const defaultCommercialProps: CommercialProps = {
  brandName: 'FocusFlow',
  headline: 'Make every day feel lighter.',
  subheadline: 'Plan less. Finish more. Stay focused.',
  callToAction: 'Start free today',
  accentColor: '#7C5CFF',
  secondaryColor: '#39D9C5',
  backgroundColor: '#090B14',
  showMusic: true,
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const glow = (color: string, strength = 36) => `0 0 ${strength}px ${color}66`;
const enter = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 15, stiffness: 130, mass: 0.8}});

const FadeSlide: React.FC<{
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
}> = ({children, delay = 0, distance = 50, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = enter(frame, fps, delay);
  return (
    <div style={{opacity: progress, transform: `translateY(${(1 - progress) * distance}px)`, ...style}}>
      {children}
    </div>
  );
};

const Background: React.FC<Pick<CommercialProps, 'accentColor' | 'secondaryColor' | 'backgroundColor'>> = ({
  accentColor,
  secondaryColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const orbit = frame * 0.22;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 30%, ${accentColor}22 0%, transparent 38%), ${backgroundColor}`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 720, height: 720, borderRadius: '50%', background: accentColor, opacity: 0.12, filter: 'blur(110px)', left: -260 + Math.sin(orbit / 60) * 70, top: -260 + Math.cos(orbit / 70) * 50}} />
      <div style={{position: 'absolute', width: 640, height: 640, borderRadius: '50%', background: secondaryColor, opacity: 0.1, filter: 'blur(100px)', right: -260 + Math.cos(orbit / 80) * 60, bottom: -260 + Math.sin(orbit / 65) * 60}} />
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '64px 64px', transform: `translateY(${(frame * 0.35) % 64}px)`, maskImage: 'linear-gradient(to bottom, rgba(0,0,0,.7), transparent 85%)'}} />
    </AbsoluteFill>
  );
};

const AppMark: React.FC<{accentColor: string; secondaryColor: string; size?: number}> = ({accentColor, secondaryColor, size = 84}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.28, background: `linear-gradient(145deg, ${accentColor}, ${secondaryColor})`, display: 'grid', placeItems: 'center', boxShadow: glow(accentColor, size * 0.5)}}>
    <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 100 100">
      <path d="M24 54 L42 72 L78 30" fill="none" stroke="white" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const HookScene: React.FC<CommercialProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const isVertical = height > 1200;
  const logoScale = enter(frame, fps, 2);
  const lineWidth = interpolate(frame, [26, 70], [0, isVertical ? 720 : 620], clamp);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: isVertical ? 90 : 70}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isVertical ? 48 : 30, textAlign: 'center'}}>
        <div style={{transform: `scale(${logoScale})`}}><AppMark accentColor={props.accentColor} secondaryColor={props.secondaryColor} size={isVertical ? 130 : 104} /></div>
        <FadeSlide delay={10} distance={70}>
          <div style={{fontSize: isVertical ? 102 : 84, fontWeight: 850, letterSpacing: -4, lineHeight: 0.98, maxWidth: 900}}>{props.headline}</div>
        </FadeSlide>
        <div style={{width: lineWidth, height: 7, borderRadius: 99, background: `linear-gradient(90deg, ${props.accentColor}, ${props.secondaryColor})`, boxShadow: glow(props.accentColor, 28)}} />
        <FadeSlide delay={30}><div style={{fontSize: isVertical ? 43 : 34, color: '#CDD2E8', fontWeight: 520}}>{props.subheadline}</div></FadeSlide>
      </div>
    </AbsoluteFill>
  );
};

const TaskRow: React.FC<{label: string; done?: boolean; delay: number; accentColor: string}> = ({label, done, delay, accentColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = enter(frame, fps, delay);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '19px 22px', borderRadius: 22, background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.08)', transform: `translateX(${(1 - progress) * 90}px)`, opacity: progress}}>
      <div style={{width: 32, height: 32, borderRadius: 10, border: `2px solid ${done ? accentColor : '#596078'}`, background: done ? accentColor : 'transparent', display: 'grid', placeItems: 'center', boxShadow: done ? glow(accentColor, 16) : undefined}}>
        {done ? <span style={{fontSize: 21, fontWeight: 900}}>✓</span> : null}
      </div>
      <span style={{fontSize: 27, fontWeight: 650, color: done ? '#AEB6CF' : 'white', textDecoration: done ? 'line-through' : undefined}}>{label}</span>
    </div>
  );
};

const ProductScene: React.FC<CommercialProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const isVertical = height > 1200;
  const phone = enter(frame, fps, 0);
  const tilt = interpolate(frame, [0, 120], [-5, 2], clamp);

  return (
    <AbsoluteFill style={{padding: isVertical ? 86 : 62, justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: isVertical ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: isVertical ? 70 : 72}}>
        <FadeSlide delay={2} style={{maxWidth: isVertical ? 850 : 430, textAlign: isVertical ? 'center' : 'left'}}>
          <div style={{fontSize: isVertical ? 82 : 68, fontWeight: 850, lineHeight: 0.98, letterSpacing: -3}}>One calm place for your whole day.</div>
          <div style={{fontSize: isVertical ? 35 : 29, lineHeight: 1.4, color: '#BCC4DD', marginTop: 28}}>Capture tasks, choose priorities, and protect your attention.</div>
        </FadeSlide>
        <div style={{width: isVertical ? 650 : 470, height: isVertical ? 760 : 650, borderRadius: 54, padding: 24, background: 'linear-gradient(160deg, rgba(255,255,255,.16), rgba(255,255,255,.035))', border: '1px solid rgba(255,255,255,.18)', boxShadow: `0 45px 90px rgba(0,0,0,.42), ${glow(props.accentColor, 55)}`, transform: `scale(${0.86 + phone * 0.14}) rotate(${tilt}deg)`, opacity: phone}}>
          <div style={{height: '100%', borderRadius: 38, background: '#101422', padding: isVertical ? 42 : 30, overflow: 'hidden'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 34}}>
              <div><div style={{fontSize: isVertical ? 25 : 19, color: '#8189A5', fontWeight: 700}}>TODAY</div><div style={{fontSize: isVertical ? 47 : 35, fontWeight: 850, marginTop: 5}}>Good morning</div></div>
              <AppMark accentColor={props.accentColor} secondaryColor={props.secondaryColor} size={isVertical ? 74 : 60} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: isVertical ? 20 : 14}}>
              <TaskRow label="Finish project brief" done delay={10} accentColor={props.accentColor} />
              <TaskRow label="Study for 45 minutes" delay={18} accentColor={props.accentColor} />
              <TaskRow label="Plan tomorrow" delay={26} accentColor={props.accentColor} />
            </div>
            <div style={{marginTop: isVertical ? 36 : 26, borderRadius: 28, padding: 25, background: `linear-gradient(135deg, ${props.accentColor}dd, ${props.secondaryColor}bb)`}}>
              <div style={{fontSize: isVertical ? 22 : 17, fontWeight: 750, opacity: 0.8}}>FOCUS SESSION</div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: 9}}><div style={{fontSize: isVertical ? 58 : 43, fontWeight: 900}}>25:00</div><div style={{fontSize: isVertical ? 25 : 20, fontWeight: 760}}>Start →</div></div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BenefitCard: React.FC<{icon: string; title: string; body: string; delay: number; accentColor: string}> = ({icon, title, body, delay, accentColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, delay);
  return (
    <div style={{flex: 1, minWidth: 0, padding: '38px 34px', borderRadius: 34, background: 'linear-gradient(155deg, rgba(255,255,255,.105), rgba(255,255,255,.035))', border: '1px solid rgba(255,255,255,.13)', boxShadow: '0 30px 60px rgba(0,0,0,.25)', transform: `translateY(${(1 - p) * 90}px) scale(${0.92 + p * 0.08})`, opacity: p}}>
      <div style={{width: 74, height: 74, borderRadius: 22, background: `${accentColor}25`, color: accentColor, display: 'grid', placeItems: 'center', fontSize: 38, boxShadow: glow(accentColor, 20)}}>{icon}</div>
      <div style={{fontSize: 35, fontWeight: 850, marginTop: 28}}>{title}</div>
      <div style={{fontSize: 24, lineHeight: 1.45, color: '#B9C0D8', marginTop: 14}}>{body}</div>
    </div>
  );
};

const BenefitsScene: React.FC<CommercialProps> = (props) => {
  const {height} = useVideoConfig();
  const isVertical = height > 1200;
  const benefits = [['⚡', 'Move faster', 'See the next useful action instantly.'], ['◎', 'Stay focused', 'Use simple sessions to block distractions.'], ['✓', 'Feel progress', 'Turn completed tasks into visible momentum.']] as const;
  return (
    <AbsoluteFill style={{padding: isVertical ? '120px 72px' : '70px 62px', justifyContent: 'center'}}>
      <FadeSlide><div style={{textAlign: 'center', fontSize: isVertical ? 82 : 66, fontWeight: 880, letterSpacing: -3}}>Less friction. More momentum.</div></FadeSlide>
      <div style={{display: 'flex', flexDirection: isVertical ? 'column' : 'row', gap: isVertical ? 28 : 22, marginTop: isVertical ? 70 : 52}}>
        {benefits.map(([icon, title, body], i) => <BenefitCard key={title} icon={icon} title={title} body={body} delay={12 + i * 10} accentColor={i === 1 ? props.secondaryColor : props.accentColor} />)}
      </div>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<CommercialProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const isVertical = height > 1200;
  const pulse = 1 + Math.sin(frame / 9) * 0.018;
  const logo = enter(frame, fps, 0);
  const button = enter(frame, fps, 28);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 80}}>
      <div style={{transform: `scale(${logo})`}}><AppMark accentColor={props.accentColor} secondaryColor={props.secondaryColor} size={isVertical ? 150 : 120} /></div>
      <FadeSlide delay={8}><div style={{fontSize: isVertical ? 86 : 72, fontWeight: 900, letterSpacing: -3, marginTop: 42}}>{props.brandName}</div></FadeSlide>
      <FadeSlide delay={16}><div style={{fontSize: isVertical ? 46 : 36, color: '#C4CADF', marginTop: 18}}>A clearer way to get things done.</div></FadeSlide>
      <div style={{marginTop: isVertical ? 70 : 52, padding: isVertical ? '30px 64px' : '25px 52px', borderRadius: 999, background: `linear-gradient(100deg, ${props.accentColor}, ${props.secondaryColor})`, boxShadow: glow(props.accentColor, 42), fontSize: isVertical ? 39 : 32, fontWeight: 850, transform: `scale(${button * pulse})`, opacity: button}}>{props.callToAction} →</div>
      <FadeSlide delay={38}><div style={{marginTop: 30, fontSize: isVertical ? 27 : 22, color: '#858DA8'}}>Available on web, iOS, and Android</div></FadeSlide>
    </AbsoluteFill>
  );
};

const TransitionFlash: React.FC<{color: string}> = ({color}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 4, 14], [0, 0.6, 0], clamp);
  const scale = interpolate(frame, [0, 14], [0.7, 2.2], clamp);
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}><div style={{width: 520, height: 520, borderRadius: '50%', background: color, opacity, filter: 'blur(70px)', transform: `scale(${scale})`}} /></AbsoluteFill>;
};

export const Commercial: React.FC<CommercialProps> = (props) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const masterFade = interpolate(frame, [0, 12, durationInFrames - 18, durationInFrames - 1], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', color: 'white', opacity: masterFade}}>
      <Background accentColor={props.accentColor} secondaryColor={props.secondaryColor} backgroundColor={props.backgroundColor} />
      {props.showMusic ? <Audio src={staticFile('audio/music.wav')} volume={(f) => interpolate(f, [0, 25, 410, 449], [0, 0.18, 0.18, 0], clamp)} /> : null}
      <Sequence from={0} durationInFrames={90} premountFor={30}><HookScene {...props} /></Sequence>
      <Sequence from={90} durationInFrames={130} premountFor={30}><ProductScene {...props} /></Sequence>
      <Sequence from={220} durationInFrames={120} premountFor={30}><BenefitsScene {...props} /></Sequence>
      <Sequence from={340} durationInFrames={110} premountFor={30}><CtaScene {...props} /></Sequence>
      {[86, 216, 336].map((start, index) => (
        <Sequence key={start} from={start} durationInFrames={18}>
          <TransitionFlash color={index === 1 ? props.secondaryColor : props.accentColor} />
          <Audio src={staticFile(index === 1 ? 'audio/pop.wav' : 'audio/whoosh.wav')} volume={0.45} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
