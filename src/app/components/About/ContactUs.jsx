import Image from 'next/image';

export default function ContactUs() {
    return (
        <div className="container mx-auto px-4 py-12">
            <section className="relative bg-gray-900 text-white shadow-lg overflow-hidden">
                <div className="h-96 relative group">
                    <Image
                        src="/images/SCI-banner.jpg" // Ensure this path is correct
                        alt="Supreme Court of India"
                        layout="fill"
                        objectFit="cover"
                        className="opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900 opacity-50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6 transition ease-in-out duration-500 group-hover:bg-opacity-75 group-hover:backdrop-blur-lg"> {/* Added backdrop-blur-lg for blur effect */}
                            <h2 className="text-4xl font-bold mb-4 text-gold">Contact Us</h2>
                            <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="mb-4">If you have any questions or need further information, feel free to reach out to us:</p>
                                <ul className="list-none">
                                    <li>Email: <a href="mailto:support@pramanai.com" className="text-blue-300 hover:underline">support@pramanai.com</a></li>
                                    <li>Phone: <a href="tel:+1234567890" className="text-blue-300 hover:underline">+1 (234) 567-890</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
