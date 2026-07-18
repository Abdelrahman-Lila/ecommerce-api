import { classNames } from "../../lib/classNames.js";

export default function PageShell({ className, children }) {
  return (
    <main
      className={classNames(
        "mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </main>
  );
}
