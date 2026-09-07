import Link from 'next/link';
import scss from './button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'soft';
  size?: 'md' | 'sm';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  onClick,
  href,
  target,
}: ButtonProps) => {
  const classes = `${scss.button} ${scss[variant]} ${scss[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} target={target} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

export default Button;
