import { animate } from 'motion';

export function slideUp(node: HTMLElement, options: any = {}) {
    // Hide initially to prevent flash before animation starts
    node.style.opacity = '0';
    
    const animation = animate(
        node,
        { opacity: [0, 1], y: [40, 0] },
        { duration: 0.65, easing: "ease-out", ...options }
    );
    
    return {
        update(newOptions: any) {
            // Re-animate if options change (rare for this use case)
        },
        destroy() {
            animation.stop();
        }
    };
}

export function staggerChildren(node: HTMLElement, options: any = {}) {
    const children = Array.from(node.children) as HTMLElement[];
    children.forEach(child => child.style.opacity = '0');
    
    const animation = animate(
        children,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, delay: (i) => i * 0.1, easing: "ease-out", ...options }
    );

    return {
        destroy() {
            animation.stop();
        }
    };
}
