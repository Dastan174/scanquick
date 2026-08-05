import scss from './button.module.scss';
interface ChildrenProps {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
}

const Button = ({ children, variant = 'primary' }: ChildrenProps) => (
  <button className={`${scss.button} ${scss[variant]}`}>{children}</button>
);

export default Button;
