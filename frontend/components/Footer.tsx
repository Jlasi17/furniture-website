const Footer = () => {
    return (
        <footer className="bg-rosewood-primary text-rosewood-muted py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h3 className="text-rosewood-surface font-serif text-xl mb-4">JP HOMES</h3>
                    <p className="text-sm">Premium furniture for modern living. Crafted with care, designed for comfort.</p>
                </div>
                <div>
                    <h4 className="text-rosewood-surface font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/shop" className="hover:text-rosewood-accent">Shop</a></li>
                        <li><a href="/about" className="hover:text-rosewood-accent">About Us</a></li>
                        <li><a href="/contact" className="hover:text-rosewood-accent">Contact</a></li>
                        <li><a href="/faq" className="hover:text-rosewood-accent">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-rosewood-surface font-semibold mb-4">Contact</h4>
                    <p className="text-sm mb-2">123 Furniture Lane, Wood City</p>
                    <p className="text-sm mb-2">+1 (555) 123-4567</p>
                    <p className="text-sm">hello@rosewood.com</p>
                </div>
            </div>
            <div className="text-center mt-8 pt-8 border-t border-rosewood-secondary text-xs">
                &copy; {new Date().getFullYear()} JP Homes Furniture. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
