/**
 * Brand ticker that scrolls sideways on its own, in a seamless loop.
 * Speed: change the `40s` in .marquee-track (globals.css). Smaller = faster.
 */
export default function Marquee({ items }: { items: string[] }) {
    // Repeat the phrases so one group is always wider than the screen.
    const group = Array.from({ length: 3 }, () => items).flat();
    return (
        <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
                {[0, 1].map((g) => (
                    <div className="marquee-group" key={g}>
                        {group.map((t, i) => (
                            <span key={i}>
                                {t}
                                <i>✦</i>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}