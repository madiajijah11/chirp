import type { PropsWithChildren } from "react";

export const Layout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-b from-blue-400 to-blue-600">
      <div className="w-full max-w-md overflow-y-scroll overscroll-y-none">
        {props.children}
      </div>
    </main>
  );
};
