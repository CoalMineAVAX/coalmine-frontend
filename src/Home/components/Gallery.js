import { Card } from "@mui/material";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const items = [
  {
    original: "https://picsum.photos/id/300/300/200",
  },
  {
    original: "https://picsum.photos/id/301/300/200",
  },
  {
    original: "https://picsum.photos/id/302/300/200",
  },
  {
    original: "https://picsum.photos/id/304/300/200",
  },
  {
    original: "https://picsum.photos/id/305/300/200",
  },
  {
    original: "https://picsum.photos/id/306/300/200",
  },
];

export default function Gallery() {
  return (
    <Card
      style={{
        marginBottom: 24,
        marginLeft: -24,
        marginRight: -24,
        borderRadius: 0,
      }}
    >
      <ImageGallery
        items={items}
        showBullets
        showPlayButton={false}
        showThumbnails={false}
        showNav={false}
        showFullscreenButton={false}
        autoPlay={true}
        lazyLoad={true}
      />
    </Card>
  );
}
