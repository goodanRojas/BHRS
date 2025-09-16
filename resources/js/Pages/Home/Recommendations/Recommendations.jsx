import { motion, useMotionValue, animate } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";

const beds = [
    {
        id: 1,
        name: "Bed A1",
        image: "/storage/bed/bed.png",
        price: "₱2,500 / month",
        rating: 4.5,
        users: ["/storage/user/user.webp", "/storage/user/user.webp", "/storage/user/user.webp"],
    },
    {
        id: 2,
        name: "Bed B2",
        image: "/storage/bed/bed.png",
        price: "₱3,000 / month",
        rating: 4.7,
        users: ["/storage/user/user.webp", "/storage/user/user.webp", "/storage/user/user.webp"],
    },
    {
        id: 3,
        name: "Bed B3",
        image: "/storage/bed/bed.png",
        price: "₱3,000 / month",
        rating: 4.7,
        users: ["/storage/user/user.webp", "/storage/user/user.webp", "/storage/user/user.webp"],
    },
    {
        id: 4,
        name: "Bed B4",
        image: "/storage/bed/bed.png",
        price: "₱3,000 / month",
        rating: 4.7,
        users: ["/storage/user/user.webp", "/storage/user/user.webp", "/storage/user/user.webp"],
    },
    {
        id: 5,
        name: "Bed B5",
        image: "/storage/bed/bed.png",
        price: "₱3,000 / month",
        rating: 4.7,
        users: ["/storage/user/user.webp", "/storage/user/user.webp", "/storage/user/user.webp"],
    },
    {
        id: 6,
        name: "Bed B6",
        image: "/storage/bed/bed.png",
        price: "₱3,000 / month",
        rating: 4.7,
        users: ["/storage/user/user.webp", "/storage/user/user.webp", "/storage/user/user.webp"],
    },
    {
        id: 7,
        name: "Bed B7",
        image: "/storage/bed/bed.png",
        price: "₱3,000 / month",
        rating: 4.7,
        users: ["/storage/user/user.webp", "/storage/user/user.webp", "/storage/user/user.webp"],
    },
];

export default function RecommendationsCarousel() {

    const FAST_DURATION = 25;
    const SLOW_DURATION = 75;

    const [duration, setDuration] = useState(FAST_DURATION);
    let [ref, { width }] = useMeasure();

    const xTranslation = useMotionValue(0);

    const [mustFinish, setMustFinish] = useState(false);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        let controls;
        let finalPosition = -width / 2 - 8; //4 because we have 4 copies in the mapping.

        if (mustFinish) {
            controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
                ease: 'linear',
                duration: duration * (1 - xTranslation.get() / finalPosition),
                onComplete: () => {
                    setMustFinish(false);
                    setRerender(!rerender);
                },

            })
        } else {

            controls = animate(xTranslation, [0, finalPosition], {
                ease: "linear",
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0,
            });
        }

        return () => controls.stop();
    }, [xTranslation, width, duration, rerender]);
    const [showOverlay, setShowOverlay] = useState(null);

    return (
        <motion.div className="overflow-hidden w-full relative py-4">
            <h1
                className=" font-bold text-gray-800 uppercase tracking-tight py-4"
            >Recommendations</h1>
            <motion.div
                ref={ref}
                className="flex gap-5"
                style={{ x: xTranslation }}
                onHoverStart={() => {
                    setMustFinish(true);
                    setDuration(SLOW_DURATION);
                }}
                onHoverEnd={() => {
                    setMustFinish(true);
                    setDuration(FAST_DURATION)
                }}
            >
                {[...beds, ...beds,].map((bed, index) => (
                    <motion.div
                        onHoverStart={() => setShowOverlay(index)}
                        onHoverEnd={() => setShowOverlay(null)}
                        key={index}
                        className="relative overflow-hidden flex-none  w-[160px] bg-white rounded-lg shadow flex flex-col"
                    >
                        {/* Overlay */}
                        {showOverlay === index && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-10 flex justify-center items-center"
                            >
                                <div className="absolute bg-black/50 pointer-events-none h-full w-full flex items-center justify-center">
                                    <motion.h1
                                        initial={{ y: 10 }}
                                        animate={{ y: 0 }}
                                        exit={{ y: 10 }}
                                        className="bg-white font-medium text-xs z-10 px-2 py-1 rounded-full shadow"
                                    >
                                        Explore Now
                                    </motion.h1>
                                </div>
                            </motion.div>
                        )}

                        {/* Image */}
                        <img
                            src={bed.image}
                            alt={bed.name}
                            className="w-full h-24 object-cover rounded-t-lg"
                        />

                        {/* Content */}
                        <div className="p-2 flex flex-col gap-1 flex-1">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-l from-indigo-500 to-transparent"></div>
                          
                            <h3 className="text-sm font-semibold truncate">{bed.name}</h3>
                            <p className="text-xs text-gray-600">{bed.price}</p>
                            <div className="flex items-center gap-1 text-yellow-500 text-xs">
                                <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                                <span className="text-gray-700">{bed.rating}</span>
                            </div>

                            {/* Users */}
                            <div className="flex -space-x-1 mt-1">
                                {bed.users.map((user, idx) => (
                                    <img
                                        key={idx}
                                        src={user}
                                        alt={`user-${idx}`}
                                        className="w-6 h-6 rounded-full object-cover border border-white"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                ))}
            </motion.div>
        </motion.div>
    );
}
