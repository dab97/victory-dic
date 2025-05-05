import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import pLimit from "p-limit";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const Home: NextPage<{ images: ImageProps[] }> = ({ images }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  const filteredImages = images.filter((image) =>
    image.public_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Диктант Победы 2025</title>
        <meta
          property="og:image"
          content="https://victory-dict.vercel.app/og-image.png"
        />
      </Head>

      <main className="mx-auto max-w-[1960px] flex-1 p-4">
        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-[470px]">
            <input
              type="text"
              placeholder="Поиск по фамилии..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-400 bg-black px-4 py-3 pr-12
                text-base text-gray-50 shadow-xl shadow-red-900/20 transition-all duration-200
                placeholder:text-gray-500 focus:border-red-900 focus:ring-1 
                focus:ring-red-900/50 focus:ring-offset-1"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 transform 
                items-center justify-center rounded-full bg-red-200 transition-all
                hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-900/50"
                aria-label="Сбросить поиск"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-800"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {photoId && (
          <Modal
            images={filteredImages}
            onClose={() => setLastViewedPhoto(photoId as string)}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {!searchQuery && (
            <Image
              alt="Диктант Победы 2025"
              className="rounded-lg border border-red-900 object-cover brightness-90
                transition-transform will-change-auto group-hover:brightness-110"
              style={{ transform: "translate3d(0, 0, 0)" }}
              src="/logo.png"
              width={720}
              height={480}
              sizes="(max-width: 640px) 100vw,
                (max-width: 1280px) 50vw,
                (max-width: 1536px) 33vw,
                25vw"
            />
          )}

          {filteredImages.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/victory/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="group relative block w-full cursor-zoom-in after:pointer-events-none 
                after:absolute after:inset-0 after:rounded-lg after:shadow-highlight after:content-['']"
            >
              <Image
                alt="Диктант Победы 2025"
                className="rounded-lg brightness-90 transition-transform duration-200 
                  will-change-auto group-hover:scale-[1.02]"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}

          {filteredImages.length === 0 && (
            <div className="col-span-full py-12">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center 
                  rounded-full bg-gradient-to-br from-red-600 to-red-800 p-4 shadow-lg 
                  shadow-red-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-white/90"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
                    <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                    <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
                    <path d="M9 10h.01" />
                    <path d="M15 10h.01" />
                    <path d="M9.5 15.1a3.5 3.5 0 0 1 5 0" />
                  </svg>
                </div>

                <div className="max-w-2xl space-y-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
                    Ничего не найдено по запросу
                  </h2>
                  <div className="text-lg sm:text-xl">
                    <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text 
                      font-medium text-transparent">
                      "{searchQuery}"
                    </span>
                  </div>
                  <p className="text-sm text-red-300/80 sm:text-base">
                    Проверьте правильность написания или попробуйте другой запрос
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto p-4 text-center text-white/80 sm:p-6">
        Филиал РГСУ в городе Минске
      </footer>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined");
  }

  if (!process.env.CLOUDINARY_FOLDER) {
    throw new Error("CLOUDINARY_FOLDER is not defined");
  }

  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "asc")
    .max_results(600)
    .execute();

  const reducedResults: ImageProps[] = results.resources.map(
    (result: any, index: number) => ({
      id: index,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    })
  );

  const limit = pLimit(5);
  const blurPromises = reducedResults.map(image =>
    limit(async () => {
      try {
        return await getBase64ImageUrl(image);
      } catch (error) {
        console.warn(`Skipping image ${image.public_id}:`, error.message);
        return null;
      }
    })
  );

  const imagesWithBlur = await Promise.all(blurPromises);

  const validImages = reducedResults
    .map((image, index) => ({
      ...image,
      blurDataUrl: imagesWithBlur[index] || "",
    }))
    .filter(image => image.blurDataUrl);

  return {
    props: {
      images: validImages,
    },
    revalidate: 60 * 60,
  };
}