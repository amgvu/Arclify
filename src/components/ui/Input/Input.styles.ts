export const inputContainerStyles = (className?: string) => {
    return `flex flex-col space-y-1 ${className || ''}`;
  };
  
  export const inputLabelStyles = 'text-sm font-medium text-zinc-100';
  
  export const inputStyles =
    'bg-zinc-800 py-2.5 px-3 text-sm rounded-lg text-white shadow-white/10 focus:outline-hidden focus:ring-2 focus:ring-zinc-100 transition duration-150 ease-in-out w-full';