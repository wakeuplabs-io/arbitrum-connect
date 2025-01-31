import { NAV_LINKS } from '@/constants';
import { Link } from '@tanstack/react-router';
import { SquareArrowOutUpRight } from 'lucide-react';

export interface NavbarLink {
  label: string;
  to: string;
  targetBlank?: boolean;
}

export function Navbar() {
  return (
    <nav className='mx-10 flex flex-1'>
      <NavLinks links={NAV_LINKS} />
    </nav>
  );
}

interface NavbarLinksProps {
  links: NavbarLink[];
}

function NavLinks(props: NavbarLinksProps) {
  return (
    <div className='hidden lg:flex justify-start gap-4 items-center'>
      {props.links.map((link) => (
        <Link
          key={link.label}
          to={link.to}
          target={link.targetBlank ? '_blank' : '_self'}
          className='hover:text-gray-500 flex gap-2 items-center'
        >
          {link.label} {link.targetBlank && <SquareArrowOutUpRight className='h-3 w-3' />}
        </Link>
      ))}
    </div>
  );
}
