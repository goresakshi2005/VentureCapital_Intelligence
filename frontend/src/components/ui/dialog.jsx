import React, { createContext, useContext } from 'react';

const DialogContext = createContext({ open: false, onOpenChange: () => {} });

export function Dialog({ children, open, onOpenChange }) {
  return (
    <DialogContext.Provider value={{ open: !!open, onOpenChange: onOpenChange || (() => {}) }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild = false }) {
  const ctx = useContext(DialogContext);
  const child = React.Children.only(children);
  const props = {
    onClick: (e) => ctx.onOpenChange(true),
  };
  if (asChild) {
    return React.cloneElement(child, props);
  }
  return <button onClick={() => ctx.onOpenChange(true)}>{children}</button>;
}

export function DialogContent({ children }) {
  const ctx = useContext(DialogContext);
  if (!ctx.open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-4 max-w-lg w-full">{children}</div>
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export default Dialog;
