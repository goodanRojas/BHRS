import { motion, useMotionValue, animate } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import axios from "axios";

export default function RecommendationsCarousel({className = ""}) {
    const [buildings, setBuildings] = useState([]);

    useEffect(() => {
        axios.get(route('user.recommendation.get.user.preferred.buildings'))
            .then((response) => {
                setBuildings(response.data.buildings);
            });
    }, []);

    const FAST_DURATION = 25;
    const SLOW_DURATION = 75;

    const [duration, setDuration] = useState(FAST_DURATION);
    let [ref, { width }] = useMeasure();
    const xTranslation = useMotionValue(0);
    const [mustFinish, setMustFinish] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [showOverlay, setShowOverlay] = useState(null);

    useEffect(() => {
        let controls;
        let finalPosition = -width / 2 - 8;

        if (mustFinish) {
            controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
                ease: 'linear',
                duration: duration * (1 - xTranslation.get() / finalPosition),
                onComplete: () => {
                    setMustFinish(false);
                    setRerender(!rerender);
                },
            });
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

    return (
        <motion.div className={`${buildings.length === 0 ? 'hidden' : ''} ${className} overflow-hidden w-full relative py-4`}>
            <h1 className="font-bold text-gray-800 uppercase tracking-tight py-4">
                Recommendations
            </h1>
            <motion.div
                ref={ref}
                className="flex gap-5 cursor-grab"
                style={{ x: xTranslation }}
                drag="x" // enable horizontal dragging
                dragConstraints={{ left: -width, right: 0 }} // limit dragging boundaries
                dragElastic={0.2} // optional, makes dragging feel natural
                onDragStart={() => setMustFinish(true)} // pause auto-scroll when user drags
                onDragEnd={() => setMustFinish(false)} // resume auto-scroll after drag
                onHoverStart={() => { setMustFinish(true); setDuration(SLOW_DURATION); }}
                onHoverEnd={() => { setMustFinish(true); setDuration(FAST_DURATION); }}
            >
                {buildings.map((building, index) => (
                    <motion.div
                        onHoverStart={() => setShowOverlay(index)}
                        onHoverEnd={() => setShowOverlay(null)}
                        key={building.id}
                        onClick={() => window.location.href = `/home/building/${building.id}`}
                        className="relative overflow-hidden flex-none w-[160px] bg-white rounded-lg shadow flex flex-col"
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

                        {/* Building Image */}
                        <img
                            src={`/storage/${building.image ? building.image : 'building/building.png'}`}
                            alt={building.name}
                            className="w-full h-24 object-cover rounded-t-lg"
                        />

                        {/* Content */}
                        <div className="p-2 flex flex-col gap-1 flex-1">
                            <h3 className="text-sm font-semibold truncate">{building.name}</h3>
                            <p className="text-xs text-gray-600">{building.address?.address?.municipality}, {building.address?.address?.province}</p>
                            <div className="flex items-center gap-1 text-yellow-500 text-xs">
                                <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                                <span className="text-gray-700">{building.avg_rating ?? 0}</span>
                            </div>

                            {/* User avatars */}
                            <div className="flex -space-x-1 mt-1">
                                {building.user_images?.map((user, idx) => (
                                    <img
                                        key={idx}
                                        src={user.avatar}
                                        alt={user.name}
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
