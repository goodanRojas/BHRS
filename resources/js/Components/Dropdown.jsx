// Dropdown.jsx
import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useFloating, offset, flip, shift } from '@floating-ui/react-dom';

const DropDownContext = createContext();

export const Dropdown = ({ children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef(null);

  const toggleOpen = () => setOpen((s) => !s);

  // floating-ui positioning
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-end', // always below by default
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });

  // close on outside click or ESC
  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('touchstart', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('touchstart', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <DropDownContext.Provider value={{ open, setOpen, toggleOpen, refs, floatingStyles }}>
      <div className="relative inline-block" ref={rootRef}>
        {children}
      </div>
    </DropDownContext.Provider>
  );
};

export const Trigger = ({ children }) => {
  const { toggleOpen, refs } = useContext(DropDownContext);

  return (
    <div
      ref={refs.setReference} // anchor element
      onClick={(e) => {
        e.stopPropagation();
        toggleOpen();
      }}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
};

export const Content = ({ width = '48', contentClasses = 'py-1 bg-white', children }) => {
  const { open, refs, floatingStyles, setOpen } = useContext(DropDownContext);

  const widthClass = width === '48' ? 'w-48' : '';

  return (
    <Transition
      show={open}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div
        ref={refs.setFloating} // floating element
        style={floatingStyles}
        className={`z-50 mt-1 rounded-md shadow-lg ${widthClass}`} // ✅ mt-1 ensures it never overlaps trigger
        onClick={(e) => {
          e.stopPropagation();
          setOpen(false); // auto-close on click inside
        }}
      >
        <div className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}>
          {children}
        </div>
      </div>
    </Transition>
  );
};

export const DropdownLink = ({ className = '', children, active = false, ...props }) => {
  return (
    <Link
      {...props}
      className={
        'block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out focus:outline-none ' +
        (active
          ? 'bg-gray-200 text-gray-900 '
          : 'text-gray-700 hover:bg-slate-100 focus:bg-slate-100 ') +
        className
      }
    >
      {children}
    </Link>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
