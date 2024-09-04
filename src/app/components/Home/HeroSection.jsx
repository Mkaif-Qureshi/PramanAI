"use client";

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HeroSection() {
    const images = [
        '/images/hero-1.png',
        '/images/hero-4.webp',
        '/images/hero-3.webp',
        '/images/hero-2.webp',
    ];

    return (
        <section className="flex flex-col md:flex-row items-center justify-between py-10 px-8 bg-gray-50 mx-auto ">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <div className="text-3xl font-bold mb-4">
                    PramanAI: Automated Legal Data Extraction System
                </div>
                <p className="text-lg mb-6 text-gray-700">
                    Efficiently process and analyze legal documents with our AI-powered solution, designed to comply with Supreme Court Rules, 2013.
                </p>
                <div className="relative inline-block mt-4">
                    <a
                        href="#learn-more"
                        className="relative inline-block text-gray-800 px-4 py-2 border border-black overflow-hidden group"
                    >
                        <span className="relative z-10 text-black">Learn More</span>
                        {/* Border Animation */}
                        <span className="absolute inset-0 border-t-2 border-black transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>
                        <span className="absolute inset-0 border-r-2 border-black transform -translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                        <span className="absolute inset-0 border-b-2 border-black transform translate-x-full transition-transform duration-300 group-hover:-translate-x-0"></span>
                        <span className="absolute inset-0 border-l-2 border-black transform translate-y-full transition-transform duration-300 group-hover:-translate-y-0"></span>
                    </a>
                </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center relative">
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    navigation={{
                        prevEl: '.prev',
                        nextEl: '.next',
                    }}
                    loop={true}
                    className="max-w-md"
                >
                    {images.map((src, index) => (
                        <SwiperSlide key={index}>
                            <Image
                                src={src}
                                alt={`Slide ${index + 1}`}
                                className="object-cover"
                                width={500}
                                height={400}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* Navigation Buttons */}
                <div className="flex justify-center mt-4 w-full">
                    <button className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-zinc-200 focus:outline-none group hover:border-black">
                        <Image
                            loading="lazy"
                            src="/icons/right-arrow.svg"
                            width={20}
                            height={20}
                            alt="Previous Slide"
                            className="prev rotate-180 "
                        />
                    </button>
                    <button className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-zinc-200 focus:outline-none group mx-4 hover:border-black">
                        <Image
                            loading="lazy"
                            src="/icons/right-arrow.svg"
                            width={20}
                            height={20}
                            alt="Next Slide"
                            className="next"
                        />
                    </button>
                </div>
            </div>
        </section>
    );
}
