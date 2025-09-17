export default function ApplicationLogo({ variant = 'white', relative = false, ...props }) {
    const logoSrc =
        variant === 'black'
            ? '/storage/system/logo/logo_black.svg'
            : '/storage/system/logo/logo_white.svg';

    return (
        <div className={relative ? 'relative' : 'absolute top-0 left-0'}>
            <img
                src={logoSrc}
                alt="BH Reservation Logo"
                className="h-20 w-auto overflow-hidden"
                {...props}
            />
        </div>
    );
}
