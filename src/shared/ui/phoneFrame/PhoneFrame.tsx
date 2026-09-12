import scss from './phoneFrame.module.scss';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className={scss.wrap}>
      <div className={`${scss.frame} ${scss.mobile}`}>
        <div className={scss.screen}>{children}</div>
      </div>
    </div>
  );
}
