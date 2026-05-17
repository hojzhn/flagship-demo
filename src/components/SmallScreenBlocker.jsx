import Icon from "./Icon";

// Full-screen overlay shown under 960px viewport width. Pure CSS via
// Tailwind's arbitrary-value breakpoint (`max-[959px]:flex`), so no
// JS resize listener is needed.

const SmallScreenBlocker = () => (
  <div className="fixed inset-0 z-[100] hidden items-center justify-center bg-canvas p-8 text-center max-[1119px]:flex">
    <div className="max-w-md space-y-4">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
        <Icon name="desktop" className="h-7 w-7" />
      </div>
      <h2 className="text-[20px] font-semibold tracking-tight text-ink">
        This demo needs a desktop
      </h2>
      <p className="text-[14px] leading-[1.55] text-ink-muted">
        This demo is built for wider screens. Open it on a desktop or resize
        this window to at least 1200px wide.
      </p>
    </div>
  </div>
);

export default SmallScreenBlocker;
