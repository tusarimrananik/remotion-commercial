import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import timingData from '../public/subtitles/bangladesh-hackers-voiceover.words.json';

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
  brandName: 'Bangladesh Hackers',
  headline: 'অ্যাকাউন্টে প্রবেশ করতে পারছেন না?',
  subheadline: 'নিরাপদ পুনরুদ্ধার সহায়তা',
  callToAction: 'এখনই ইনবক্স করুন',
  accentColor: '#00C8FF',
  secondaryColor: '#45EF55',
  backgroundColor: '#020711',
  showMusic: true,
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fontFamily = 'Noto Sans Bengali, Hind Siliguri, Inter, Arial, sans-serif';

type IconName =
  | 'lock'
  | 'unlock'
  | 'target'
  | 'recovery'
  | 'page'
  | 'shield'
  | 'speed'
  | 'social'
  | 'expert'
  | 'premium'
  | 'inbox'
  | 'privacy';

const timedSpring = (frame: number, fps: number, at: number, stiffness = 150) =>
  spring({frame: frame - at * fps, fps, config: {damping: 14, stiffness, mass: 0.72}});

const sceneOpacity = (time: number, start: number, end: number) =>
  interpolate(time, [start, start + 0.22, end - 0.2, end], [0, 1, 1, 0], clamp);

const Glass: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: 'linear-gradient(145deg, rgba(5,27,51,.92), rgba(2,9,20,.82))',
      border: '1px solid rgba(0,200,255,.28)',
      boxShadow: '0 24px 70px rgba(0,0,0,.42), inset 0 1px rgba(255,255,255,.07)',
      backdropFilter: 'blur(18px)',
      ...style,
    }}
  >
    {children}
  </div>
);

const Background: React.FC<{accent: string; secondary: string; background: string}> = ({accent, secondary, background}) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.28) % 76;
  return (
    <AbsoluteFill style={{background, overflow: 'hidden'}}>
      <Img
        src={staticFile('brand/brand-reels-cover.png')}
        style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.26, transform: `scale(${1.04 + frame / 45000})`}}
      />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(1,5,14,.48), rgba(1,5,14,.9) 72%, #020711)'}} />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${accent}14 1px, transparent 1px), linear-gradient(90deg, ${accent}14 1px, transparent 1px)`,
          backgroundSize: '76px 76px',
          transform: `translateY(${drift}px)`,
          maskImage: 'linear-gradient(to bottom, black, transparent 88%)',
        }}
      />
      <div style={{position: 'absolute', width: 620, height: 620, borderRadius: '50%', background: accent, filter: 'blur(160px)', opacity: 0.12, left: -300, top: 120}} />
      <div style={{position: 'absolute', width: 560, height: 560, borderRadius: '50%', background: secondary, filter: 'blur(170px)', opacity: 0.08, right: -280, bottom: 20}} />
    </AbsoluteFill>
  );
};

const Scanline: React.FC = () => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 50,
        left: 0,
        right: 0,
        height: 4,
        top: (frame * 10) % (height + 100) - 50,
        background: 'linear-gradient(90deg, transparent, #00C8FF66, transparent)',
        boxShadow: '0 0 26px #00C8FF',
        opacity: 0.4,
        pointerEvents: 'none',
      }}
    />
  );
};

const PlatformLogo: React.FC<{type: 'facebook' | 'gmail' | 'instagram'; size: number}> = ({type, size}) => {
  if (type === 'facebook') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#1877F2" />
        <path d="M57 28h13V10c-3-1-10-2-18-2-17 0-28 10-28 29v16H6v20h18v49h22V73h18l3-20H46V39c0-7 2-11 11-11Z" fill="white" transform="scale(.72) translate(20 9)" />
      </svg>
    );
  }
  if (type === 'gmail') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="6" y="17" width="88" height="66" rx="12" fill="white" />
        <path d="M9 27 50 57 91 27" fill="none" stroke="#EA4335" strokeWidth="12" strokeLinejoin="round" />
        <path d="M9 28v47" stroke="#4285F4" strokeWidth="10" />
        <path d="M91 28v47" stroke="#34A853" strokeWidth="10" />
        <path d="M9 75h18" stroke="#FBBC04" strokeWidth="10" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs><linearGradient id="insta" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#FFD600"/><stop offset=".45" stopColor="#FF0169"/><stop offset="1" stopColor="#7638FA"/></linearGradient></defs>
      <rect x="3" y="3" width="94" height="94" rx="25" fill="url(#insta)" />
      <rect x="23" y="23" width="54" height="54" rx="17" fill="none" stroke="white" strokeWidth="7" />
      <circle cx="50" cy="50" r="13" fill="none" stroke="white" strokeWidth="7" />
      <circle cx="69" cy="31" r="4.5" fill="white" />
    </svg>
  );
};

const LineIcon: React.FC<{name: IconName; size?: number; color?: string}> = ({name, size = 62, color = '#00C8FF'}) => {
  const common = {fill: 'none', stroke: color, strokeWidth: 6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const paths: Record<IconName, React.ReactNode> = {
    lock: <><rect x="24" y="43" width="52" height="42" rx="9" {...common}/><path d="M34 43V31c0-22 32-22 32 0v12M50 60v10" {...common}/></>,
    unlock: <><rect x="24" y="43" width="52" height="42" rx="9" {...common}/><path d="M66 31c0-21-32-21-32 1M50 60v10" {...common}/></>,
    target: <><circle cx="50" cy="50" r="34" {...common}/><circle cx="50" cy="50" r="18" {...common}/><circle cx="50" cy="50" r="4" fill={color}/><path d="m59 41 25-25M70 16h14v14" {...common}/></>,
    recovery: <><path d="M24 34A32 32 0 1 1 19 60M24 34V14M24 34H44" {...common}/><path d="m37 53 10 10 20-22" {...common}/></>,
    page: <><path d="M27 12h34l17 18v58H27zM61 12v20h17M39 49h27M39 62h27M39 75h18" {...common}/></>,
    shield: <><path d="M50 9 82 22v25c0 23-12 37-32 45-20-8-32-22-32-45V22Z" {...common}/><path d="m34 51 11 11 22-25" {...common}/></>,
    speed: <><path d="M17 68a36 36 0 1 1 66 0M50 50l23-20M28 70h44" {...common}/><circle cx="50" cy="50" r="5" fill={color}/></>,
    social: <><circle cx="50" cy="22" r="11" {...common}/><circle cx="24" cy="70" r="11" {...common}/><circle cx="76" cy="70" r="11" {...common}/><path d="m43 31-12 28M57 31l12 28M35 70h30" {...common}/></>,
    expert: <><circle cx="50" cy="29" r="16" {...common}/><path d="M22 86c2-23 13-34 28-34s26 11 28 34M72 24l8 8 14-16" {...common}/></>,
    premium: <><path d="m50 8 11 25 27 3-20 19 6 27-24-14-24 14 6-27-20-19 27-3Z" {...common}/></>,
    inbox: <><path d="M12 27h76v56H12zM13 31l37 29 37-29" {...common}/></>,
    privacy: <><circle cx="50" cy="28" r="15" {...common}/><path d="M19 84c2-25 13-38 31-38s29 13 31 38M72 51l15 7v12c0 11-6 18-15 22-9-4-15-11-15-22V58Z" {...common}/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 100 100">{paths[name]}</svg>;
};

const PlatformCard: React.FC<{
  type: 'facebook' | 'gmail' | 'instagram';
  label: string;
  at: number;
  time: number;
  frame: number;
  fps: number;
  vertical: boolean;
}> = ({type, label, at, time, frame, fps, vertical}) => {
  const p = timedSpring(frame, fps, at);
  const active = time >= at && time < at + 0.55;
  const locked = time >= 3.48;
  return (
    <Glass
      style={{
        width: vertical ? 270 : 250,
        height: vertical ? 300 : 260,
        borderRadius: 34,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${(1 - p) * 90}px) scale(${0.65 + p * 0.35 + (active ? 0.06 : 0)})`,
        opacity: p,
        borderColor: active ? '#FFFFFFAA' : locked ? '#FF496E88' : '#00C8FF44',
        boxShadow: active ? '0 0 55px rgba(0,200,255,.52)' : '0 24px 65px rgba(0,0,0,.42)',
      }}
    >
      <PlatformLogo type={type} size={vertical ? 126 : 108} />
      <div style={{fontSize: vertical ? 29 : 25, fontWeight: 850, marginTop: 22}}>{label}</div>
      {locked ? (
        <div style={{position: 'absolute', right: 17, top: 17, width: 47, height: 47, borderRadius: 14, background: '#FF3D60', display: 'grid', placeItems: 'center', transform: `scale(${timedSpring(frame, fps, 3.48)})`}}>
          <LineIcon name="lock" size={31} color="white" />
        </div>
      ) : null}
    </Glass>
  );
};

const SceneTitle: React.FC<{eyebrow: string; children: React.ReactNode; vertical: boolean}> = ({eyebrow, children, vertical}) => (
  <div style={{textAlign: 'center'}}>
    <div style={{fontSize: vertical ? 22 : 18, color: '#62DFFF', letterSpacing: 4, textTransform: 'uppercase', fontWeight: 900}}>{eyebrow}</div>
    <div style={{fontSize: vertical ? 67 : 54, lineHeight: 1.12, fontWeight: 950, marginTop: 15}}>{children}</div>
  </div>
);

const PlatformScene: React.FC<{time: number; frame: number; fps: number; vertical: boolean}> = ({time, frame, fps, vertical}) => {
  const hacked = time >= 2.639;
  const shake = hacked && time < 3.3 ? Math.sin(frame * 2.6) * 7 : 0;
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(time, 0, 4.12), padding: vertical ? '190px 58px 250px' : '95px 50px 165px', justifyContent: 'center'}}>
      <SceneTitle eyebrow="ACCOUNT ALERT" vertical={vertical}>
        আপনার অ্যাকাউন্ট কি <span style={{color: hacked ? '#FF5572' : '#00C8FF'}}>হ্যাক হয়েছে?</span>
      </SceneTitle>
      <div style={{display: 'flex', justifyContent: 'center', gap: vertical ? 24 : 20, marginTop: vertical ? 78 : 50, transform: `translateX(${shake}px)`}}>
        <PlatformCard type="facebook" label="Facebook" at={0.459} {...{time, frame, fps, vertical}} />
        <PlatformCard type="gmail" label="Gmail" at={1.0} {...{time, frame, fps, vertical}} />
        <PlatformCard type="instagram" label="Instagram" at={1.579} {...{time, frame, fps, vertical}} />
      </div>
      {hacked ? <div style={{textAlign: 'center', color: '#FF5D76', fontSize: vertical ? 27 : 22, fontWeight: 900, letterSpacing: 3, marginTop: 30, opacity: timedSpring(frame, fps, 2.639)}}>SECURITY BREACH DETECTED</div> : null}
    </AbsoluteFill>
  );
};

const AccessScene: React.FC<{time: number; frame: number; fps: number; vertical: boolean; accent: string}> = ({time, frame, fps, vertical, accent}) => {
  const items: Array<{at: number; icon: IconName; label: string; color: string}> = [
    {at: 4.079, icon: 'lock', label: 'SUSPENDED', color: '#FF5572'},
    {at: 5.139, icon: 'unlock', label: 'LOGIN সহায়তা', color: accent},
    {at: 7.099, icon: 'privacy', label: 'পরিচয় গোপন', color: '#B67CFF'},
  ];
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(time, 4.0, 8.84), padding: vertical ? '190px 70px 260px' : '95px 65px 170px', justifyContent: 'center'}}>
      <SceneTitle eyebrow="ACCESS SUPPORT" vertical={vertical}>লগইন সমস্যার <span style={{color: accent}}>দ্রুত সমাধান</span></SceneTitle>
      <div style={{display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: 22, marginTop: vertical ? 70 : 48, alignItems: 'stretch'}}>
        {items.map((item) => {
          const p = timedSpring(frame, fps, item.at);
          const active = time >= item.at && time < item.at + 0.65;
          return (
            <Glass key={item.label} style={{flex: 1, minHeight: vertical ? 160 : 210, borderRadius: 28, padding: vertical ? '25px 35px' : '28px 20px', display: 'flex', flexDirection: vertical ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: 20, opacity: p, transform: `translateX(${(1 - p) * -75}px) scale(${active ? 1.04 : 1})`, borderColor: `${item.color}88`, boxShadow: active ? `0 0 50px ${item.color}55` : undefined}}>
              <LineIcon name={item.icon} size={vertical ? 82 : 72} color={item.color} />
              <div style={{fontSize: vertical ? 31 : 24, fontWeight: 900, textAlign: 'center', color: item.color}}>{item.label}</div>
            </Glass>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TargetScene: React.FC<{time: number; frame: number; fps: number; vertical: boolean; accent: string; secondary: string}> = ({time, frame, fps, vertical, accent, secondary}) => {
  const targetP = timedSpring(frame, fps, 8.8);
  const accessP = timedSpring(frame, fps, 9.779);
  const calmP = timedSpring(frame, fps, 10.76);
  const expertP = timedSpring(frame, fps, 11.979);
  const spin = frame * 1.2;
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(time, 8.76, 13.15), padding: vertical ? '170px 70px 255px' : '75px 70px 165px', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'relative', width: vertical ? 390 : 300, height: vertical ? 390 : 300, display: 'grid', placeItems: 'center', transform: `scale(${0.65 + targetP * 0.35})`, opacity: targetP}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `2px dashed ${accent}88`, transform: `rotate(${spin}deg)`, boxShadow: `0 0 45px ${accent}33`}} />
        <div style={{position: 'absolute', inset: '15%', borderRadius: '50%', border: `2px solid ${accent}55`, transform: `rotate(${-spin * 0.7}deg)`}} />
        <LineIcon name="target" size={vertical ? 230 : 180} color={accent} />
        <div style={{position: 'absolute', width: 26, height: 26, borderRadius: '50%', background: secondary, boxShadow: `0 0 28px ${secondary}`, transform: `scale(${accessP})`}} />
      </div>
      <div style={{fontSize: vertical ? 64 : 51, fontWeight: 950, marginTop: 30, textAlign: 'center', opacity: calmP}}>আর চিন্তা নেই</div>
      <Glass style={{marginTop: 28, padding: vertical ? '24px 38px' : '20px 32px', borderRadius: 24, display: 'flex', alignItems: 'center', gap: 22, opacity: expertP, transform: `translateY(${(1 - expertP) * 60}px)`, borderColor: `${secondary}66`}}>
        <LineIcon name="expert" size={vertical ? 75 : 62} color={secondary} />
        <div><div style={{fontSize: vertical ? 31 : 25, fontWeight: 900}}>EXPERT TEAM</div><div style={{fontSize: vertical ? 22 : 18, color: '#AFC5D8', marginTop: 4}}>পেশাদার সহায়তা প্রস্তুত</div></div>
      </Glass>
    </AbsoluteFill>
  );
};

const ServiceCard: React.FC<{icon: IconName; title: string; at: number; color: string; time: number; frame: number; fps: number; vertical: boolean}> = ({icon, title, at, color, time, frame, fps, vertical}) => {
  const p = timedSpring(frame, fps, at);
  const active = time >= at && time < at + 0.65;
  return (
    <Glass style={{borderRadius: 25, padding: vertical ? '23px 27px' : '22px 18px', display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateY(${(1 - p) * 65}px) scale(${active ? 1.035 : 1})`, borderColor: active ? color : `${color}55`, boxShadow: active ? `0 0 42px ${color}44` : undefined}}>
      <div style={{width: vertical ? 78 : 67, height: vertical ? 78 : 67, flex: '0 0 auto', borderRadius: 20, background: `${color}17`, display: 'grid', placeItems: 'center'}}><LineIcon name={icon} size={vertical ? 62 : 53} color={color} /></div>
      <div style={{fontSize: vertical ? 29 : 23, fontWeight: 880, lineHeight: 1.2}}>{title}</div>
    </Glass>
  );
};

const ServicesScene: React.FC<{time: number; frame: number; fps: number; vertical: boolean; accent: string; secondary: string}> = ({time, frame, fps, vertical, accent, secondary}) => {
  const services: Array<{icon: IconName; title: string; at: number; color: string}> = [
    {icon: 'recovery', title: 'হ্যাকড ID উদ্ধার', at: 13.119, color: accent},
    {icon: 'target', title: 'টার্গেটেড সহায়তা', at: 14.219, color: '#B47CFF'},
    {icon: 'unlock', title: 'অ্যাকাউন্ট আনলক', at: 15.699, color: secondary},
    {icon: 'page', title: 'পেজ রিকভারি', at: 17.359, color: '#FFB84A'},
  ];
  const premiumP = timedSpring(frame, fps, 19.26);
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(time, 13.06, 20.42), padding: vertical ? '145px 62px 245px' : '60px 55px 160px', justifyContent: 'center'}}>
      <SceneTitle eyebrow="PREMIUM SERVICES" vertical={vertical}>এক জায়গায় <span style={{color: accent}}>সম্পূর্ণ সহায়তা</span></SceneTitle>
      <div style={{display: 'grid', gridTemplateColumns: vertical ? '1fr' : '1fr 1fr', gap: vertical ? 18 : 17, marginTop: vertical ? 57 : 38}}>
        {services.map((service) => <ServiceCard key={service.title} {...service} {...{time, frame, fps, vertical}} />)}
      </div>
      <Glass style={{marginTop: 22, borderRadius: 25, padding: vertical ? '22px 30px' : '18px 25px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: premiumP, transform: `scale(${0.8 + premiumP * 0.2})`, borderColor: '#FFD45F77'}}>
        <LineIcon name="premium" size={vertical ? 65 : 52} color="#FFD45F" />
        <div style={{fontSize: vertical ? 31 : 25, fontWeight: 930}}><span style={{color: '#FFD45F'}}>২০+</span> প্রিমিয়াম সার্ভিস</div>
      </Glass>
    </AbsoluteFill>
  );
};

const TrustScene: React.FC<{time: number; frame: number; fps: number; vertical: boolean; accent: string; secondary: string}> = ({time, frame, fps, vertical, accent, secondary}) => {
  const metrics: Array<{at: number; icon: IconName; top: string; bottom: string; color: string}> = [
    {at: 20.979, icon: 'expert', top: 'PRO', bottom: 'পেশাদার উপায়', color: accent},
    {at: 21.92, icon: 'shield', top: '১০০%', bottom: 'নিরাপদ', color: secondary},
    {at: 23.379, icon: 'speed', top: 'FAST', bottom: 'দ্রুততম সময়', color: '#FFB84A'},
    {at: 25.219, icon: 'social', top: 'SOCIAL', bottom: 'সব প্ল্যাটফর্ম', color: '#B47CFF'},
  ];
  const zeroP = timedSpring(frame, fps, 27.539);
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(time, 20.34, 29.5), padding: vertical ? '135px 62px 245px' : '55px 55px 160px', justifyContent: 'center'}}>
      <SceneTitle eyebrow="TRUST & SPEED" vertical={vertical}>নিরাপদ। দ্রুত। <span style={{color: secondary}}>পেশাদার।</span></SceneTitle>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: vertical ? 20 : 16, marginTop: vertical ? 60 : 40}}>
        {metrics.map((metric) => {
          const p = timedSpring(frame, fps, metric.at);
          const active = time >= metric.at && time < metric.at + 0.7;
          return (
            <Glass key={metric.top} style={{borderRadius: 28, padding: vertical ? '31px 25px' : '25px 18px', textAlign: 'center', opacity: p, transform: `scale(${0.72 + p * 0.28 + (active ? 0.035 : 0)})`, borderColor: `${metric.color}66`}}>
              <LineIcon name={metric.icon} size={vertical ? 82 : 66} color={metric.color} />
              <div style={{fontSize: vertical ? 38 : 30, color: metric.color, fontWeight: 950, marginTop: 8}}>{metric.top}</div>
              <div style={{fontSize: vertical ? 23 : 19, color: '#B7CADB', marginTop: 5}}>{metric.bottom}</div>
            </Glass>
          );
        })}
      </div>
      <div style={{marginTop: vertical ? 36 : 24, textAlign: 'center', fontSize: vertical ? 36 : 29, fontWeight: 950, color: secondary, opacity: zeroP, transform: `scale(${0.7 + zeroP * 0.3})`, textShadow: `0 0 30px ${secondary}`}}>ZERO RISK • সর্বোচ্চ নিরাপত্তা</div>
    </AbsoluteFill>
  );
};

const SafeAccountScene: React.FC<{time: number; frame: number; fps: number; vertical: boolean; accent: string; secondary: string}> = ({time, frame, fps, vertical, accent, secondary}) => {
  const p = timedSpring(frame, fps, 29.5);
  const secureP = timedSpring(frame, fps, 30.779);
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(time, 29.42, 32.72), alignItems: 'center', justifyContent: 'center', padding: vertical ? '150px 70px 245px' : '65px 70px 160px', textAlign: 'center'}}>
      <div style={{position: 'relative', width: vertical ? 340 : 270, height: vertical ? 340 : 270, display: 'grid', placeItems: 'center', opacity: p, transform: `scale(${0.68 + p * 0.32})`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `2px dashed ${accent}66`, transform: `rotate(${frame * 0.8}deg)`}} />
        <LineIcon name="shield" size={vertical ? 250 : 200} color={secureP > 0.5 ? secondary : accent} />
      </div>
      <div style={{fontSize: vertical ? 65 : 52, lineHeight: 1.14, fontWeight: 950, marginTop: 28}}>আপনার মূল্যবান অ্যাকাউন্ট<br/><span style={{color: secondary}}>সুরক্ষিতভাবে ফিরে পান</span></div>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<{time: number; frame: number; fps: number; vertical: boolean; props: CommercialProps}> = ({time, frame, fps, vertical, props}) => {
  const targetP = timedSpring(frame, fps, 33.119);
  const nowP = timedSpring(frame, fps, 35.939);
  const inboxP = timedSpring(frame, fps, 36.819);
  const pulse = 1 + Math.sin(frame / 7) * 0.025;
  return (
    <AbsoluteFill style={{opacity: sceneOpacity(time, 32.62, 37.66), alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: vertical ? '150px 70px 245px' : '60px 70px 160px'}}>
      <div style={{width: vertical ? 240 : 185, height: vertical ? 240 : 185, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${props.accentColor}99`, boxShadow: `0 0 55px ${props.accentColor}55`, transform: `scale(${0.7 + targetP * 0.3})`, opacity: targetP}}>
        <Img src={staticFile('brand/brand-profile.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{fontSize: vertical ? 66 : 53, fontWeight: 950, marginTop: 30}}>{props.brandName}</div>
      <div style={{fontSize: vertical ? 30 : 24, color: '#AFC5D8', marginTop: 14}}>{props.subheadline}</div>
      <div style={{fontSize: vertical ? 27 : 22, color: props.secondaryColor, fontWeight: 850, marginTop: 22, opacity: nowP}}>আর দেরি নয়—এখনই যোগাযোগ করুন</div>
      <div style={{marginTop: vertical ? 43 : 34, padding: vertical ? '25px 52px' : '21px 42px', minWidth: vertical ? 520 : 430, borderRadius: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, background: `linear-gradient(100deg, ${props.accentColor}, #00A4FF 55%, ${props.secondaryColor})`, color: '#00121A', boxShadow: `0 0 55px ${props.accentColor}77`, transform: `scale(${inboxP * pulse})`}}>
        <LineIcon name="inbox" size={vertical ? 54 : 44} color="#00121A" />
        <div style={{fontSize: vertical ? 37 : 31, fontWeight: 950}}>{props.callToAction}</div>
      </div>
      <div style={{fontSize: vertical ? 20 : 17, color: '#70879C', marginTop: 23}}>নিরাপদ ও বৈধ পুনরুদ্ধার সহায়তা</div>
    </AbsoluteFill>
  );
};

const WordCaptions: React.FC<{time: number; vertical: boolean; accent: string}> = ({time, vertical, accent}) => {
  const segment = timingData.segments.find((item) => time >= item.start_time - 0.08 && time <= item.end_time + 0.12);
  if (!segment) return null;
  return (
    <div style={{position: 'absolute', zIndex: 40, left: vertical ? 55 : 95, right: vertical ? 55 : 95, bottom: vertical ? 76 : 38, display: 'flex', justifyContent: 'center'}}>
      <div style={{maxWidth: 950, borderRadius: 22, padding: vertical ? '18px 25px' : '13px 21px', background: 'rgba(0,5,13,.82)', border: '1px solid rgba(255,255,255,.13)', boxShadow: '0 12px 40px rgba(0,0,0,.38)', textAlign: 'center', fontSize: vertical ? 31 : 25, lineHeight: 1.42, fontWeight: 780}}>
        {segment.words.map((word, index) => {
          const isSpace = word.text.trim().length === 0;
          if (isSpace) return <React.Fragment key={`${word.start_time}-${index}`}>{word.text}</React.Fragment>;
          const active = time >= word.start_time && time < word.end_time;
          const spoken = time >= word.end_time;
          return (
            <span key={`${word.start_time}-${index}`} style={{color: active ? '#06131B' : spoken ? 'white' : '#8A9CAE', background: active ? accent : 'transparent', borderRadius: 7, padding: active ? '1px 5px 2px' : '1px 0 2px', boxShadow: active ? `0 0 22px ${accent}99` : undefined}}>
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Commercial: React.FC<CommercialProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps, height, durationInFrames} = useVideoConfig();
  const time = frame / fps;
  const vertical = height > 1200;
  const masterFade = interpolate(frame, [0, 8, durationInFrames - 10, durationInFrames - 1], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{fontFamily, color: 'white', opacity: masterFade, overflow: 'hidden'}}>
      <Background accent={props.accentColor} secondary={props.secondaryColor} background={props.backgroundColor} />
      {props.showMusic ? <Audio src={staticFile('audio/cyberpunk-city.mp3')} volume={(f) => interpolate(f, [0, 25, durationInFrames - 35, durationInFrames - 1], [0, 0.065, 0.065, 0], clamp)} /> : null}
      <Audio src={staticFile('audio/bangladesh-hackers-voiceover.mp3')} volume={1} />
      <PlatformScene {...{time, frame, fps, vertical}} />
      <AccessScene {...{time, frame, fps, vertical}} accent={props.accentColor} />
      <TargetScene {...{time, frame, fps, vertical}} accent={props.accentColor} secondary={props.secondaryColor} />
      <ServicesScene {...{time, frame, fps, vertical}} accent={props.accentColor} secondary={props.secondaryColor} />
      <TrustScene {...{time, frame, fps, vertical}} accent={props.accentColor} secondary={props.secondaryColor} />
      <SafeAccountScene {...{time, frame, fps, vertical}} accent={props.accentColor} secondary={props.secondaryColor} />
      <CtaScene {...{time, frame, fps, vertical}} props={props} />
      <WordCaptions time={time} vertical={vertical} accent={props.accentColor} />
      <Scanline />
    </AbsoluteFill>
  );
};
