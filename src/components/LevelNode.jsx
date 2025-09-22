export default function LevelNode({ filled }) {
  return (
    <div
      className={`w-4 h-4 border-2 border-black dark:border-white pixelated
        ${filled ? "bg-[var(--color-brand)]" : "bg-[var(--brand)]"}`}
    />
  );
}
