import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import getResults from "../../utils/cachedImages";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";
import cloudinary from "../../utils/cloudinary";

const PhotoPage: NextPage<{ currentPhoto: ImageProps }> = ({ currentPhoto }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const index = Number(photoId);

  const currentPhotoUrl = `https://res.cloudinary.com/${
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }/image/upload/c_scale,w_2560/${currentPhoto.public_id}.${currentPhoto.format}`;

  return (
    <>
      <Head>
        <title>Диктант Победы 2025 - Фото {index + 1}</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
        <meta name="description" content={`Фотография участника Диктанта Победы 2025 - ${currentPhoto.public_id}`} />
      </Head>
      
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default PhotoPage;

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const results = await getResults();

    const reducedResults: ImageProps[] = results.resources.map(
      (result: any, index: number) => ({
        id: index,
        height: result.height,
        width: result.width,
        public_id: result.public_id,
        format: result.format,
      })
    );

    const currentPhoto = reducedResults.find(
      (img) => img.id === Number(context.params?.photoId)
    );

    if (!currentPhoto) {
      return { notFound: true };
    }

    currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto);

    return {
      props: {
        currentPhoto,
      },
      // Ревалидация каждые 60 минут
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.error("Error generating photo page:", error);
    return {
      notFound: true,
    };
  }
};

export async function getStaticPaths() {
  try {
    const results = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("public_id", "asc")
      .max_results(600)
      .execute();

    const paths = results.resources.map((_: any, index: number) => ({
      params: { photoId: index.toString() },
    }));

    return {
      paths,
      fallback: "blocking", // Оптимальный режим для ISR
    };
  } catch (error) {
    console.error("Error generating paths:", error);
    return {
      paths: [],
      fallback: true,
    };
  }
}