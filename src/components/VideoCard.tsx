type Props = {
  title?: string;
  src?: string;
};

export default function VideoCard({
  title = "Aktivitas Pembelajaran",
  src = "https://www.youtube.com/embed/dQw4w9WgXcQ",
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 sm:p-6 backdrop-blur">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={src}
          title={title}
          loading="lazy"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
