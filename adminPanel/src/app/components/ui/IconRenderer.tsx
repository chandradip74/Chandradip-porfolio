import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
import * as LuIcons from 'lucide-react';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';
import * as HiIcons from 'react-icons/hi';
import * as TbIcons from 'react-icons/tb';
import * as PiIcons from 'react-icons/pi';
import * as MdIcons from 'react-icons/md';
import * as DiIcons from 'react-icons/di';


interface IconRendererProps {
  icon: string | undefined;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ icon, className, size = 24 }) => {
  if (!icon) return null;

  // 1. Handle Image URL
  if (icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('data:image')) {
    return <img src={icon} alt="icon" className={className} style={{ width: size, height: size, objectFit: 'contain' }} />;
  }

  // 2. Handle HTML/SVG
  if (icon.startsWith('<')) {
    // If it's a React-style component string like <IoLogoReact /> or <IoLogoReact>
    const match = icon.match(/<(\w+)\b[^>]*\/?>/);
    if (match) {
      const iconName = match[1];
      return renderReactIcon(iconName, className, size);
    }
    
    // Otherwise treat as raw HTML (e.g. FontAwesome <i> or <svg>)
    return <div className={className} dangerouslySetInnerHTML={{ __html: icon }} />;
  }

  // 3. Handle Icon Name (e.g. "IoLogoReact")
  return renderReactIcon(icon, className, size);
};

const renderReactIcon = (iconName: string, className?: string, size?: number) => {
  // Try to find the icon in different libraries
  const AllIcons: any = { 
    ...FaIcons, ...SiIcons, ...IoIcons, ...Io5Icons, ...LuIcons, 
    ...RiIcons, ...BiIcons, ...HiIcons, ...TbIcons, ...PiIcons, 
    ...MdIcons, ...DiIcons 
  };
  const IconComponent = AllIcons[iconName];

  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }

  // Fallback: just show the first letter or the name if not found
  return <span className="text-[10px] font-mono break-all px-1 text-center leading-tight">{iconName}</span>;
};
