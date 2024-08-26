"use client";

import Image from "next/image";
import { Swiper, SwiperSlide, SwiperButton } from "swiper/react";
import { Pagination, Navigation, EffectCoverflow } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "./styles.css"

const HowPramanAIWorks = () => {
    return (
        <div className="bg-white pb-8 pt-8 overflow-x-auto w-[78%] ">
            <div className="w-full flex justify-between items-center px-4 lg:px-8">
                <h2 className="font-semibold text-2xl">How PramanAI Works</h2>
                <div className="relative flex text-2xl gap-4">
                    <button className=" relative flex items-center justify-center w-8 h-8 rounded-full  border-2 border-zinc-200 focus:outline-none group">
                        <Image
                            loading="lazy"
                            src="/icons/right-arrow.svg"
                            width={20}
                            height={20}
                            alt="Previous Slide"
                            className="back rotate-180"
                        />
                        <span className="absolute inset-0 border-2 border-transparent group-hover:border-black transition-transform transform -rotate-45 scale-100 group-hover:rotate-45 group-hover:scale-110 rounded-full"></span>
                    </button>
                    <button className=" relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-zinc-200 focus:outline-none group">
                        <Image
                            loading="lazy"
                            src="/icons/right-arrow.svg"
                            width={20}
                            height={20}
                            alt="Next Slide"
                            className="right"
                        />
                        <span className="absolute inset-0 border-2 border-transparent group-hover:border-black transition-transform transform -rotate-45 scale-100 group-hover:rotate-45 group-hover:scale-110 rounded-full"></span>
                    </button>
                </div>
            </div>

            <Swiper
                effect="coverflow"
                slidesPerView={1}
                navigation={{
                    nextEl: ".right",
                    prevEl: ".back",
                }}
                noSwiping={false}
                allowSlidePrev={true}
                allowSlideNext={true}
                loop={true}
                mousewheel={{
                    forceToAxis: true,
                    invert: false,
                }}
                freeMode={{
                    enabled: false,
                    sticky: true,
                    momentum: true,
                    momentumRatio: 0.5,
                    momentumBounceRatio: 0.5,
                }}
                pagination={{ clickable: true }}
                coverflowEffect={{
                    rotate: 0,
                    depth: 150,
                    slideShadows: false,
                }}
                className="max-w-4xl mx-auto mt-8"
                touchEventsTarget="container"
            >
                <SwiperSlide>
                    <div className="p-6 bg-white text-black">
                        <h3 className="text-xl font-semibold">1. Upload Legal Documents</h3>
                        <p className="mt-4 text-base">
                            Easily upload your legal documents for analysis. Our platform supports various formats and ensures that your documents are processed securely.
                        </p>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="p-6 bg-white text-black">
                        <h3 className="text-xl font-semibold">2. AI Analyzes Data and Metadata</h3>
                        <p className="mt-4 text-base">
                            Our AI processes the documents, extracting key data and metadata. This step includes identifying important sections and summarizing relevant information.
                        </p>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="p-6 bg-white text-black">
                        <h3 className="text-xl font-semibold">3. Extracted Data and Insights Available for Review</h3>
                        <p className="mt-4 text-base">
                            Review the extracted data and insights for further action. The platform provides an intuitive interface to manage and analyze the results.
                        </p>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default HowPramanAIWorks;
