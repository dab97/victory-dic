import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { variants } from "../utils/animationVariants";
import downloadPhoto from "../utils/downloadPhoto";
import { range } from "../utils/range";
import type { ImageProps, SharedModalProps } from "../utils/types";

export default function SharedModal({
  index,
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
}: SharedModalProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let filteredImages = images?.filter((img: ImageProps) =>
    range(index - 15, index + 15).includes(img.id)
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < (images?.length ?? 0) - 1) {
        changePhotoId(index + 1);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1);
      }
    },
    trackMouse: true,
  });

  let currentImage = images ? images[index] : currentPhoto;

  useEffect(() => {
    setLoaded(false);
    setError(null);
  }, [currentImage]);

  const handleImageLoad = useCallback(() => {
    setLoaded(true);
    setError(null);
  }, []);

  const handleImageError = useCallback(() => {
    setError("Не удалось загрузить изображение. Пожалуйста, попробуйте еще раз.");
    setLoaded(false);
  }, []);

  if (!currentImage) {
    return <div className="text-white">Изображение не найдено</div>;
  }

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className="relative z-50 flex flex-col w-full max-w-[848px] items-center justify-between h-screen"
        {...handlers}
      >
        {/* Main image */}
        <div className="w-full h-[calc(100%-70px)] rounded-2xl overflow-hidden">
          <div className="relative flex items-center justify-center h-full">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <Image
                  src={`https://res.cloudinary.com/${
                    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                  }/image/upload/c_scale,${navigation ? "w_1280" : "w_1920"}/${
                    currentImage.public_id
                  }.${currentImage.format}`}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  priority
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={`object-contain w-full h-full transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                />
                {!loaded && !error && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-center px-4">
                    {error}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0">
            {navigation && (
              <>
                {index > 0 && (
                  <button
                    className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none pointer-events-auto"
                    onClick={() => changePhotoId(index - 1)}
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                )}
                {index + 1 < (images?.length ?? 0) && (
                  <button
                    className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none pointer-events-auto"
                    onClick={() => changePhotoId(index + 1)}
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                )}
              </>
            )}

            {/* Top controls */}
            <div className="absolute top-0 right-0 flex items-center gap-2 p-3 text-white pointer-events-auto">
              {navigation && (
                <a
                  href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  target="_blank"
                  title="Открыть полноразмерную версию"
                  rel="noreferrer"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </a>
              )}
              <button
                onClick={() =>
                  downloadPhoto(
                    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`,
                    `${index}.jpg`
                  )
                }
                className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                title="Скачать полноразмерную версию"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Close button */}
            <div className="absolute top-0 left-0 flex items-center gap-2 p-3 text-white pointer-events-auto">
              <button
                onClick={closeModal}
                className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
              >
                {navigation ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <ArrowUturnLeftIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom navigation with thumbnails */}
        {navigation && (
          <div className="w-full h-[70px] overflow-hidden bg-black/90 rounded-lg">
            <motion.div
              initial={false}
              className="flex h-full items-center justify-start gap-1 px-2"
            >
              <AnimatePresence initial={false}>
                {filteredImages?.map(({ public_id, format, id }) => (
                  <motion.button
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: 1,
                      width: "auto",
                      scale: id === index ? 1.25 : 1,
                    }}
                    exit={{ opacity: 0, width: 0 }}
                    onClick={() => changePhotoId(id)}
                    key={id}
                    className={`${
                      id === index
                        ? "z-20 ring-2 ring-white"
                        : "z-10 brightness-50 hover:brightness-75"
                    } relative h-full shrink-0 overflow-hidden rounded focus:outline-none`}
                  >
                    <Image
                      alt={`Миниатюра ${id + 1}`}
                      width={80}
                      height={60}
                      className="h-full w-auto object-cover"
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_180/${public_id}.${format}`}
                    />
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}