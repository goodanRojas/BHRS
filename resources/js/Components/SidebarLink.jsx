import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

export default function SidebarLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            onClick={(e) =>{
                e.stopPropagation();
                props.onClick?.(e);
            }}
            className={
                'inline-flex items-center gap-2 border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? ' text-gray-200 focus:border-indigo-700'
                    : 'border-transparent text-white hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700') +
                ' ' + className
            }
        >
            {active && (
                <FontAwesomeIcon icon={faAngleRight} className="text-xs" />
            )}
            {children}
        </Link>
    );
}
