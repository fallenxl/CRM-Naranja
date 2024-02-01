interface Props {
    title: string;
    open: boolean;
    message: string;
    children?: React.ReactNode;
}
export function Dialog({ title, open, message, children }: Props) {
   
    return (
        <div className={`fixed bg-white shadow-xl border w-5/6 max-h-[10rem] top-[6rem] right-10 lg:w-[37.5%] lg:bottom-6 lg:right-9 z-20 rounded-md px-10 py-5 ${open? "animate-fadeIn" : "animate-fadeOut"}`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <span className="text-gray-800 mb-4 text-sm font-medium">
          {message}
        </span>
        {children}
        <div className="bg-gradient-to-r from-gray-500 to-orange-500 w-full h-1 rounded-sm mt-4 animate-pulse duration-200"></div>
      </div>
    );
}